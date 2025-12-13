"use client";

import { useState, useEffect, useCallback } from "react";
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

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/files");
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
        // Cache the data
        localStorage.setItem("knowledge_manager_files", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Failed to fetch files", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load from cache immediately
    const cached = localStorage.getItem("knowledge_manager_files");
    if (cached) {
      try {
        setFiles(JSON.parse(cached));
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse cache", error);
      }
    }

    // Fetch fresh data
    fetchFiles();

    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(fetchFiles, 30000);

    return () => clearInterval(interval);
  }, [fetchFiles]);

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
        <h1 className="text-3xl font-bold text-gray-900">Daftar Tabel</h1>
        <p className="text-gray-500 mt-1">
          Lihat semua sumber data yang disinkronkan dari BPS API dan unggahan manual.
        </p>
      </div>

      {/* Files List */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            ({filteredFiles.length}) Tabel Data
          </h2>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
            <p>Tidak ada tabel data.</p>
            <p className="text-sm mt-1">Gunakan <i>Sinkronisasi Data BPS</i> untuk menambahkan data.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {file.type === "bps" ? (
                    <Database className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <FileSpreadsheet className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 break-words md:max-w-full max-w-[50vw]">
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
                          Tahun: {2000 + file.bpsYear - 100}
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
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
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
