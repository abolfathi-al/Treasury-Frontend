export const sharedWorkspaceEn = {
  active: {
    title: "Active Workspace",
    summary: "Active Workspace Summary"
  },
  organization: {
    label: "Organization",
    current: "Current Organization"
  },
  organizations: {
    title: "Organization Memberships",
    selectTitle: "Select Organization",
    none: "No organization",
    empty: "No organizations found"
  },
  actors: {
    title: "Actor Memberships",
    selectTitle: "Select Actor Membership",
    active: "Active Actor",
    actor: "Actor",
    type: "Actor Type",
    empty: "No actor memberships found"
  },
  filters: {
    moreFilters: "More Filters",
    dateRange: "Date range",
    last30Days: "Last 30 days",
    organization: "Organization",
    allOrganizations: "All Organizations",
    actorType: "Actor type",
    allActorTypes: "All Actor Types",
    role: "Role",
    allRoles: "All Roles",
    status: "Status",
    allStatuses: "All Statuses",
    source: "Source",
    allSources: "All Sources",
    priority: "Priority",
    allPriorities: "All Priorities",
    accessType: "Access type",
    allAccessTypes: "All Access Types",
    supplierVisibility: "Supplier visibility",
    allVisibility: "All Visibility"
  },
  interactions: {
    disabledFutureAction: "Demo-only placeholder. This action will be available after backend workflow integration.",
    exportUnavailable: "Export will be available when backend reporting is connected.",
    noPersistence: "This demo action updates only local UI state and does not persist data."
  },
  pagination: {
    showingRange: "Showing {{start}} to {{end}} of {{total}}",
    previous: "Previous",
    next: "Next",
    page: "Page {{page}}",
    loadMore: "Load more",
    loadMoreDemo: "Load more demo rows"
  },
  demoActions: {
    title: "Demo Action",
    close: "Close demo action",
    primaryLabel: "Confirm Demo Action",
    secondaryLabel: "Cancel",
    demoOnlyNote: "Demo only. No backend call, real authorization change, route guard, or persistent storage is used.",
    genericDescription: "This action is represented as a demo interaction so the workflow has a clear visible result.",
    exportDescription: "Export will be available when backend reporting is connected. No file is generated in demo mode.",
    confirmationRequired: "This action implies a change, so the demo requires explicit confirmation before showing local feedback.",
    completed: "Demo action completed:",
    types: {
      navigation: "Navigation",
      pagination: "Pagination / Load More",
      modal: "Modal / Drawer",
      dropdown: "Dropdown",
      inMemoryDemoAction: "In-memory demo action",
      disabledFutureAction: "Disabled future action",
      exportPlaceholder: "Export placeholder",
      destructiveConfirmation: "Change action confirmation"
    }
  },
  dropdown: {
    moreFiltersTitle: "More Filters",
    moreFiltersSubtitle: "Static demo filters. Backend filtering is not connected.",
    rowActions: "Row actions",
    membership: {
      viewMembership: "View Membership",
      assignRole: "Assign Role",
      viewEffectiveAccess: "View Effective Access",
      suspendMembership: "Suspend Membership",
      viewAudit: "View Audit"
    },
    supplierVisibility: {
      viewSupplier: "View Supplier",
      manageRestrictions: "Manage Restrictions",
      viewConsumers: "View Consumers",
      viewVisibilityAudit: "View Visibility Audit",
      copySupplierId: "Copy Supplier ID"
    },
    accessRequests: {
      reviewRequest: "Review Request",
      approve: "Approve",
      deny: "Deny",
      viewRequestAudit: "View Request Audit",
      copyRequestId: "Copy Request ID"
    },
    effectiveAccess: {
      actions: "Effective access actions",
      viewEvidence: "View Evidence",
      exportSummary: "Export Summary",
      requestChange: "Request Change",
      copyWorkspaceId: "Copy Workspace ID"
    }
  },
  actor: {
    none: "No active actor",
    consumerAgency: "Consumer - Agency",
    consumerPlatform: "Consumer - Platform",
    consumerApiClient: "Consumer - API Client",
    marketplaceChannel: "Consumer - Marketplace Channel",
    b2bPartner: "Consumer - B2B Partner",
    consumerOrganization: "Consumer - Organization",
    supplier: "Supplier"
  },
  membership: {
    shortTitle: "Membership",
    role: "Membership Role"
  },
  role: {
    none: "No role",
    agencyManager: "Agency Manager",
    platformAdministrator: "Platform Administrator",
    supplierOperationsManager: "Supplier Operations Manager",
    supplierInventoryManager: "Supplier Inventory Manager",
    supplierCatalogManager: "Supplier Catalog Manager",
    apiClientManager: "API Client Manager",
    marketplaceChannelManager: "Marketplace Channel Manager",
    b2bPartnerManager: "B2B Partner Manager",
    pricingManager: "Pricing Manager",
    productManager: "Product Manager",
    orderManager: "Order Manager",
    financialViewer: "Financial Viewer",
    apiConsumer: "API Consumer",
    supplierContact: "Supplier Contact",
    dataAnalyst: "Data Analyst",
    integrationLead: "Integration Lead",
    catalogManager: "Catalog Manager"
  },
  metrics: {
    permissions: "Permissions",
    permissionsDetail: "Direct: 86 / Inherited: 38",
    roles: "Roles",
    rolesDetail: "Direct: 5 / Inherited: 3",
    dataScopes: "Data Scopes",
    dataScopesDetail: "Regions / Cities / Services",
    accessibleEntities: "Accessible Entities",
    accessibleEntitiesDetail: "Products, Tours, Suppliers, etc."
  },
  permissions: {
    countSummary: "{{permissions}} allowed / {{hints}} UI hints"
  },
  scope: {
    title: "Scope Summary",
    shortTitle: "Scope",
    none: "No active scope",
    country: "Country",
    city: "City",
    type: "Scope Type"
  },
  actions: {
    switch: "Switch Workspace",
    switchDetail: "Change organization or actor workspace",
    confirmSwitch: "Confirm Workspace Switch",
    settings: "Workspace settings",
    refresh: "Refresh",
    browseOrganizations: "Browse Organizations",
    browseOrganizationsDetail: "Explore organization memberships",
    browseActors: "Browse Actors",
    browseActorsDetail: "Explore actor memberships",
    membershipDirectory: "Membership Directory",
    membershipDirectoryDetail: "Review workspace memberships",
    supplierVisibility: "Supplier Visibility",
    supplierVisibilityDetail: "Manage open-by-default supplier visibility and restrictions",
    myAccess: "My Access",
    myAccessDetail: "View effective access and permissions",
    accessRequests: "Access Requests",
    accessRequestsDetail: "Review, approve, or deny access requests",
    grantBuilder: "Grant Builder",
    grantBuilderDetail: "Design scoped grants and delegation boundaries",
    scopeHierarchy: "Scope Hierarchy",
    scopeHierarchyDetail: "Explore reusable scope hierarchy and related access impact",
    accessSimulator: "Access Simulator",
    accessSimulatorDetail: "Simulate grants, visibility, pricing, and effective access impact",
    accessMatrix: "Supplier-Consumer Access Matrix",
    accessMatrixDetail: "Review supplier-consumer access relationships and final decisions",
    pricingAuthority: "Pricing Authority",
    pricingAuthorityDetail: "Manage pricing rules, boundaries, and commercial impact",
    quickSwitch: "Quick Switch Actions",
    viewAll: "View All",
    viewScopeHierarchy: "View Full Scope Hierarchy",
    viewAllActivity: "View All Activity",
    viewAllFavorites: "View All Favorites",
    manage: "Manage",
    learnMore: "Learn More",
    cancel: "Cancel",
    logout: "Logout",
    reset: "Reset",
    applyFilters: "Apply Filters"
  },
  search: {
    organizations: "Search organizations...",
    actorMemberships: "Search actor memberships..."
  },
  table: {
    time: "Time",
    action: "Action",
    details: "Details",
    organization: "Organization",
    actor: "Actor",
    by: "By",
    ipAddress: "IP Address"
  },
  activity: {
    title: "Recent Activity",
    workspaceSwitched: "Workspace Switched",
    switchedToAtlasAgency: "Switched to Atlas Travel Agency / Consumer - Agency",
    switchedToPlatform: "Switched to Velora Platform / Consumer - Platform",
    accessViewed: "Access Viewed",
    accessViewedDetail: "Viewed effective access and permissions",
    membershipAdded: "Membership Added",
    membershipAddedDetail: "Added supplier membership",
    scopeUpdated: "Scope Updated",
    scopeUpdatedDetail: "Updated scope: Iran / Tehran / Tours"
  },
  favorites: {
    title: "Favorite Workspaces"
  },
  recent: {
    title: "Recent Workspaces"
  },
  audit: {
    title: "Audit Info",
    demo: "Demo"
  },
  about: {
    title: "About Workspace",
    description: "Your active workspace determines what data you can access and what actions you can perform across the platform.",
    itemRightWorkspace: "Always ensure you are in the right workspace before making changes.",
    itemFavorites: "Use favorites for quick access to important workspaces.",
    itemAccessRequests: "Contact your administrator for access requests."
  },
  identity: {
    demo: "Demo Identity",
    globalBadge: "Global Identity",
    id: "Identity ID"
  },
  breadcrumb: {
    home: "Home"
  },
  badge: {
    active: "Active",
    current: "Current"
  },
  time: {
    justNow: "Just now",
    twoMinutesAgo: "2 minutes ago",
    fifteenMinutesAgo: "15 minutes ago",
    oneHourAgo: "1 hour ago",
    twoHoursAgo: "2 hours ago",
    threeHoursAgo: "3 hours ago",
    fiveHoursAgo: "5 hours ago",
    tenMinutesAgo: "10 minutes ago",
    thirtyFourMinutesAgo: "34 minutes ago",
    yesterday: "Yesterday",
    oneDayAgo: "1 day ago",
    twoDaysAgo: "2 days ago",
    threeDaysAgo: "3 days ago",
    twoWeeksAgo: "2 weeks ago",
    never: "Never",
    sessionCleared: "Session cleared"
  },
  version: "Workspace Version",
  lastSwitch: "Last Switch",
  disabled: "Workspace demo mode is disabled.",
  demoMode: "Demo Mode",
  demoModeNoBackend: "Demo Mode / No Backend Integration",
  fixtureOnlyTitle: "This drawer uses fixture state only.",
  fixturePlaceholder: "Fixture placeholder",
  savedInMemory: "Saved in memory"
} as const;
