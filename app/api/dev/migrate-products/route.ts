/**
 * One-shot dev migration: copies data/site-content.json products into
 * Payload's `products` collection. Hit it in your browser:
 *
 *   http://localhost:3000/api/dev/migrate-products
 *
 * Safe to re-run - existing rows matched by brand+model get updated.
 *
 * DELETE THIS FILE BEFORE DEPLOYING TO PRODUCTION (open endpoint).
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });

    const dataPath = path.join(process.cwd(), "data", "site-content.json");
    const raw = fs.readFileSync(dataPath, "utf-8").replace(/\s+$/, "");
    const data = JSON.parse(raw);
    const products = (data as { products?: Array<Record<string, unknown>> }).products ?? [];

    const log: string[] = [];
    let created = 0;
    let updated = 0;

    for (const p of products) {
      const fields = {
        brand:         (p.brand as string) ?? "",
        model:         (p.model as string) ?? "",
        category:      (p.category as string) ?? "small-appliances",
        salePrice:     Number(p.salePrice ?? 0),
        originalPrice: Number(p.originalPrice ?? 0),
        savings:       Number(p.savings ?? 0),
        grade:         (p.grade as string) ?? "A",
        warranty:      Number(p.warranty ?? 12),
        description:   (p.description as string) ?? "",
        imageUrl:      (p.imageUrl as string) ?? "",
        icon:          (p.icon as string) ?? "Package",
        colorFrom:     (p.colorFrom as string) ?? "#3A5F8A",
        colorTo:       (p.colorTo as string) ?? "#7FAEDB",
        specs: Array.isArray(p.specs)
          ? (p.specs as Array<Record<string, unknown>>)
              .filter((s) =>
                typeof s?.label === "string" && (s.label as string).trim().length > 0 &&
                typeof s?.value === "string" && (s.value as string).trim().length > 0
              )
              .map((s) => ({ label: s.label as string, value: s.value as string }))
          : [],
      };

      if (!fields.brand || !fields.model) {
        log.push(`SKIP (no brand/model): ${JSON.stringify(p).slice(0, 80)}`);
        continue;
      }

      const existing = await payload.find({
        collection: "products",
        where: {
          and: [
            { brand: { equals: fields.brand } },
            { model: { equals: fields.model } },
          ],
        },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        await payload.update({
          collection: "products",
          id: existing.docs[0].id,
          data: fields,
        });
        updated++;
        log.push(`UPDATED  ${fields.brand} ${fields.model}`);
      } else {
        await payload.create({ collection: "products", data: fields });
        created++;
        log.push(`CREATED  ${fields.brand} ${fields.model}`);
      }
    }

    return NextResponse.json({
      ok: true,
      summary: `created=${created} updated=${updated} total=${products.length}`,
      log,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err), stack: err instanceof Error ? err.stack : undefined },
      { status: 500 },
    );
  }
}
