import { ContentForm } from "@/components/admin/ContentForm";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const content = await getSiteContent();

  return (
    <div className="max-w-4xl">
      <p className="eyebrow">Content</p>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-ink-900">Site content</h1>
      <p className="mt-1.5 text-sm text-ink-500">
        Editable copy that drives every section on the public site. Changes go live on save.
      </p>
      <div className="mt-8">
        <ContentForm initial={content} />
      </div>
    </div>
  );
}
