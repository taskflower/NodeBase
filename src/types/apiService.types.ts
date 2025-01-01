// src/types/apiService.types.ts
export interface ServiceInput {
    title: string;
    description?: string;
  }
  
  export interface GraphicsAnalysisResult {
    resolution: string;
    colors: string[];
    feedback: string;
  }
  
  export interface MetricsResult {
    impressions: number;
    clicks: number;
    ctr: string;
    cost: number;
  }
  
  export interface AnalyticsResult {
    sessions: number;
    bounceRate: string;
    avgSessionDuration: number;
  }
  
  export type ServiceResult = GraphicsAnalysisResult | MetricsResult | AnalyticsResult | string;
  
  export type ServiceFunction = (input: ServiceInput) => Promise<ServiceResult>;
  