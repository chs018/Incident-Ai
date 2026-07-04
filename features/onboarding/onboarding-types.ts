/**
 * Onboarding Wizard — Shared Types
 * All wizard state lives here. Replace mock handlers with Supabase/Clerk mutations.
 */

export interface InvitedMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export type CloudProvider = 'AWS' | 'Azure' | 'Google Cloud' | 'Hybrid' | 'On-Premise';
export type Environment = 'production' | 'staging' | 'development';
export type DashboardDensity = 'compact' | 'comfortable' | 'expanded';
export type NotificationPreference = 'critical' | 'all' | 'daily';

export interface OnboardingFormData {
  // Step 1 — Organization
  orgName: string;
  industry: string;
  companySize: string;
  cloudProvider: CloudProvider;
  region: string;
  timezone: string;
  language: string;

  // Step 2 — Workspace
  workspaceName: string;
  environment: Environment;
  incidentTool: string;
  monitoringPlatform: string;
  loggingPlatform: string;
  aiProvider: string;

  // Step 3 — Team
  members: InvitedMember[];

  // Step 4 — Preferences
  dashboardDensity: DashboardDensity;
  notifications: NotificationPreference;
  preferredTimezone: string;
  dateFormat: string;
  currency: string;
  aiRecommendations: boolean;
}

export const defaultFormData: OnboardingFormData = {
  orgName: '',
  industry: 'Technology',
  companySize: '51–200',
  cloudProvider: 'AWS',
  region: 'US East (us-east-1)',
  timezone: 'UTC−5:00 (EST)',
  language: 'English',
  workspaceName: '',
  environment: 'production',
  incidentTool: 'PagerDuty',
  monitoringPlatform: 'Datadog',
  loggingPlatform: 'Elastic',
  aiProvider: 'Groq',
  members: [],
  dashboardDensity: 'comfortable',
  notifications: 'critical',
  preferredTimezone: 'UTC−5:00 (EST)',
  dateFormat: 'MM/DD/YYYY',
  currency: 'USD ($)',
  aiRecommendations: true,
};

export const STEPS = [
  { label: 'Welcome',       time: '30s' },
  { label: 'Organization',  time: '45s' },
  { label: 'Workspace',     time: '30s' },
  { label: 'Team',          time: '30s' },
  { label: 'Preferences',   time: '20s' },
  { label: 'Summary',       time: '15s' },
  { label: 'Product Tour',  time: '60s' },
] as const;
