type CatalogRow = { ticker: string; wkn: string; name: string; isin: string; currency: string; ongoingCharges: string | null; assetsUnderManagement: string | null; sfdr: string | null; exposure: string | null; nav: string | null; navDate: string | null; performanceYtd: string | null; performance1y: string | null; sourceUrl: string };
type PagesContext = { request: Request };

const SOURCE_URL = "https://www.amundietf.fr/fr/particuliers/produits-etf/recherche";

function clean(value: string): string {
  return value.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&euro;/gi, "€")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/\s+/g, " ").trim();
}

function parseRows(html: string): CatalogRow[] {
  const marker = html.indexOf("ETF_FINDER_SUMMARY");
  const source = marker >= 0 ? html.slice(marker) : html;
  const rows = source.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
  const output: CatalogRow[] = [];
  for (const row of rows) {
    const cells = [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(match => clean(match[1]));
    if (cells.length < 12) continue;
    const ticker = cells[0] ?? "";
    const productLabel = cells[2] ?? "";
    const isinMatch = productLabel.match(/\bISIN(?:\s+code)?\s+([A-Z]{2}[A-Z0-9]{10})\b/i);
    if (!ticker || !isinMatch) continue;
    const navMatch = (cells[9] ?? "").match(/^([\d.,-]+)\s+(\d{2}\/\d{2}\/\d{4})$/);
    output.push({
      ticker, wkn: cells[1] ?? "",
      name: productLabel.replace(/\s+Code\s+ISIN.*$/i, "").replace(/\s+ISIN(?:\s+code)?\s+[A-Z]{2}[A-Z0-9]{10}/i, "").trim(),
      isin: isinMatch[1].toUpperCase(), currency: cells[3] ?? "", ongoingCharges: cells[4] || null,
      assetsUnderManagement: cells[5] || null, sfdr: cells[6] || null, exposure: cells[8] || null,
      nav: navMatch?.[1] ?? null, navDate: navMatch?.[2] ?? null,
      performanceYtd: cells[10] || null, performance1y: cells[11] || null, sourceUrl: SOURCE_URL
    });
  }
  return output;
}

function discoverPaginationLinks(html: string): string[] {
  const base = new URL(SOURCE_URL);
  const links = new Set<string>();
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    try {
      const candidate = new URL(match[1], SOURCE_URL);
      if (candidate.origin === base.origin && candidate.pathname === base.pathname && /(?:[?&])page=\d+/i.test(candidate.search)) links.add(candidate.toString());
    } catch { /* Ignore malformed links. */ }
  }
  return [...links].slice(0, 20);
}

export async function onRequestGet({ request }: PagesContext): Promise<Response> {
  const search = (new URL(request.url).searchParams.get("q") || "").trim().toLowerCase();
  try {
    const response = await fetch(SOURCE_URL, { headers: { Accept: "text/html", "User-Agent": "InvestPilot/0.1 (+catalogue source attribution)" } });
    if (!response.ok) return Response.json({ status: "source_unavailable", source: SOURCE_URL, upstreamStatus: response.status, products: [] }, { status: 502 });
    const firstPage = await response.text();
    const htmlPages = [firstPage];
    for (const pageUrl of discoverPaginationLinks(firstPage)) {
      const pageResponse = await fetch(pageUrl, { headers: { Accept: "text/html", "User-Agent": "InvestPilot/0.1 (+catalogue source attribution)" } });
      if (pageResponse.ok) htmlPages.push(await pageResponse.text());
    }
    const products = htmlPages.flatMap(parseRows);
    const uniqueProducts = [...new Map(products.map(product => [product.isin + "|" + product.ticker, product])).values()];
    const totalMatch = firstPage.match(/([\d\s]+)\s+produit\(s\)\s*trouvé(?:s|\(s\))?/i);
    const sourceTotal = totalMatch ? Number(totalMatch[1].replace(/\s/g, "")) : null;
    const filtered = search ? uniqueProducts.filter(product => [product.name, product.isin, product.ticker, product.wkn, product.exposure].some(value => value.toLowerCase().includes(search))) : uniqueProducts;
    return Response.json({
      status: uniqueProducts.length ? "ok" : "unparsed_source",
      source: SOURCE_URL, retrievedAt: new Date().toISOString(), sourceTotal,
      returnedCount: filtered.length, pageCount: uniqueProducts.length,
      completeness: sourceTotal !== null && uniqueProducts.length >= sourceTotal ? "complete" : "partial",
      notice: "Les valeurs liquidatives Amundi ne sont pas des cours de marché en temps réel. Aucun cours live n'est fourni par cet endpoint.",
      products: filtered
    }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=900", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return Response.json({ status: "source_unavailable", source: SOURCE_URL, products: [] }, { status: 502 });
  }
}
