import { commonEn } from '../common/en';
import { layoutEn } from '../layout/en';
import { navigationEn } from '../navigation/en';
import { validationEn } from '../validation/en';
import { statusEn } from '../status/en';
import { identityDomainEn } from '../domain/identity/en';
import { accessDomainEn } from '../domain/access/en';
import { tenantDomainEn } from '../domain/tenant/en';
import { organizationDomainEn } from '../domain/organization/en';
import { auditDomainEn } from '../domain/audit/en';
import { sharedWorkspaceEn } from '../workspace/shared/en';
import { authWorkspaceEn } from '../workspace/auth/en';
import { errorsWorkspaceEn } from '../workspace/errors/en';
import { homeWorkspaceEn } from '../workspace/home/en';
import { dashboardWorkspaceEn } from '../workspace/dashboard/en';
import { accessRequestsWorkspaceEn } from '../workspace/access-requests/en';
import { accessSimulatorWorkspaceEn } from '../workspace/access-simulator/en';
import { baseDataManagementWorkspaceEn } from '../workspace/base-data-management/en';
import { commercialContractsWorkspaceEn } from '../workspace/commercial-contracts/en';
import { consumerManagementWorkspaceEn } from '../workspace/consumer-management/en';
import { consumerSupplierPreferencesWorkspaceEn } from '../workspace/consumer-supplier-preferences/en';
import { effectiveAccessSummaryWorkspaceEn } from '../workspace/effective-access-summary/en';
import { grantBuilderWorkspaceEn } from '../workspace/grant-builder/en';
import { membershipDirectoryWorkspaceEn } from '../workspace/membership-directory/en';
import { pricingAuthorityWorkspaceEn } from '../workspace/pricing-authority/en';
import { productModelManagementWorkspaceEn } from '../workspace/product-model-management/en';
import { scopeHierarchyExplorerWorkspaceEn } from '../workspace/scope-hierarchy-explorer/en';
import { supplierConsumerAccessMatrixWorkspaceEn } from '../workspace/supplier-consumer-access-matrix/en';
import { supplierManagementWorkspaceEn } from '../workspace/supplier-management/en';
import { supplierVisibilityWorkspaceEn } from '../workspace/supplier-visibility/en';
import { workspaceDashboardWorkspaceEn } from '../workspace/workspace-dashboard/en';
import { workspaceSwitcherWorkspaceEn } from '../workspace/workspace-switcher/en';

export const veloraShellEnLocale = {
  lang: 'en',
  data: {
    LANG: 'en',
    DIRECTION: 'ltr',
    ISO_LANG: 'en-US',
    common: commonEn,
    layout: layoutEn,
    navigation: navigationEn,
    validation: validationEn,
    status: statusEn,
    domain: {
      identity: identityDomainEn,
      access: accessDomainEn,
      tenant: tenantDomainEn,
      organization: organizationDomainEn,
      audit: auditDomainEn,
    },
    workspace: {
      ...sharedWorkspaceEn,
      auth: authWorkspaceEn,
      errors: errorsWorkspaceEn,
      home: homeWorkspaceEn,
      dashboard: dashboardWorkspaceEn,
      accessRequests: accessRequestsWorkspaceEn,
      accessSimulator: accessSimulatorWorkspaceEn,
      baseDataManagement: baseDataManagementWorkspaceEn,
      commercialContracts: commercialContractsWorkspaceEn,
      consumerManagement: consumerManagementWorkspaceEn,
      consumerSupplierPreferences: consumerSupplierPreferencesWorkspaceEn,
      effectiveAccessSummary: effectiveAccessSummaryWorkspaceEn,
      grantBuilder: grantBuilderWorkspaceEn,
      membershipDirectory: membershipDirectoryWorkspaceEn,
      pricingAuthority: pricingAuthorityWorkspaceEn,
      productModelManagement: productModelManagementWorkspaceEn,
      scopeHierarchyExplorer: scopeHierarchyExplorerWorkspaceEn,
      supplierConsumerAccessMatrix: supplierConsumerAccessMatrixWorkspaceEn,
      supplierManagement: supplierManagementWorkspaceEn,
      supplierVisibility: supplierVisibilityWorkspaceEn,
      workspaceDashboard: workspaceDashboardWorkspaceEn,
      workspaceSwitcher: workspaceSwitcherWorkspaceEn,
    },
  },
} as const;
