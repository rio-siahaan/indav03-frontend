"use client";

import { useState, useEffect } from "react";
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Layers,
  Table,
} from "lucide-react";

interface Subject {
  sub_id: number;
  title: string;
}

interface Variable {
  val: number;
  label: string;
  unit: string;
  subj: string;
}

export default function BpsSyncManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedVar, setSelectedVar] = useState<number | null>(null);

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingVars, setLoadingVars] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    details?: string[];
  } | null>(null);

  // 1. Fetch Subjects on Mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/bps/subjects");
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  // 2. Fetch Variables when Subject Selected
  const handleSubjectChange = async (subId: number) => {
    setSelectedSubject(subId);
    setSelectedVar(null);
    setLoadingVars(true);
    setVariables([]);

    try {
      const res = await fetch(
        `http://localhost:8000/api/bps/variables/${subId}`
      );
      if (res.ok) {
        const data = await res.json();
        setVariables(data);
      }
    } catch (error) {
      console.error("Failed to fetch variables", error);
    } finally {
      setLoadingVars(false);
    }
  };

  // 3. Sync Logic
  const handleSync = async () => {
    if (!selectedVar) return;

    setSyncing(true);
    setMessage(null);

    try {
      // Sync last 5 years (2020-2025 -> 120-125)
      const res = await fetch(
        `http://localhost:8000/api/bps/sync-variable?var_id=${selectedVar}&start_year=120&end_year=125`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: `Sync Completed! Processed ${data.total_chunks} data points.`,
          details: data.details
            .filter((d: any) => !d.skipped)
            .map((d: any) => `Synced ${d.label}: ${d.count} items`),
        });
      } else {
        setMessage({ type: "error", text: data.detail || "Sync failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to connect to server" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">BPS Data Sync</h1>
        <p className="text-gray-500 mt-1">
          Directly sync statistical data from BPS API to Knowledge Base
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Selection */}
        <div className="lg:col-span-1 space-y-6">
          {/* Step 1: Subject */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              1. Select Subject
            </h2>

            {loadingSubjects ? (
              <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {subjects.map((sub) => (
                  <button
                    key={sub.sub_id}
                    onClick={() => handleSubjectChange(sub.sub_id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedSubject === sub.sub_id
                        ? "bg-blue-50 text-blue-700 border-blue-200 border"
                        : "hover:bg-gray-50 text-gray-600 border border-transparent"
                    }`}
                  >
                    {sub.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Variable */}
          {selectedSubject && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Table className="w-5 h-5 text-blue-600" />
                2. Select Table
              </h2>

              {loadingVars ? (
                <div className="space-y-2">
                  <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
                  <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {variables.map((v) => (
                    <button
                      key={v.val}
                      onClick={() => setSelectedVar(v.val)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedVar === v.val
                          ? "bg-blue-50 text-blue-700 border-blue-200 border"
                          : "hover:bg-gray-50 text-gray-600 border border-transparent"
                      }`}
                    >
                      <div className="line-clamp-2">{v.label}</div>
                      <div className="text-xs text-gray-400 mt-1 font-normal">
                        {v.unit}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Action & Status */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
            {!selectedVar ? (
              <div className="text-gray-400">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Ready to Sync</h3>
                <p className="text-sm mt-2">
                  Select a subject and a table to begin synchronization.
                </p>
              </div>
            ) : (
              <div className="w-full max-w-md space-y-6">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 text-lg mb-2">
                    Selected Data
                  </h3>
                  <p className="text-blue-700">
                    {variables.find((v) => v.val === selectedVar)?.label}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 bg-white/50 py-2 rounded-lg">
                    <RefreshCw className="w-4 h-4" />
                    Syncing data from 2020 - 2025
                  </div>
                </div>

                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Syncing with BPS...
                    </>
                  ) : (
                    <>
                      Start Sync Process
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {message && (
                  <div
                    className={`p-6 rounded-2xl text-left border ${
                      message.type === "success"
                        ? "bg-green-50 border-green-100 text-green-800"
                        : "bg-red-50 border-red-100 text-red-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-2">
                      {message.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      {message.type === "success" ? "Success" : "Error"}
                    </div>
                    <p>{message.text}</p>
                    {message.details && (
                      <ul className="mt-3 space-y-1 text-sm opacity-80 list-disc list-inside">
                        {message.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
