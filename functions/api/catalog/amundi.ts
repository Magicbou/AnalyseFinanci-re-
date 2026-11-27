type CatalogRow = { ticker: string; wkn: string; name: string; isin: string; currency: string; ongoingCharges: string | null; assetsUnderManagement: string | null; sfdr: string | null; exposure: string | null; nav: string | null; navDate: string | null; performanceYtd: string | null; performance1y: string | null; sourceUrl: string };
type PagesContext = { request: Request; env: { AMUNDI_CATALOG_URL?: string } };

const DEFAULT_SOURCE = "https://www.amundietf.fr/fr/particuliers/produits-etf/recherche";

function clean(value: string): string {
  return value.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&euro;/gi, "€").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/\s+/g, " ").trim();
}

function parseRows(html: string, sourceUrl: string): CatalogRow[] {
  const marker = html.indexOf("ETF_FINDER_SUMMARY");
  const source = marker >= 0 ? html.slice(marker) : html;
  const rows = source.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
  const output: CatalogRow[] = [];
  for (const row of rows) {
    const cells = [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(match => clean(match[1]));
    if (cells.length < 12) continue;
    const ticker = cells[0] ?? "";
    const name = cells[2] ?? "";
    const isinMatch = name.match(/\bISIN(?:\s+code)?\s+([A-Z]{2}[A-Z0-9]{10})\b/i);
    if (!ticker || !isinMatch) continue;
    const navText = cells[9] ?? "";
    const navMatch = navText.match(/^([\d.,-]+)\s+(\d{2}\/\d{2}\/\d{4})$/);
    output.push({
      ticker, wkn: cells[1] ?? "", name: name.replace(/\s+Code\s+ISIN.*$/i, "").replace(/\s+ISIN(?:\s+code)?\s+[A-Z]{2}[A-Z0-9]{10}/i, "").trim(),
      isin: isinMatch[1].toUpperCase(), currency: cells[3] ?? "", ongoingCharges: cells[4] || null,
      assetsUnderManagement: cells[5] || null, sfdr: cells[6] || null, exposure: cells[8] || null,
      nav: navMatch?.[1] ?? null, navDate: navMatch?.[2] ?? null, performanceYtd: cells[10] || null,
      performance1y: cells[11] || null, sourceUrl
    });
  }
  return output;
}

export async function onRequestGet({ request, env }: PagesContext): Promise<Response> {
  const sourceUrl = env.AMUNDI_CATALOG_URL || DEFAULT_SOURCE;
  const requested = new URL(request.url);
  const search = (requested.searchParams.get("q") || "").trim().toLowerCase();
  try {
    const response = await fetch(sourceUrl, { headers: { "Accept": "text/html", "User-Agent": "InvestPilot/0.1 (+catalogue source attribution)" }, cf: { cacheTtl: 900, cacheEverything: true } });
    if (!response.ok) return Response.json({ status: "source_unavailable", source: sourceUrl, upstreamStatus: response.status, products: [] }, { status: 502 });
    const html = await response.text();
    const products = parseRows(html, sourceUrl);
    const totalMatch = html.match(/([\d\s]+)\s+produit\(s\)\s*trouv[ée]s/i);
    const sourceTotal = totalMatch ? Number(totalMatch[1].replace(/\s/g, "")) : null;
    const filtered = search ? products.filter(p => [p.name, p.isin, p.ticker, p.wkn, p.exposure].some(v => v.toLowerCase().includes(search))) : products;
    return Response.json({
      status: products.length ? "ok" : "unparsed_source",
      source: sourceUrl, retrievedAt: new Date().toISOString(), sourceTotal,
      returnedCount: filtered.length, pageCount: products.length,
      completeness: sourceTotal !== null && products.length >= sourceTotal ? "complete" : "partial",
      notice: "Les valeurs liquidatives Amundi ne sont pas des cours de marché en temps réel. Aucun cours live n'est fourni par cet endpoint.",
      products: filtered
    }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=900", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return Response.json({ status: "source_unavailable", source: sourceUrl, products: [] }, { status: 502 });
  }
}
