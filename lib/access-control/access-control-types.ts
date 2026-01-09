/**
 * IVYAR HBS Access Control System
 * Sovereign-grade access governance with smart coordination
 */

export enum AccessCategory {
  CIVIL = 'CIVIL',
  OPS = 'OPS',
  ADM = 'ADM',
  ROOT = 'ROOT'
}

export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
  ADMIN_MAX = 'ADMIN_MAX'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export enum Permission {
  // Authentication
  AUTH_LOGIN = 'auth.login',
  AUTH_MFA = 'auth.mfa',
  AUTH_MANAGE_ROLES = 'auth.manage_roles',
  AUTH_MANAGE_USERS = 'auth.manage_users',
  
  // Citizen
  CITIZEN_VIEW_OWN = 'citizen.view_own',
  CITIZEN_EDIT_OWN = 'citizen.edit_own',
  CITIZEN_SUBMIT_APP = 'citizen.submit_application',
  CITIZEN_APPROVE = 'citizen.approve',
  
  // Business
  BUSINESS_SUBMIT_DOCS = 'business.submit_docs',
  BUSINESS_VALIDATE = 'business.validate',
  BUSINESS_MANAGE_RULES = 'business.manage_rules',
  
  // Procurement
  PROCUREMENT_VIEW = 'procurement.view',
  PROCUREMENT_CREATE = 'procurement.create',
  PROCUREMENT_APPROVE = 'procurement.approve',
  PROCUREMENT_MANAGE = 'procurement.manage',
  
  // Logistics
  LOGISTICS_VIEW = 'logistics.view',
  LOGISTICS_CREATE = 'logistics.create',
  LOGISTICS_TRACK = 'logistics.track',
  LOGISTICS_MANAGE = 'logistics.manage',
  
  // Payments
  PAYMENTS_VIEW = 'payments.view',
  PAYMENTS_CREATE = 'payments.create',
  PAYMENTS_CONFIGURE = 'payments.configure',
  
  // Insurance
  INSURANCE_VIEW_POLICY = 'insurance.view_policy',
  INSURANCE_CREATE_POLICY = 'insurance.create_policy',
  INSURANCE_SUBMIT_CLAIM = 'insurance.submit_claim',
  INSURANCE_PROCESS_CLAIM = 'insurance.process_claim',
  INSURANCE_MANAGE_PRODUCTS = 'insurance.manage_products',
  INSURANCE_CONFIGURE_TARIFFS = 'insurance.configure_tariffs',
  
  // Notifications
  NOTIF_RECEIVE = 'notifications.receive',
  NOTIF_SEND = 'notifications.send',
  NOTIF_CONFIGURE = 'notifications.configure',
  
  // Analytics
  ANALYTICS_VIEW = 'analytics.view',
  ANALYTICS_EXPORT = 'analytics.export',
  ANALYTICS_CONFIGURE = 'analytics.configure',
  
  // Security
  SECURITY_VIEW_LOGS = 'security.view_logs',
  SECURITY_MANAGE_POLICIES = 'security.manage_policies',
  SECURITY_INCIDENT_RESPONSE = 'security.incident_response',
  
  // System
  SYSTEM_VIEW_CONFIG = 'system.view_config',
  SYSTEM_EDIT_CONFIG = 'system.edit_config',
  SYSTEM_MANAGE_MODULES = 'system.manage_modules',
  
  // Audit
  AUDIT_VIEW = 'audit.view',
  AUDIT_EXPORT = 'audit.export'
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.AUTH_LOGIN,
    Permission.CITIZEN_VIEW_OWN,
    Permission.CITIZEN_EDIT_OWN,
    Permission.CITIZEN_SUBMIT_APP,
    Permission.BUSINESS_SUBMIT_DOCS,
    Permission.INSURANCE_VIEW_POLICY,
    Permission.INSURANCE_SUBMIT_CLAIM,
    Permission.PAYMENTS_VIEW,
    Permission.NOTIF_RECEIVE
  ],
  
  [UserRole.OPERATOR]: [
    Permission.AUTH_LOGIN,
    Permission.AUTH_MFA,
    Permission.CITIZEN_VIEW_OWN,
    Permission.CITIZEN_EDIT_OWN,
    Permission.CITIZEN_SUBMIT_APP,
    Permission.CITIZEN_APPROVE,
    Permission.BUSINESS_SUBMIT_DOCS,
    Permission.BUSINESS_VALIDATE,
    Permission.PROCUREMENT_VIEW,
    Permission.PROCUREMENT_CREATE,
    Permission.LOGISTICS_VIEW,
    Permission.LOGISTICS_CREATE,
    Permission.LOGISTICS_TRACK,
    Permission.INSURANCE_VIEW_POLICY,
    Permission.INSURANCE_CREATE_POLICY,
    Permission.INSURANCE_SUBMIT_CLAIM,
    Permission.INSURANCE_PROCESS_CLAIM,
    Permission.PAYMENTS_VIEW,
    Permission.PAYMENTS_CREATE,
    Permission.NOTIF_RECEIVE,
    Permission.NOTIF_SEND
  ],
  
  [UserRole.ADMIN]: [
    Permission.AUTH_LOGIN,
    Permission.AUTH_MFA,
    Permission.AUTH_MANAGE_USERS,
    Permission.CITIZEN_VIEW_OWN,
    Permission.CITIZEN_EDIT_OWN,
    Permission.CITIZEN_SUBMIT_APP,
    Permission.CITIZEN_APPROVE,
    Permission.BUSINESS_SUBMIT_DOCS,
    Permission.BUSINESS_VALIDATE,
    Permission.BUSINESS_MANAGE_RULES,
    Permission.PROCUREMENT_VIEW,
    Permission.PROCUREMENT_CREATE,
    Permission.PROCUREMENT_MANAGE,
    Permission.LOGISTICS_VIEW,
    Permission.LOGISTICS_CREATE,
    Permission.LOGISTICS_TRACK,
    Permission.LOGISTICS_MANAGE,
    Permission.INSURANCE_VIEW_POLICY,
    Permission.INSURANCE_CREATE_POLICY,
    Permission.INSURANCE_SUBMIT_CLAIM,
    Permission.INSURANCE_PROCESS_CLAIM,
    Permission.INSURANCE_MANAGE_PRODUCTS,
    Permission.INSURANCE_CONFIGURE_TARIFFS,
    Permission.PAYMENTS_VIEW,
    Permission.PAYMENTS_CREATE,
    Permission.PAYMENTS_CONFIGURE,
    Permission.NOTIF_RECEIVE,
    Permission.NOTIF_SEND,
    Permission.NOTIF_CONFIGURE,
    Permission.ANALYTICS_VIEW,
    Permission.ANALYTICS_EXPORT,
    Permission.SECURITY_VIEW_LOGS,
    Permission.SECURITY_INCIDENT_RESPONSE,
    Permission.SYSTEM_VIEW_CONFIG
  ],
  
  [UserRole.ADMIN_MAX]: Object.values(Permission)
};

export const ROLE_TO_CATEGORY: Record<UserRole, AccessCategory> = {
  [UserRole.USER]: AccessCategory.CIVIL,
  [UserRole.OPERATOR]: AccessCategory.OPS,
  [UserRole.ADMIN]: AccessCategory.ADM,
  [UserRole.ADMIN_MAX]: AccessCategory.ROOT
};

export interface AccessContext {
  userId: string;
  role: UserRole;
  category: AccessCategory;
  ipAddress?: string;
  deviceId?: string;
  mfaVerified: boolean;
  sessionId: string;
  timestamp: Date;
}

export interface AccessRequest {
  action: Permission;
  resource?: string;
  resourceId?: string;
  context: AccessContext;
}

export interface AccessDecision {
  allowed: boolean;
  reason?: string;
  requiresMfa?: boolean;
  auditLog: boolean;
}

export enum AuditEventType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_CHECK = 'PERMISSION_CHECK',
  ROLE_CHANGED = 'ROLE_CHANGED',
  MFA_REQUIRED = 'MFA_REQUIRED',
  MFA_VERIFIED = 'MFA_VERIFIED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  CONFIG_CHANGE = 'CONFIG_CHANGE'
}

export interface AuditLog {
  id: string;
  eventType: AuditEventType;
  userId: string;
  userRole: UserRole;
  action: string;
  resource?: string;
  resourceId?: string;
  allowed: boolean;
  ipAddress?: string;
  userAgent?: string;
  sessionId: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}
