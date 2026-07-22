export const effectiveAccessSummaryWorkspaceEn = {
  title: "Effective Access Summary",
  permissionsByCategory: "Permissions by Category",
  dataScopeOverview: "Data Scope Overview",
  total: "Total",
  scopeType: "Scope Type",
  coverage: "Coverage",
  summary: {
    workspaceId: "Workspace ID",
    effectiveSince: "Effective Since",
    accessSource: "Access Source"
  },
  metrics: {
    totalPermissions: "Total Permissions",
    roles: "Roles",
    dataScopes: "Data Scopes",
    accessibleSuppliers: "Accessible Suppliers",
    countries: "Countries",
    cities: "Cities",
    catalogs: "Catalogs"
  },
  roles: {
    title: "Roles",
    role: "Role",
    type: "Type",
    source: "Source"
  },
  roleTypes: {
    primary: "Primary",
    functional: "Functional",
    readOnly: "Read-Only"
  },
  sources: {
    direct: "Direct",
    inherited: "Inherited",
    directInherited: "Direct + Inherited"
  },
  scopeTypes: {
    country: "Country",
    city: "City",
    productCategory: "Product Category",
    supplier: "Supplier",
    contentLanguage: "Content Language"
  },
  accessLevels: {
    full: "Full Access",
    limited: "Limited Access"
  },
  accessibleSuppliers: {
    title: "Accessible Suppliers ({{count}})",
    supplier: "Supplier",
    type: "Type",
    accessLevel: "Access Level"
  },
  inheritance: {
    title: "Access Inheritance",
    inherited: "Inherited",
    directPermissions: "Direct Permissions",
    inheritedPermissions: "Inherited Permissions",
    deniedRestricted: "Denied / Restricted"
  },
  deniedLimited: {
    title: "Denied / Limited Access Highlights"
  },
  reasons: {
    notInScope: "Not in scope",
    roleRestriction: "Role restriction",
    insufficientRole: "Insufficient role",
    limitExceeded: "Limit exceeded"
  },
  restrictionTypes: {
    denied: "Denied",
    limited: "Limited"
  },
  recentChanges: {
    title: "Recent Access Changes",
    change: "Change",
    resource: "Resource",
    changedBy: "Changed By"
  },
  changes: {
    permissionGranted: "Permission Granted",
    roleAssigned: "Role Assigned",
    scopeUpdated: "Scope Updated",
    permissionRevoked: "Permission Revoked",
    roleRemoved: "Role Removed"
  },
  evidence: {
    title: "Access Evidence",
    policySnapshot: "Policy Snapshot",
    roleAssignment: "Role Assignment",
    scopeDefinition: "Scope Definition",
    permissionEvaluation: "Permission Evaluation"
  },
  about: {
    title: "About This Summary",
    description: "This page shows your effective access within the current workspace based on roles, scopes, and system policies.",
    accessNote: "Access can be granted directly or inherited from roles and organizations. For access requests or changes, please contact your administrator.",
    securityNotice: "Security Notice",
    securityNoticeDetail: "Always ensure you have the minimum access needed to perform your tasks."
  },
  actions: {
    viewAllPermissions: "View All Permissions",
    viewAllRoles: "View All Roles",
    viewAllSuppliers: "View All Suppliers",
    viewAllRestrictions: "View All Restrictions",
    viewAllEvidence: "View All Evidence",
    learnMoreAccessControl: "Learn more about access control"
  }
} as const;
