import { EmployeeData } from "./employee.types";

export interface CompanyPaths {
  employees: string;
  tasks: string;
  conversations: string;
}

export interface Company {
  paths: CompanyPaths;
  employees: EmployeeData[];
  taskManager: any;
  modelConnector: any;

  loadEmployees(): Promise<void>;
  listEmployees(): Promise<void>;
  processAllTasks(): Promise<void>;
  createTask(): Promise<void>;
  viewTasks(): Promise<void>;
}
