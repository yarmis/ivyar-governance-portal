/**
 * IVYAR Smart Access Coordination Engine
 */

import {
  UserRole,
  AccessCategory,
  Permission,
  AccessContext,
  AccessRequest,
  AccessDecision,
  ROLE_PERMISSIONS,
  ROLE_TO_CATEGORY,
  AuditEventType,
  AuditLog
} from './access-control-types';

export class SmartAccessCoordinator {
  
  public async checkAccess(request: AccessRequest): Promise<AccessDecision> {
    const { action, context, resource, resourceId } = request;
    
    // 1. Basic permission check
    if (!this.hasPermission(context.role, action)) {
      await this.logAccess({
        ...request,
        allowed: false,
        reason: 'Missing permission'
      });
      
      return {
        allowed: false,
        reason: `Role ${context.role} does not have permission ${action}`,
        auditLog: true
      };
    }
    
    // 2. Category-level validation
    const categoryCheck = this.validateCategory(context.role, action);
    if (!categoryCheck.valid) {
      await this.logAccess({
        ...request,
        allowed: false,
        reason: categoryCheck.reason || 'Access denied'
      });
      
      return {
        allowed: false,
        reason: categoryCheck.reason,
        auditLog: true
      };
    }
    
    // 3. MFA requirement check
    const mfaRequired = this.requiresMfa(context.role, action);
    if (mfaRequired && !context.mfaVerified) {
      await this.logAccess({
        ...request,
        allowed: false,
        reason: 'MFA required but not verified'
      });
      
      return {
        allowed: false,
        reason: 'Multi-factor authentication required',
        requiresMfa: true,
        auditLog: true
      };
    }
    
    // 4. Context-aware security checks
    const securityCheck = await this.performSecurityChecks(context, action);
    if (!securityCheck.passed) {
      await this.logAccess({
        ...request,
        allowed: false,
        reason: securityCheck.reason
      });
      
      return {
        allowed: false,
        reason: securityCheck.reason,
        auditLog: true
      };
    }
    
    // ✅ ACCESS GRANTED
    await this.logAccess({
      ...request,
      allowed: true,
      reason: 'Access granted'
    });
    
    return {
      allowed: true,
      auditLog: true
    };
  }
  
  public hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }
  
  public getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }
  
  public getRoleCategory(role: UserRole): AccessCategory {
    return ROLE_TO_CATEGORY[role];
  }
  
  private validateCategory(role: UserRole, action: Permission): {
    valid: boolean;
    reason?: string;
  } {
    const category = ROLE_TO_CATEGORY[role];
    
    // CIVIL users cannot perform administrative actions
    if (category === AccessCategory.CIVIL) {
      if (action.startsWith('auth.manage') ||
          action.startsWith('business.manage') ||
          action.startsWith('security.') ||
          action.startsWith('system.')) {
        return {
          valid: false,
          reason: 'CIVIL category cannot perform administrative actions'
        };
      }
    }
    
    // OPS users cannot manage system configuration
    if (category === AccessCategory.OPS) {
      if (action.startsWith('system.edit') ||
          action.startsWith('security.manage') ||
          action.startsWith('auth.manage_roles')) {
        return {
          valid: false,
          reason: 'OPS category cannot modify system configuration or roles'
        };
      }
    }
    
    // ADM users cannot manage roles
    if (category === AccessCategory.ADM) {
      if (action === Permission.AUTH_MANAGE_ROLES) {
        return {
          valid: false,
          reason: 'ADM category cannot manage roles - ROOT access required'
        };
      }
    }
    
    return { valid: true };
  }
  
  private requiresMfa(role: UserRole, action: Permission): boolean {
    const category = ROLE_TO_CATEGORY[role];
    
    if (category === AccessCategory.CIVIL) {
      return false;
    }
    
    if (category === AccessCategory.OPS ||
        category === AccessCategory.ADM ||
        category === AccessCategory.ROOT) {
      return true;
    }
    
    const sensitiveActions = [
      Permission.AUTH_MANAGE_ROLES,
      Permission.AUTH_MANAGE_USERS,
      Permission.SYSTEM_EDIT_CONFIG,
      Permission.SECURITY_MANAGE_POLICIES,
      Permission.PAYMENTS_CONFIGURE
    ];
    
    return sensitiveActions.includes(action);
  }
  
  private async performSecurityChecks(
    context: AccessContext,
    action: Permission
  ): Promise<{ passed: boolean; reason?: string }> {
    
    // 1. ROOT access must be from secure environment
    if (ROLE_TO_CATEGORY[context.role] === AccessCategory.ROOT) {
      const isSecureEnv = await this.isSecureEnvironment(context.ipAddress);
      if (!isSecureEnv) {
        return {
          passed: false,
          reason: 'ROOT access requires secure government environment'
        };
      }
    }
    
    // 2. Check for suspicious activity
    const suspiciousActivity = await this.detectAnomalies(context);
    if (suspiciousActivity.detected) {
      await this.logSecurityAlert(context, suspiciousActivity.reason);
      
      return {
        passed: false,
        reason: `Suspicious activity detected: ${suspiciousActivity.reason}`
      };
    }
    
    // 3. Check session validity
    const sessionValid = await this.validateSession(context.sessionId);
    if (!sessionValid) {
      return {
        passed: false,
        reason: 'Session expired or invalid'
      };
    }
    
    return { passed: true };
  }
  
  private async isSecureEnvironment(ipAddress?: string): Promise<boolean> {
    if (!ipAddress) return false;
    
    const securePatterns = [
      /^127\./,
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./
    ];
    
    return securePatterns.some(pattern => pattern.test(ipAddress));
  }
  
  private async detectAnomalies(context: AccessContext): Promise<{
    detected: boolean;
    reason?: string;
  }> {
    return { detected: false };
  }
  
  private async validateSession(sessionId: string): Promise<boolean> {
    return true;
  }
  
  private async logAccess(request: AccessRequest & { allowed: boolean; reason: string }): Promise<void> {
    const auditLog: AuditLog = {
      id: this.generateId(),
      eventType: request.allowed ? AuditEventType.ACCESS_GRANTED : AuditEventType.ACCESS_DENIED,
      userId: request.context.userId,
      userRole: request.context.role,
      action: request.action,
      resource: request.resource,
      resourceId: request.resourceId,
      allowed: request.allowed,
      ipAddress: request.context.ipAddress,
      sessionId: request.context.sessionId,
      metadata: {
        reason: request.reason,
        mfaVerified: request.context.mfaVerified,
        deviceId: request.context.deviceId
      },
      timestamp: new Date()
    };
    
    console.log('[AUDIT]', auditLog);
  }
  
  private async logSecurityAlert(context: AccessContext, reason: string): Promise<void> {
    const alert: AuditLog = {
      id: this.generateId(),
      eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
      userId: context.userId,
      userRole: context.role,
      action: 'SECURITY_ALERT',
      allowed: false,
      ipAddress: context.ipAddress,
      sessionId: context.sessionId,
      metadata: { reason },
      timestamp: new Date()
    };
    
    console.error('[SECURITY ALERT]', alert);
  }
  
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const accessCoordinator = new SmartAccessCoordinator();
