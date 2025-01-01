export interface EmployeeData {
  id: string;
  name: string;
  role: string;
  permissions: string[];
  manages?: string[]; // IDs podwładnych
  reports_to?: string; // ID przełożonego
}


