import fs from 'fs-extra';
import path from 'path';
import { OrganizationProcess, AutonomyConfig } from './organizationState.js';

interface SystemConfig {
  processes: OrganizationProcess[];
  autonomy: AutonomyConfig;
  escalationRules: {
    timeThresholds: { [key: string]: number };
    errorThresholds: { [key: string]: number };
  };
}

export class ConfigManager {
  private configPath: string;
  private config: SystemConfig;

  constructor(configPath: string) {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  private loadConfig(): SystemConfig {
    try {
      return fs.readJsonSync(this.configPath);
    } catch (error) {
      return this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): SystemConfig {
    return {
      processes: [],
      autonomy: {
        maxTasksPerDay: 10,
        maxBudgetPerTask: 1000,
        requireApprovalFrom: ['CEO'],
        autoEscalateAfterHours: 24
      },
      escalationRules: {
        timeThresholds: { default: 24 },
        errorThresholds: { default: 3 }
      }
    };
  }

  public getConfig(): SystemConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<SystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  private saveConfig(): void {
    fs.writeJsonSync(this.configPath, this.config, { spaces: 2 });
  }
}