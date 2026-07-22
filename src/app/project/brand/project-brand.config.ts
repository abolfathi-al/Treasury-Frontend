import { AppBrandConfig } from '@core/config/brand.config';

export const PROJECT_BRAND = {
  name: 'Velora',
  defaultTitle: 'Velora',
  titleSeparator: ' - ',
  metaDescription: 'Velora enterprise workspace for access, governance, and platform operations.',
  metaKeywords: 'Velora, enterprise admin, workspace management, access governance, platform operations',
  canonicalUrl: 'https://velora.app/',
} as const satisfies AppBrandConfig;
