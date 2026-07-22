export const consumerSupplierPreferencesWorkspaceEn = {
  title: "Consumer Supplier Preference Workspace",
  navTitle: "Consumer Supplier Preference",
  breadcrumb: "Consumer Supplier Preference",
  dashboardDetail: "Enable, disable, and prioritize suppliers",
  helperText: "Manage which suppliers your organization prefers to work with. Enable, disable, or prioritize suppliers based on business needs and strategy.",
  actions: {
    accessWorkspace: "Access Workspace",
    preferenceSimulator: "Preference Simulator",
    export: "Export",
    createPreference: "Create Preference"
  },
  summary: {
    totalSuppliers: "Total Suppliers",
    totalSuppliersDetail: "Active in the marketplace",
    enabledSuppliers: "Enabled Suppliers",
    enabledSuppliersDetail: "54.9% of total",
    disabledSuppliers: "Disabled Suppliers",
    disabledSuppliersDetail: "22.5% of total",
    pendingReview: "Pending Review",
    pendingReviewDetail: "11.3% of total",
    notConfigured: "Not Configured",
    notConfiguredDetail: "11.3% of total",
    preferredDefaults: "Preferred Defaults",
    preferredDefaultsDetail: "Primary suppliers"
  },
  tabs: {
    supplierPreferences: "Supplier Preferences",
    priorityRouting: "Priority & Routing",
    scopeRules: "Scope & Rules",
    preferenceHistory: "Preference History",
    changeRequests: "Change Requests"
  },
  filters: {
    allStatuses: "All Statuses",
    allCategories: "All Supplier Categories",
    searchPlaceholder: "Search suppliers...",
    filters: "Filters",
    advancedDescription: "Advanced supplier preference filters are shown as a demo modal. Status, category, and search filters update this page locally.",
    reset: "Reset"
  },
  categories: {
    accommodation: "Accommodation",
    gds: "GDS",
    activities: "Activities"
  },
  table: {
    title: "Supplier Preferences ({{count}})",
    supplier: "Supplier",
    category: "Category",
    status: "Status",
    preferenceLevel: "Preference Level",
    default: "Default",
    effectiveScope: "Effective Scope",
    lastUpdated: "Last Updated",
    actions: "Actions",
    pageSize8: "8 / page",
    pageSize16: "16 / page",
    pageSize32: "32 / page"
  },
  statuses: {
    enabled: "Enabled",
    disabled: "Disabled",
    pendingReview: "Pending Review",
    notConfigured: "Not Configured"
  },
  levels: {
    preferred: "Preferred",
    high: "High",
    medium: "Medium",
    low: "Low",
    none: "None"
  },
  rowActions: {
    enableSupplier: "Enable Supplier",
    disableSupplier: "Disable Supplier",
    setPreferredDefault: "Set Preferred Default",
    changePriority: "Change Priority",
    sendToReview: "Send To Review",
    viewHistory: "View History",
    openInAccessWorkspace: "Open In Access Workspace"
  },
  modal: {
    context: "Context Summary",
    supplier: "Supplier",
    level: "Preference Level",
    priority: "Priority",
    scope: "Effective Scope",
    reason: "Reason",
    reasonPlaceholder: "Enter reason for this preference update...",
    effectiveFrom: "Effective From",
    effectiveTo: "Effective To",
    reviewRequired: "Review required",
    confirm: "Confirm",
    cancel: "Cancel",
    demoNote: "Demo only. This updates local UI state only and does not call backend APIs or persist data.",
    createTitle: "Create Preference",
    createDescription: "Create or update a consumer-side supplier preference.",
    enableTitle: "Enable Supplier",
    enableDescription: "Enable this supplier as a consumer preference input.",
    disableTitle: "Disable Supplier",
    disableDescription: "Disable this supplier from consumer preference selection.",
    defaultTitle: "Set Preferred Default",
    defaultDescription: "Mark this supplier as the preferred default for consumer routing.",
    priorityTitle: "Change Priority",
    priorityDescription: "Update the supplier priority and preference level.",
    reviewTitle: "Send To Review",
    reviewDescription: "Move this supplier preference to the pending review queue.",
    scopeTitle: "Bulk Update Scope",
    scopeDescription: "Update the demo effective scope for selected supplier preferences.",
    reviewDrawerTitle: "Review Preference Request",
    approve: "Enable Supplier",
    disableAfterReview: "Disable Supplier",
    keepPending: "Keep Pending"
  },
  scopeOptions: {
    global: "Global",
    europe: "Europe",
    asia: "Asia",
    europeMea: "Europe, MEA",
    iranTurkey: "Iran, Turkey"
  },
  priority: {
    preferredSuppliers: "Preferred Suppliers",
    routingPreview: "Routing Preview",
    priority: "Priority {{value}}",
    hotels: "Hotels",
    flights: "Flights",
    activities: "Activities",
    moveUp: "Move priority up",
    moveDown: "Move priority down"
  },
  scopeRules: {
    title: "Scope & Rules",
    description: "Consumer preferences can restrict supplier usage by geography, catalog, channel, and product scope.",
    countries: "Countries",
    cities: "Cities",
    catalogs: "Catalogs",
    channels: "Channels",
    products: "Products",
    included: "Included",
    restricted: "Restricted",
    updateScope: "Update Scope Rules"
  },
  impact: {
    title: "Preference Impact Preview",
    ifPublished: "If Published",
    enabledSuppliers: "Enabled Suppliers",
    disabledSuppliers: "Disabled Suppliers",
    pendingReview: "Pending Review",
    notConfigured: "Not Configured",
    runSimulator: "Run Preference Simulator"
  },
  summaryCard: {
    title: "Preference Summary",
    centerLabel: "Total Suppliers",
    preferredDefaults: "Preferred Defaults",
    primarySuppliers: "Primary suppliers",
    highPriority: "High Priority Suppliers",
    priorityOneTwo: "Priority 1-2",
    byCategory: "By Category"
  },
  pending: {
    title: "Pending Review Queue ({{count}})",
    requestedBy: "Requested By",
    reason: "Reason",
    requestedOn: "Requested On",
    review: "Review"
  },
  history: {
    title: "Recent Preference Changes",
    time: "Time",
    change: "Change",
    supplier: "Supplier",
    changedBy: "Changed By"
  },
  quickActions: {
    title: "Quick Actions",
    enableSupplier: "Enable Supplier",
    disableSupplier: "Disable Supplier",
    setPreferredDefault: "Set as Preferred Default",
    changePriority: "Change Priority",
    sendToReview: "Send to Review",
    bulkUpdateScope: "Bulk Update Scope",
    exportPreferences: "Export Preferences"
  },
  about: {
    title: "About Consumer Supplier Preference",
    description: "Consumer preferences work together with supplier policies, scope, and actor context to determine final data access decisions.",
    accessWorkspaceNote: "The final decision is managed in the Access Workspace.",
    learnMore: "Learn more about preferences"
  },
  changeTypes: {
    enabled: "Enabled",
    disabled: "Disabled",
    defaultSet: "Preferred Default Set",
    priorityChanged: "Priority Changed",
    sentReview: "Sent To Review",
    scopeUpdated: "Scope Updated",
    created: "Preference Created",
    reviewed: "Review Completed"
  },
  messages: {
    supplierEnabled: "Supplier enabled locally",
    supplierDisabled: "Supplier disabled locally",
    defaultSet: "Preferred default updated locally",
    priorityChanged: "Priority updated locally",
    sentToReview: "Supplier sent to review locally",
    scopeUpdated: "Scope updated locally",
    historyOpened: "Preference history opened",
    reviewApproved: "Review approved locally",
    reviewDisabled: "Review disabled supplier locally",
    reviewKeptPending: "Review kept pending locally"
  }
} as const;
