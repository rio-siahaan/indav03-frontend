"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Trash2,
  Search,
  Database,
  FileSpreadsheet,
} from "lucide-react";

interface FileData {
  id: string;
  name: string;
  type: string;
  bpsVarId?: number | null;
  bpsYear?: number | null;
  bpsSubject?: string | null;
  created_at: string;
}

export default function KnowledgeManager() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/admin/files");
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (error) {
      console.error("Failed to fetch files", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this knowledge source?"))
      return;

    try {
      const res = await fetch(`/api/admin/files?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="text-gray-500 mt-1">
          View all synced data sources from BPS API and manual uploads
        </p>
      </div>

      {/* Files List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Knowledge Sources ({filteredFiles.length})
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No knowledge sources found</p>
            <p className="text-sm mt-1">Use BPS Sync to add data</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1">
                  {file.type === "bps" ? (
                    <Database className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <FileSpreadsheet className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          file.type === "bps"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {file.type === "bps" ? "BPS API" : "Upload"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(file.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {file.type === "bps" && file.bpsYear && (
                        <span className="text-xs text-gray-500">
                          Year: {2000 + file.bpsYear - 100}
                        </span>
                      )}
                      {file.type === "bps" && file.bpsSubject && (
                        <span className="text-xs text-gray-500">
                          {file.bpsSubject}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
