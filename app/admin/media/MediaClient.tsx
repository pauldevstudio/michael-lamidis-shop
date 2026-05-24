"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Upload, Trash2, Copy, CheckCircle, AlertCircle, ImageIcon, RefreshCw } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

interface MediaFile { fileName: string; url: string; size: number; createdAt: string; }
type Toast = { type: "success" | "error"; msg: string } | null;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaClient() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [deleteFile, setDeleteFile] = useState<MediaFile | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "error", msg: string) => { setToast({ type, msg }); setTimeout(() => setToast(null), 4000); };

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/admin/upload"); if (res.ok) setFiles(await res.json()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const uploadFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(fileList)) {
      const form = new FormData(); form.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        if (res.ok) successCount++;
        else { const data = await res.json(); showToast("error", data.error ?? "Upload failed"); }
      } catch { showToast("error", "Network error during upload"); }
    }
    if (successCount > 0) { showToast("success", `${successCount} file${successCount > 1 ? "s" : ""} uploaded!`); await fetchFiles(); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); };

  const handleDeleteConfirm = async () => {
    if (!deleteFile) return;
    try {
      const res = await fetch(`/api/admin/upload?file=${encodeURIComponent(deleteFile.fileName)}`, { method: "DELETE" });
      if (res.ok) { showToast("success", "File deleted"); await fetchFiles(); }
      else showToast("error", "Failed to delete");
    } catch { showToast("error", "Network error"); } finally { setDeleteFile(null); }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium border"
          style={{ background: toast.type === "success" ? "#F0FDF4" : "#FEF2F2", borderColor: toast.type === "success" ? "#BBF7D0" : "#FECACA", color: toast.type === "success" ? "#166534" : "#991B1B" }}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}
      <AdminHeader title="Media Library" subtitle={`${files.length} files uploaded`}
        actions={
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)" }}>
            {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading…" : "Upload Files"}
          </button>
        }
      />
      <main className="flex-1 overflow-auto p-6">
        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer mb-6 transition-all ${dragOver ? "border-blue-400 bg-blue-50 scale-[1.01]" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? "bg-blue-100" : "bg-slate-100"}`}>
              <Upload className={`w-5 h-5 ${dragOver ? "text-blue-500" : "text-slate-400"}`} />
            </div>
            <div>
              <p className="text-slate-700 font-semibold text-sm">{dragOver ? "Drop to upload" : "Drop images here or click to browse"}</p>
              <p className="text-slate-400 text-xs mt-1">JPG, PNG, WebP, GIF, SVG · Max 5 MB each</p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-40"><RefreshCw className="w-5 h-5 animate-spin text-slate-400" /></div>
        ) : files.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm font-medium">No files uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map((file) => (
              <div key={file.fileName} className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt={file.fileName} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => copyUrl(file.url)} className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors shadow" title="Copy URL">
                      {copiedUrl === file.url ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => setDeleteFile(file)} className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-slate-600 hover:text-red-600 transition-colors shadow" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-slate-700 text-xs font-medium truncate">{file.fileName}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{formatSize(file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {deleteFile && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-5 h-5 text-red-500" /></div>
            <h3 className="text-slate-800 font-bold text-lg text-center mb-1">Delete Image?</h3>
            <p className="text-slate-500 text-sm text-center mb-1 truncate">{deleteFile.fileName}</p>
            <p className="text-slate-400 text-xs text-center mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteFile(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
