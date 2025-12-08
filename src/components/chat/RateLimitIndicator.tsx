"use client";

import { RateLimitInfo } from "@/types/rate-limit";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  rateLimit: RateLimitInfo | null | undefined;
}

export default function RateLimitIndicator({ rateLimit }: Props) {
  if (!rateLimit) {
    return null;
  }

  const { usage_percentage, remaining, limits } = rateLimit;

  const showWarning =
    usage_percentage.requests >= 80 || usage_percentage.tokens >= 80;

  const getColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="text-center space-y-1.5">
      {/* Warning Banner */}
      {showWarning && (
        <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
          <p className="text-xs text-yellow-700">
            Mendekati batas penggunaan API. Pertimbangkan untuk menunggu sebelum
            mengirim pesan lagi.
          </p>
        </div>
      )}

      {/* Rate Limit Stats */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
        <span
          className={cn(
            "flex items-center gap-1",
            getColor(usage_percentage.requests)
          )}
        >
          <span className="font-medium">Request harian:</span>
          <span>
            {remaining.requests.toLocaleString()} /{" "}
            {limits.requests_per_day.toLocaleString()}
          </span>
          <span className="text-gray-400">
            ({usage_percentage.requests.toFixed(1)}%)
          </span>
        </span>

        <span className="text-gray-300">•</span>

        <span
          className={cn(
            "flex items-center gap-1",
            getColor(usage_percentage.tokens)
          )}
        >
          <span className="font-medium">Token/menit:</span>
          <span>
            {remaining.tokens.toLocaleString()} /{" "}
            {limits.tokens_per_minute.toLocaleString()}
          </span>
          <span className="text-gray-400">
            ({usage_percentage.tokens.toFixed(1)}%)
          </span>
        </span>
      </div>
    </div>
  );
}
