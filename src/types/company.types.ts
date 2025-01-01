import { EmployeeData } from "./employee.types";
import { TaskManager } from "../taskManager";
import { ModelConnector } from "../modelConnector";
import { ConfigManager } from "../configManager";
import { OrganizationStateManager } from "../organizationState";

export interface CompanyPaths {
  employees: string;
  tasks: string;
  conversations: string;
  config: string;
}

export interface Company {
  paths: CompanyPaths;
  employees: EmployeeData[];
  taskManager: TaskManager;
  modelConnector: ModelConnector;
  configManager: ConfigManager;
  orgStateManager: OrganizationStateManager;
  
  loadEmployees(): Promise<void>;
  listEmployees(): Promise<void>;
  processAllTasks(): Promise<void>;
  createTask(): Promise<void>;
  viewTasks(): Promise<void>;
  runAutonomousProcesses(): Promise<void>;
  viewOrganizationState(): Promise<void>;
  updateAutonomyConfig(): Promise<void>;
}