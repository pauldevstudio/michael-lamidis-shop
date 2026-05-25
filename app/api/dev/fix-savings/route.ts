/**
 * One-shot: recalculate savings % from originalPrice and salePrice
 * for every product. Fixes stale/wrong values like -91% on RB34C6B2E41.
 *
 * Hit: http://localhost:3000/api/dev/fix-savings
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const products = await payload.find({ collection: "products", limit: 500 });

    const fixed: { model: string; before: number; after: number }[] = [];
    for (const product of products.docs) {
      const p = product as Record<string, unknown>;
      const original = Number(p.originalPrice ?? 0);
      const sale = Number(p.salePrice ?? 0);
      const oldSavings = Number(p.savings ?? 0);

      if (original > 0 && sale > 0 && original > sale) {
        const correct = Math.round(((original - sale) / original) * 100);
        if (correct !== oldSavings) {
          await payload.update({
            collection: "products",
            id: p.id as string,
            data: { savings: correct },
          });
          fixed.push({
            model: (p.model as string) ?? "?",
            before: oldSavings,
            after: correct,
          });
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Recalculated savings on ${fixed.length} products.`,
      fixed,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
