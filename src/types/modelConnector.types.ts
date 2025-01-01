// src/types/modelConnector.types.ts
import { Task, TaskAnalysis, TaskResult, ReviewResult, FinalReviewResult } from './task.types';
import { TaskCreationData } from './task.types';
import { MockAPIService } from '../mockServices';

export interface IModelConnector {
  externalServices: MockAPIService; // Zmieniamy na konkretny typ

  analyzeTask(data: TaskCreationData): Promise<TaskAnalysis>;
  
  processTask(
    task: Task,
    role: string,
    permissions: string[]
  ): Promise<TaskResult | ReviewResult | FinalReviewResult | any>;
}