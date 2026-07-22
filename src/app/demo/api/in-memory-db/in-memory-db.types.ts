export type MockCollectionName =
  | 'users'
  | 'basicInformation'
  | 'platformMetadata';

export interface MockRecord {
  id: number | string;
  [key: string]: unknown;
}

export interface MockUser extends MockRecord {
  id: number;
  name: string;
  email: string;
  role: 'platform-admin' | 'operator' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface BasicInfo extends MockRecord {
  id: 1;
  companyName: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  companyDescriptions: string[];
  socialMediaLinks: Array<{
    title: string;
    type: string;
    url: string;
  }>;
  footerNavSections: Array<{
    title: string;
    items: Array<{
      label: string;
      commands: string[];
    }>;
  }>;
}

export interface PlatformMetadata extends MockRecord {
  id: 1;
  workspaceName: string;
  environment: 'local' | 'development' | 'staging' | 'production';
  releaseChannel: string;
  capabilities: string[];
  navigationPlaceholders: Array<{
    label: string;
    route: string;
    enabled: boolean;
  }>;
}
