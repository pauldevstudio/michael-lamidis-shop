import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Button";
import { getProductById } from "@/lib/products";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";

  if (!isNew) {
    const product = await getProductById(id);
    if (!product) notFound();
    return <Editor title={`Edit: ${product.name}`} initial={product} />;
  }

  return <Editor title="New product" />;
}

function Editor({ title, initial }: { title: string; initial?: React.ComponentProps<typeof ProductForm>["initial"] }) {
  return (
    <div>
      <Link href="/admin/products">
        <Button size="sm" variant="ghost">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Button>
      </Link>
      <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight text-ink-900">{title}</h1>
      <div className="mt-6">
        <ProductForm initial={initial} />
      </div>
    </div>
  );
}
