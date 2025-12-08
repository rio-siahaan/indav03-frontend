export interface RateLimitInfo {
  limits: {
    requests_per_day: number;
    tokens_per_minute: number;
  };
  remaining: {
    requests: number;
    tokens: number;
  };
  reset: {
    requests: string;
    tokens: string;
  };
  retry_after: number | null;
  usage_percentage: {
    requests: number;
    tokens: number;
  };
  timestamp: string;
}

export interface ChatResponse {
  response: string;
  conversation_id?: string;
  rate_limit?: RateLimitInfo;
  processing_time?: number;
}
