import { commonFa } from '../common/fa';
import { layoutFa } from '../layout/fa';
import { navigationFa } from '../navigation/fa';
import { validationFa } from '../validation/fa';
import { statusFa } from '../status/fa';
import { identityDomainFa } from '../domain/identity/fa';
import { accessDomainFa } from '../domain/access/fa';
import { tenantDomainFa } from '../domain/tenant/fa';
import { organizationDomainFa } from '../domain/organization/fa';
import { auditDomainFa } from '../domain/audit/fa';
import { sharedWorkspaceFa } from '../workspace/shared/fa';
import { authWorkspaceFa } from '../workspace/auth/fa';
import { errorsWorkspaceFa } from '../workspace/errors/fa';
import { homeWorkspaceFa } from '../workspace/home/fa';
import { dashboardWorkspaceFa } from '../workspace/dashboard/fa';
import { accessRequestsWorkspaceFa } from '../workspace/access-requests/fa';
import { accessSimulatorWorkspaceFa } from '../workspace/access-simulator/fa';
import { baseDataManagementWorkspaceFa } from '../workspace/base-data-management/fa';
import { commercialContractsWorkspaceFa } from '../workspace/commercial-contracts/fa';
import { consumerManagementWorkspaceFa } from '../workspace/consumer-management/fa';
import { consumerSupplierPreferencesWorkspaceFa } from '../workspace/consumer-supplier-preferences/fa';
import { effectiveAccessSummaryWorkspaceFa } from '../workspace/effective-access-summary/fa';
import { grantBuilderWorkspaceFa } from '../workspace/grant-builder/fa';
import { membershipDirectoryWorkspaceFa } from '../workspace/membership-directory/fa';
import { pricingAuthorityWorkspaceFa } from '../workspace/pricing-authority/fa';
import { productModelManagementWorkspaceFa } from '../workspace/product-model-management/fa';
import { scopeHierarchyExplorerWorkspaceFa } from '../workspace/scope-hierarchy-explorer/fa';
import { supplierConsumerAccessMatrixWorkspaceFa } from '../workspace/supplier-consumer-access-matrix/fa';
import { supplierManagementWorkspaceFa } from '../workspace/supplier-management/fa';
import { supplierVisibilityWorkspaceFa } from '../workspace/supplier-visibility/fa';
import { workspaceDashboardWorkspaceFa } from '../workspace/workspace-dashboard/fa';
import { workspaceSwitcherWorkspaceFa } from '../workspace/workspace-switcher/fa';

export const veloraShellFaLocale = {
  lang: 'fa',
  data: {
    LANG: 'fa',
    DIRECTION: 'rtl',
    ISO_LANG: 'fa-IR',
    common: commonFa,
    layout: layoutFa,
    navigation: navigationFa,
    validation: validationFa,
    status: statusFa,
    domain: {
      identity: identityDomainFa,
      access: accessDomainFa,
      tenant: tenantDomainFa,
      organization: organizationDomainFa,
      audit: auditDomainFa,
    },
    workspace: {
      ...sharedWorkspaceFa,
      auth: authWorkspaceFa,
      errors: errorsWorkspaceFa,
      home: homeWorkspaceFa,
      dashboard: dashboardWorkspaceFa,
      accessRequests: accessRequestsWorkspaceFa,
      accessSimulator: accessSimulatorWorkspaceFa,
      baseDataManagement: baseDataManagementWorkspaceFa,
      commercialContracts: commercialContractsWorkspaceFa,
      consumerManagement: consumerManagementWorkspaceFa,
      consumerSupplierPreferences: consumerSupplierPreferencesWorkspaceFa,
      effectiveAccessSummary: effectiveAccessSummaryWorkspaceFa,
      grantBuilder: grantBuilderWorkspaceFa,
      membershipDirectory: membershipDirectoryWorkspaceFa,
      pricingAuthority: pricingAuthorityWorkspaceFa,
      productModelManagement: productModelManagementWorkspaceFa,
      scopeHierarchyExplorer: scopeHierarchyExplorerWorkspaceFa,
      supplierConsumerAccessMatrix: supplierConsumerAccessMatrixWorkspaceFa,
      supplierManagement: supplierManagementWorkspaceFa,
      supplierVisibility: supplierVisibilityWorkspaceFa,
      workspaceDashboard: workspaceDashboardWorkspaceFa,
      workspaceSwitcher: workspaceSwitcherWorkspaceFa,
    },
  },
} as const;
