import { getOpsDb } from '../../../../lib/ops/db';
import { json } from '../../../../lib/ops/responses';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const batchNumber = url.searchParams.get('batch')?.trim();

  if (!batchNumber) {
    return json({ error: 'Batch number is required' }, 400);
  }

  const db = getOpsDb();
  const row = db.prepare(`
    SELECT
      c.batch_number,
      c.lab_name,
      c.test_date,
      c.purity_pct,
      c.heavy_metals_pass,
      c.endotoxins_pass,
      c.sterility_pass,
      c.report_url,
      p.name AS product_name
    FROM coa_batches c
    JOIN products p ON p.slug = c.product_slug
    WHERE c.batch_number = ?
  `).get(batchNumber) as Record<string, unknown> | undefined;

  if (!row) {
    return json({ error: 'Batch not found. Please verify the batch number on the product label.' }, 404);
  }

  return json({
    batchNumber: String(row.batch_number),
    productName: String(row.product_name),
    labName: String(row.lab_name),
    testDate: String(row.test_date),
    purityPct: row.purity_pct != null ? Number(row.purity_pct) : null,
    heavyMetalsPass: Number(row.heavy_metals_pass) === 1,
    endotoxinsPass: Number(row.endotoxins_pass) === 1,
    sterilityPass: Number(row.sterility_pass) === 1,
    reportUrl: String(row.report_url || ''),
  });
}
