import { Task, TaskAnalysis, TaskResult, ReviewResult, FinalReviewResult, TaskCreationData } from './task.types';
import { MockAPIService } from '../mockServices';


export interface IModelConnector {
  externalServices: MockAPIService;
  analyzeTask(data: TaskCreationData): Promise<TaskAnalysis>;
  analyzeOrganizationState(): Promise<void>;
  processTask(
    task: Task,
    role: string,
    permissions: string[]
  ): Promise<TaskResult | ReviewResult | FinalReviewResult>;
}