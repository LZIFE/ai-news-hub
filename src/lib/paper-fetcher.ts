import { Paper } from './types';
import { arxivCategories } from './paper-sources';

// ─── arXiv API ───────────────────────────────────────────────

function parseArxivXml(xml: string): Paper[] {
  const entries: Paper[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryXml = match[1];

    const idMatch = entryXml.match(/<id>([^<]+)<\/id>/);
    const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
    const summaryMatch = entryXml.match(/<summary>([\s\S]*?)<\/summary>/);
    const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/);

    const authors: string[] = [];
    const authorRegex = /<author>\s*<name>([^<]+)<\/name>\s*<\/author>/g;
    let authorMatch;
    while ((authorMatch = authorRegex.exec(entryXml)) !== null) {
      authors.push(authorMatch[1].trim());
    }

    const categories: string[] = [];
    const catRegex = /<category[^>]*term="([^"]+)"/g;
    let catMatch;
    while ((catMatch = catRegex.exec(entryXml)) !== null) {
      categories.push(catMatch[1]);
    }

    if (idMatch && titleMatch) {
      const rawId = idMatch[1];
      const arxivId = rawId.replace('http://arxiv.org/abs/', '').replace(/v\d+$/, '');

      entries.push({
        id: arxivId,
        title: titleMatch[1].replace(/\s+/g, ' ').trim(),
        authors,
        abstract: (summaryMatch?.[1] || '').replace(/\s+/g, ' ').trim(),
        categories,
        publishedAt: publishedMatch?.[1] || new Date().toISOString(),
        pdfUrl: `https://arxiv.org/pdf/${arxivId}`,
        arxivUrl: `https://arxiv.org/abs/${arxivId}`,
        source: 'arxiv',
      });
    }
  }

  return entries;
}

async function fetchFromArxiv(categoryId: string): Promise<Paper[]> {
  const url = `https://export.arxiv.org/api/query?search_query=cat:${categoryId}&sortBy=submittedDate&sortOrder=descending&max_results=20`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AI News Hub Papers/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseArxivXml(xml).filter((p) => p.title.length > 0);
  } catch (error) {
    console.error(`Failed to fetch arXiv ${categoryId}:`, error);
    return [];
  }
}

// ─── OpenAlex API ────────────────────────────────────────────

interface OpenAlexAuthorship {
  author: { display_name: string };
}

interface OpenAlexResult {
  id: string;
  title: string;
  authorships: OpenAlexAuthorship[];
  abstract_inverted_index: Record<string, number[]> | null;
  publication_date: string;
  doi: string | null;
  primary_location: {
    landing_page_url: string | null;
    pdf_url: string | null;
    source?: { display_name: string };
  } | null;
  cited_by_count: number;
  concepts: { id: string; display_name: string }[];
}

function reconstructAbstract(invertedIndex: Record<string, number[]> | null): string {
  if (!invertedIndex) return '';
  const wordPositions: [string, number][] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      wordPositions.push([word, pos]);
    }
  }
  wordPositions.sort((a, b) => a[1] - b[1]);
  return wordPositions.map(([word]) => word).join(' ');
}

async function fetchFromOpenAlex(): Promise<Paper[]> {
  const conceptIds = [
    'C154945302', // Artificial Intelligence
    'C119857082', // Machine Learning
    'C108583219', // Natural Language Processing
    'C153179516', // Computer Vision
  ];

  const papers: Paper[] = [];

  for (const conceptId of conceptIds) {
    try {
      const url = `https://api.openalex.org/works?filter=concepts.id:${conceptId},from_publication_date:2026-06-01,is_oa:true&per_page=15&select=id,title,authorships,abstract_inverted_index,publication_date,doi,primary_location,cited_by_count,concepts`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'AI News Hub (mailto:ai-news@example.com)' },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      for (const item of data.results || []) {
        const arxivDoi = item.doi?.match(/arxiv\.org\/abs\/(\d+\.\d+)/);
        const arxivId = arxivDoi?.[1];

        const categories = (item.concepts || [])
          .map((c: { display_name: string }) => c.display_name)
          .slice(0, 5);

        const pdfUrl = item.primary_location?.pdf_url
          || (arxivId ? `https://arxiv.org/pdf/${arxivId}` : item.doi || '');

        const landingUrl = item.primary_location?.landing_page_url || item.doi || '';

        papers.push({
          id: arxivId || item.id.replace('https://openalex.org/', ''),
          title: (item.title || '').replace(/\s+/g, ' ').trim(),
          authors: (item.authorships || []).map((a: OpenAlexAuthorship) => a.author.display_name),
          abstract: reconstructAbstract(item.abstract_inverted_index),
          categories,
          publishedAt: item.publication_date ? new Date(item.publication_date).toISOString() : new Date().toISOString(),
          pdfUrl,
          arxivUrl: arxivId ? `https://arxiv.org/abs/${arxivId}` : landingUrl,
          source: 'openalex',
          citationCount: item.cited_by_count || 0,
          venue: item.primary_location?.source?.display_name,
        });
      }

      await new Promise((r) => setTimeout(r, 200));
    } catch (error) {
      console.error(`Failed to fetch OpenAlex concept ${conceptId}:`, error);
    }
  }

  return papers;
}

// ─── Semantic Scholar (enrichment) ───────────────────────────

async function enrichWithSemanticScholar(papers: Paper[]): Promise<Paper[]> {
  const arxivPapers = papers.filter((p) => p.source === 'arxiv' && !p.citationCount);
  if (arxivPapers.length === 0) return papers;

  const batchSize = 10;
  for (let i = 0; i < arxivPapers.length; i += batchSize) {
    const batch = arxivPapers.slice(i, i + batchSize);
    const ids = batch.map((p) => `ARXIV:${p.id}`);

    try {
      const res = await fetch('https://api.semanticscholar.org/graph/v1/paper/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AI News Hub/1.0',
        },
        body: JSON.stringify({ ids, fields: 'citationCount,venue,externalIds' }),
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok) {
        const results = await res.json();
        for (let j = 0; j < results.length; j++) {
          const ssPaper = results[j];
          if (!ssPaper) continue;
          const paper = batch[j];
          if (ssPaper.citationCount) paper.citationCount = ssPaper.citationCount;
          if (ssPaper.venue) paper.venue = ssPaper.venue;
        }
      }
    } catch (error) {
      console.error('Semantic Scholar batch request failed:', error);
    }

    if (i + batchSize < arxivPapers.length) {
      await new Promise((r) => setTimeout(r, 1100));
    }
  }

  return papers;
}

// ─── Main fetcher ────────────────────────────────────────────

let cachedPromise: Promise<Paper[]> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000;

export async function fetchAllPapers(): Promise<Paper[]> {
  const now = Date.now();
  if (cachedPromise && now - cacheTimestamp < CACHE_TTL) {
    return cachedPromise;
  }

  cachedPromise = (async () => {
    const [arxivResults, openalexResults] = await Promise.allSettled([
      Promise.all(arxivCategories.map((cat) => fetchFromArxiv(cat.id))),
      fetchFromOpenAlex(),
    ]);

    const arxivPapers = arxivResults.status === 'fulfilled'
      ? arxivResults.value.flat()
      : [];

    const openalexPapers = openalexResults.status === 'fulfilled'
      ? openalexResults.value
      : [];

    let allPapers = [...arxivPapers, ...openalexPapers];

    // Deduplicate by arXiv ID or title
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const deduplicated: Paper[] = [];

    for (const paper of allPapers) {
      const normTitle = paper.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenIds.has(paper.id) || seenTitles.has(normTitle)) continue;
      seenIds.add(paper.id);
      seenTitles.add(normTitle);
      deduplicated.push(paper);
    }

    // Enrich with Semantic Scholar citation data
    await enrichWithSemanticScholar(deduplicated);

    return deduplicated.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  })();

  cacheTimestamp = now;
  return cachedPromise;
}

export async function fetchPaperById(id: string): Promise<Paper | undefined> {
  const allPapers = await fetchAllPapers();
  return allPapers.find((p) => p.id === id);
}

export { PAPER_REVALIDATE } from './paper-sources';
