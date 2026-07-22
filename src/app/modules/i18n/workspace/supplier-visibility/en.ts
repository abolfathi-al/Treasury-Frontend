export const supplierVisibilityWorkspaceEn = {
  title: "Supplier Policy Management",
  navTitle: "Supplier Visibility",
  breadcrumb: "Supplier Policy Management",
  helperText: "Manage how your data, inventory, catalogs, and services are visible to consumers by default. Define restrictions, exceptions, and visibility rules.",
  summary: {
    defaultVisibility: "Default Visibility",
    defaultVisibilityDetail: "Open to all by default",
    restrictedConsumers: "Restricted Consumers",
    restrictedConsumersDetail: "12% of total consumers",
    hiddenResources: "Hidden Resources",
    hiddenResourcesDetail: "Across all resources",
    activePolicyVersion: "Active Policy Version",
    activePolicyVersionDetail: "Published on May 20, 2024",
    exceptions: "Exceptions",
    exceptionsDetail: "Time-bound exceptions"
  },
  actions: {
    accessWorkspace: "Access Workspace",
    policySimulator: "Policy Simulator",
    export: "Export",
    createPolicy: "Create Policy",
    demoAction: "Demo action selected:"
  },
  tabs: {
    overview: "Policy Overview",
    restrictedConsumers: "Restricted Consumers",
    hiddenResources: "Hidden Resources",
    policyRules: "Policy Rules",
    policyVersions: "Policy Versions",
    changeHistory: "Change History"
  },
  status: {
    visible: "Visible",
    restricted: "Restricted",
    hidden: "Hidden"
  },
  default: {
    open: "Open"
  },
  defaultPolicy: {
    title: "Default Visibility Policy",
    defaultPolicy: "Default Policy",
    openToAll: "Open to all consumers",
    openBadge: "Open",
    whatMeans: "What this means",
    meaning: "Your data, inventory, catalogs, and services are visible to all consumers unless explicitly restricted below.",
    howWorks: "How default visibility works"
  },
  resourceTypes: {
    title: "Visibility by Resource Type",
    centerLabel: "Hidden Resources",
    catalogs: "Catalogs",
    services: "Services",
    countries: "Countries",
    cities: "Cities",
    channels: "Channels"
  },
  restrictedConsumers: {
    title: "Restricted Consumers ({{count}})",
    searchPlaceholder: "Search consumers...",
    addRestricted: "Add Restricted",
    consumer: "Consumer",
    type: "Type",
    reason: "Reason",
    restrictedScope: "Restricted Scope",
    effectiveFrom: "Effective From",
    effectiveTo: "Effective To",
    actions: "Actions",
    viewAll: "View all restricted consumers ({{count}})"
  },
  hiddenResources: {
    title: "Hidden Resources ({{count}})",
    allTypes: "All Types",
    searchPlaceholder: "Search resources...",
    hideResource: "Hide Resource",
    resource: "Resource",
    type: "Type",
    scope: "Scope",
    reason: "Reason",
    status: "Status",
    actions: "Actions",
    viewAll: "View all hidden resources ({{count}})"
  },
  policyRules: {
    title: "Policy Rules",
    active: "Active",
    defaultOpen: {
      title: "Default Open Visibility",
      detail: "All supplier data is visible to consumers unless a restriction, hidden-resource rule, or exception applies."
    },
    consumerRestriction: {
      title: "Consumer Restrictions",
      detail: "Supplier policy can restrict selected consumers from seeing supplier data or selected policy scopes."
    },
    resourceHiding: {
      title: "Hidden Resource Rules",
      detail: "Catalogs, services, countries, cities, and channels can be hidden from consumer visibility."
    },
    exceptionWindow: {
      title: "Policy Exception Windows",
      detail: "Temporary exceptions can override supplier visibility rules for a bounded time window."
    }
  },
  versions: {
    title: "Policy Versions",
    current: "Current",
    previous: "Previous",
    viewAll: "View all versions"
  },
  changeHistory: {
    title: "Recent Policy Changes",
    time: "Time",
    changeType: "Change Type",
    target: "Target",
    details: "Details",
    changedBy: "Changed By",
    version: "Version",
    viewAll: "View all changes"
  },
  changeTypes: {
    restrictedConsumerAdded: "Restricted Consumer Added",
    resourceHidden: "Resource Hidden",
    policyExceptionCreated: "Policy Exception Created",
    restrictedConsumerRemoved: "Restricted Consumer Removed",
    policyVersionPublished: "Policy Version Published"
  },
  policyScope: {
    title: "Policy Scope",
    appliesTo: "Applies To",
    appliesToValue: "All Data, Inventory, Catalogs, Services",
    geography: "Geography",
    geographyValue: "All Countries, All Cities",
    channels: "Channels",
    channelsValue: "All Channels",
    products: "Products",
    seatBased: "Seat-Based",
    stayBased: "Stay-Based",
    slotBased: "Slot-Based",
    ticketBased: "Ticket-Based",
    packageBased: "Package-Based",
    lastEvaluated: "Last Evaluated",
    by: "by"
  },
  quickActions: {
    title: "Quick Actions",
    addRestrictedConsumer: "Add Restricted Consumer",
    hideResource: "Hide Resource",
    createPolicyException: "Create Policy Exception",
    openAccessWorkspace: "Open in Access Workspace",
    runPolicySimulator: "Run Policy Simulator"
  },
  about: {
    title: "About Supplier Policy",
    description: "This policy controls the visibility of your data to consumers.",
    accessWorkspaceNote: "Final data access decisions are calculated in Access Workspace using supplier policy, consumer preference, effective scope, and actor context.",
    learnMore: "Learn more about access decision"
  },
  rowActions: {
    viewPolicy: "View Policy",
    editPolicy: "Edit Policy",
    viewAudit: "View Audit"
  }
} as const;
