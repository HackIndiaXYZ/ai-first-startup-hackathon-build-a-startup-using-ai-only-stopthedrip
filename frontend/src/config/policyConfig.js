/**
 * StopTheDrip Privacy, Security & Legal Configuration
 * Centralized settings for legal policies, contact emails, retention schedules, and security specifications.
 */

export const POLICY_CONFIG = {
  appName: 'StopTheDrip Financial Clarity',
  lastUpdated: 'September 8, 2026',
  effectiveDate: 'September 8, 2026',
  version: '2.4.0',

  // Configurable contact details
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@stopthedrip.com',
  privacyEmail: import.meta.env.VITE_PRIVACY_EMAIL || 'privacy@stopthedrip.com',
  securityEmail: import.meta.env.VITE_SECURITY_EMAIL || 'security@stopthedrip.com',

  // Data Retention Policy (0 minutes = Ephemeral / In-Memory RAM only)
  retentionPolicy: {
    defaultRetentionMinutes: 0, // In-memory volatile execution; discarded immediately post-response
    autoPurgeEnabled: true,
    localCacheKey: 'stopthedrip_audit_state',
    storageDescription: 'Ephemeral volatile memory (RAM only). Zero persistent disk retention of raw financial statements.'
  },

  // Technical Security Specifications (Strictly verified facts, no exaggerated claims)
  securitySpecs: {
    transportEncryption: 'TLS 1.3 / HTTPS for all in-transit traffic',
    payloadEncryption: 'Client-side Web Crypto AES-256-GCM authenticated cipher before transmission (where browser-supported)',
    backendProcessing: 'Stateless in-memory parser with zero database persistence of uploaded statements',
    authentication: 'Firebase Google SSO with scoped token-based session verification'
  }
}
