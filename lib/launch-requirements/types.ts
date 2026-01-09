/**
 * Module Launch Requirements System
 */

export enum RequirementCategory {
  TECHNICAL = 'technical',
  SECURITY = 'security',
  COMPLIANCE = 'compliance',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing',
  BUSINESS = 'business'
}

export enum RequirementStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  WAIVED = 'waived'
}

export enum PriorityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface ModuleRequirement {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  category: RequirementCategory;
  priority: PriorityLevel;
  status: RequirementStatus;
  
  assignedTo?: string;
  assignedTeam?: string;
  
  progressPercentage: number;
  estimatedHours?: number;
  actualHours?: number;
  
  dependencies?: string[];
  blocks?: string[];
  
  dueDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  blockedAt?: Date;
  blockedReason?: string;
  
  acceptanceCriteria?: string[];
  verificationMethod?: string;
  
  metadata?: Record<string, any>;
  
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LaunchReadiness {
  moduleId: string;
  totalRequirements: number;
  completed: number;
  blocked: number;
  inProgress: number;
  waived: number;
  criticalBlockers: number;
  completionPercentage: number;
}

export interface LaunchChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  moduleCategory?: string;
  requirements: Partial<ModuleRequirement>[];
}
