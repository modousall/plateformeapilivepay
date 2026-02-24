/**
 * LIVEPAY - Hook pour les permissions par rôle
 * Différencie les accès Admin vs Merchant
 */

import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { user, isAdmin, isMerchant } = useAuth();

  // Vérifie si l'utilisateur a un rôle spécifique
  const hasRole = (role: string) => {
    if (!user) return false;
    if (role === 'admin') return isAdmin;
    if (role === 'merchant') return isMerchant || isAdmin;
    return true;
  };

  // Vérifie si l'utilisateur peut accéder à une ressource
  const canAccess = (resource: string) => {
    if (!user) return false;
    
    // Ressources accessibles uniquement aux admins
    const adminOnlyResources = [
      'admin:users',
      'admin:merchants:all',
      'admin:analytics:global',
      'admin:settings:platform',
      'admin:api:manage',
    ];
    
    if (adminOnlyResources.includes(resource)) {
      return isAdmin;
    }
    
    // Ressources accessibles aux marchands et admins
    const merchantResources = [
      'merchant:payments',
      'merchant:links',
      'merchant:analytics',
      'merchant:settings',
      'merchant:api',
    ];
    
    if (merchantResources.includes(resource)) {
      return isMerchant || isAdmin;
    }
    
    return true;
  };

  // Vérifie si l'utilisateur peut effectuer une action
  const canAction = (action: string, resource?: string) => {
    if (!user) return false;
    
    // Actions réservées aux admins
    const adminActions = [
      'delete:merchant',
      'ban:user',
      'modify:fees',
      'access:all:data',
    ];
    
    if (adminActions.includes(action)) {
      return isAdmin;
    }
    
    // Actions marchands
    const merchantActions = [
      'create:payment',
      'create:link',
      'view:analytics',
      'manage:webhooks',
      'manage:api:keys',
    ];
    
    if (merchantActions.includes(action)) {
      return isMerchant || isAdmin;
    }
    
    return true;
  };

  return {
    user,
    isAdmin,
    isMerchant,
    hasRole,
    canAccess,
    canAction,
  };
}
