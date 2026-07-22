export const grantBuilderWorkspaceEn = {
  title: "Grant Builder & Delegation Workspace",
  navTitle: "Grant Builder",
  breadcrumb: "Grant Builder",
  helperText: "Design, configure, and review grants. Select permissions, choose hierarchical scope, set delegation boundaries, and preview effective access.",
  steps: {
    configureGrant: "Configure Grant",
    selectScope: "Select Scope",
    delegationInheritance: "Delegation & Inheritance",
    impactAnalysis: "Impact Analysis",
    reviewApply: "Review & Apply"
  },
  actions: {
    previewAsActor: "Preview as Actor",
    reviewApply: "Review & Apply"
  },
  review: {
    title: "Review & Apply",
    demoOnly: "Demo-only confirmation. No grant is persisted or enforced.",
    confirmDemo: "Confirm Demo Review"
  },
  summary: {
    grantName: "Grant Name",
    grantType: "Grant Type",
    createdBy: "Created By",
    workspace: "Workspace",
    status: "Status",
    lastSaved: "Last Saved",
    description: "Description"
  },
  roleSource: {
    title: "1. Role / Permission Source",
    roleTemplate: "Role Template",
    customPermissions: "Custom Permissions",
    catalogViewer: "Catalog Viewer (Read)",
    catalogViewerDetail: "Provides read access to catalog and pricing data.",
    viewRoleDetails: "View Role Details"
  },
  permissions: {
    title: "2. Permissions ({{count}})",
    selected: "{{count}} selected",
    selectedCount: "Selected permissions",
    searchPlaceholder: "Search permissions...",
    catalogView: "Catalog: View Items",
    pricingView: "Pricing: View Prices",
    availabilityView: "Availability: View Availability",
    supplierView: "Supplier: View Supplier Info",
    catalogExport: "Catalog: Export Data",
    pricingUpdate: "Pricing: Update Prices",
    addCustom: "Add Custom Permission"
  },
  attributes: {
    title: "Grant Attributes",
    accessType: "Access Type",
    dataSensitivity: "Data Sensitivity",
    sessionPolicy: "Session Policy",
    mfaRequired: "MFA Required",
    active: "Active"
  },
  scope: {
    title: "3. Scope Selection (Hierarchical)",
    viewMode: "Scope view mode",
    treeView: "Tree View",
    pathView: "Path View",
    searchPlaceholder: "Search scope...",
    resetScope: "Reset Scope",
    selectedScope: "Selected Scope",
    change: "Change",
    scopeType: "Scope Type",
    scopeLevel: "Scope Level",
    children: "Children",
    inheritance: "Inheritance",
    path: "Path",
    summary: "Scope Summary",
    suppliers: "Suppliers",
    catalog: "Catalog",
    supplier: "Supplier",
    resource: "Resource",
    childResources: "Child Resources",
    fromParent: "From Parent"
  },
  delegation: {
    title: "4. Delegation Boundary",
    noDelegation: "No Delegation",
    noDelegationDetail: "This grant cannot be delegated.",
    workspaceBoundary: "Workspace Boundary",
    workspaceBoundaryDetail: "Can delegate within this workspace.",
    scopeBoundary: "Scope Boundary",
    scopeBoundaryDetail: "Can delegate within the selected scope.",
    customBoundary: "Custom Boundary",
    customBoundaryDetail: "Define custom delegation rules.",
    maxDepth: "Max Delegation Depth",
    zeroDepth: "0 (No Delegation)",
    allowFurther: "Allow Further Delegation",
    infoNone: "This grant will not be delegable. Only administrators can grant or revoke this access.",
    infoWorkspace: "Delegation is limited to memberships inside the current workspace.",
    infoScope: "Delegation is limited to the selected scope and its effective child resources.",
    infoCustom: "Custom delegation requires backend policy validation before it can be enforced."
  },
  impact: {
    title: "5. Impact Analysis",
    usersImpacted: "Users Impacted",
    newAccess: "New Access",
    resources: "Resources",
    riskLevel: "Risk Level",
    accessIncrease: "Access Increase",
    accessCategory: "Access Category"
  },
  preview: {
    title: "Effective Access Preview",
    subtitle: "See what this grant will enable.",
    viewFull: "View Full Preview"
  },
  inheritance: {
    title: "Inheritance Status",
    inheritedParent: "Grant is inherited from parent node.",
    effectiveHere: "Effective permissions will apply here."
  },
  legend: {
    inherited: "Inherited",
    inheritedDetail: "Permissions inherited from parent",
    overridden: "Overridden",
    overriddenDetail: "Permissions overridden at this scope",
    explicit: "Explicit",
    explicitDetail: "Explicitly granted at this scope",
    denied: "Denied",
    deniedDetail: "Explicitly denied at this scope"
  },
  values: {
    read: "Read",
    internal: "Internal",
    standard: "Standard",
    yes: "Yes",
    no: "No",
    low: "Low",
    readAccess: "Read Access",
    resourceAccess: "Resource Access",
    allowed: "Allowed"
  }
} as const;
