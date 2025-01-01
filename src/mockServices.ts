import { 
  ServiceInput, 
  ServiceFunction, 
  GraphicsAnalysisResult, 
  MetricsResult, 
  AnalyticsResult 
} from './types/apiService.types.js';

export class MockAPIService {
  private serviceMap: Record<string, ServiceFunction>;

  constructor() {
    this.serviceMap = {
      creative_design: this.analyzeGraphics.bind(this),
      content_creation: this.generateContent.bind(this),
      media_buying: this.generateMetrics.bind(this),
      performance_analysis: this.processAnalytics.bind(this),
      ad_copywriting: this.generateContent.bind(this),
    };
  }

  public getServiceByType(type: string): ServiceFunction | undefined {
    return this.serviceMap[type];
  }

  private async analyzeGraphics({ title, description }: ServiceInput): Promise<GraphicsAnalysisResult> {
    return {
      resolution: "1920x1080",
      colors: ["#FF5733", "#33FF57", "#3357FF"],
      feedback: `Graphics for task "${title}" meet the standards.`,
    };
  }

  private async generateContent({ title, description }: ServiceInput): Promise<string> {
    return `Generated content for "${title}" based on: ${description || "no description provided"}`;
  }

  private async generateMetrics({ title }: ServiceInput): Promise<MetricsResult> {
    return {
      impressions: Math.floor(Math.random() * 100000),
      clicks: Math.floor(Math.random() * 1000),
      ctr: (Math.random() * 5).toFixed(2),
      cost: Math.floor(Math.random() * 1000),
    };
  }

  private async processAnalytics({ title }: ServiceInput): Promise<AnalyticsResult> {
    return {
      sessions: Math.floor(Math.random() * 50000),
      bounceRate: (Math.random() * 100).toFixed(2),
      avgSessionDuration: Math.floor(Math.random() * 300),
    };
  }
}
