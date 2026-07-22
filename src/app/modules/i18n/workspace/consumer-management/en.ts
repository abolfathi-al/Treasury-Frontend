export const consumerManagementWorkspaceEn = {
  navTitle: "Consumer Management",
  title: "Consumer Management vNext",
  version: "vNext",
  subtitle: "Manage consumers, profiles, segments, preferences, access, identity security, devices, sessions, loyalty programs, and audit logs.",
  actions: {
    export: "Export",
    import: "Import",
    view: "View",
    edit: "Edit",
    clone: "Clone"
  },
  toolbar: {
    createMenu: "Create options",
    createCurrent: "Create {{entity}}",
    createViaImport: "Create via Import",
    createInBulk: "Create in Bulk"
  },
  tabs: {
    consumers: "Consumers",
    consumerGroups: "Consumer Groups",
    segments: "Segments",
    identities: "Identities",
    households: "Households",
    profiles: "Profiles",
    preferences: "Preferences",
    consents: "Consents",
    loyaltyPrograms: "Loyalty Programs",
    accessEntitlements: "Access & Entitlements",
    authenticationMethods: "Authentication Methods",
    devices: "Devices",
    sessions: "Sessions",
    auditLogs: "Audit Logs"
  },
  drawerTypes: {
    consumerCentric: "Consumer-Centric",
    identitySecurity: "Identity & Security",
    preferencePrivacy: "Preference & Privacy",
    loyalty: "Loyalty",
    accessEntitlements: "Access & Entitlements",
    auditCompliance: "Audit & Compliance"
  },
  entities: {
    consumers: {
      title: "Consumers",
      subtitle: "Manage consumers, profiles, segments, preferences, and access across all channels.",
      plural: "Consumers",
      singular: "Consumer",
      create: "Create Consumer",
      compareButton: "Compare Consumers",
      searchPlaceholder: "Search consumers by name, email, phone, or ID..."
    },
    consumerGroups: {
      title: "Consumer Groups",
      subtitle: "Manage consumer groups and hierarchies across all channels and markets.",
      plural: "Consumer Groups",
      singular: "Consumer Group",
      create: "Create Group",
      compareButton: "Compare Groups",
      searchPlaceholder: "Search groups by name, code, or description..."
    },
    segments: {
      title: "Segments",
      subtitle: "Manage consumer segments used for targeting, personalization, and access control.",
      plural: "Segments",
      singular: "Segment",
      create: "Create Segment",
      compareButton: "Compare Segments",
      searchPlaceholder: "Search segments by name, code, or description..."
    },
    identities: {
      title: "Identities",
      subtitle: "Manage consumer digital identities and authentication profiles across all channels and systems.",
      plural: "Identities",
      singular: "Identity",
      create: "Create Identity",
      compareButton: "Compare Identities",
      searchPlaceholder: "Search identities by email, phone, ID, or username..."
    },
    households: {
      title: "Households",
      subtitle: "Manage consumer households and family units across all channels and markets.",
      plural: "Households",
      singular: "Household",
      create: "Create Household",
      compareButton: "Compare Households",
      searchPlaceholder: "Search households by name, code, email, phone, or address..."
    },
    profiles: {
      title: "Profiles",
      subtitle: "Manage consumer profile attributes and master data used across channels and applications.",
      plural: "Profiles",
      singular: "Profile",
      create: "Create Profile",
      compareButton: "Compare Profiles",
      searchPlaceholder: "Search profiles by name, attribute, or value..."
    },
    preferences: {
      title: "Preferences",
      subtitle: "Manage consumer preferences and communication, content, and experience settings.",
      plural: "Preferences",
      singular: "Preference",
      create: "Create Preference",
      compareButton: "Compare Preferences",
      searchPlaceholder: "Search preferences by name, code, or description..."
    },
    consents: {
      title: "Consents",
      subtitle: "Manage consumer consent records, privacy permissions, and legal processing basis across all channels.",
      plural: "Consents",
      singular: "Consent",
      create: "Create Consent",
      compareButton: "Compare Consents",
      searchPlaceholder: "Search consents by name, code, or consumer..."
    },
    loyaltyPrograms: {
      title: "Loyalty Programs",
      subtitle: "Manage loyalty programs, tiers, benefits, earning rules, and member engagement across all channels.",
      plural: "Loyalty Programs",
      singular: "Loyalty Program",
      create: "Create Loyalty Program",
      compareButton: "Compare Programs",
      searchPlaceholder: "Search loyalty programs by name or code..."
    },
    accessEntitlements: {
      title: "Access & Entitlements",
      subtitle: "Manage consumer access rights, entitlements, permissions, and restrictions.",
      plural: "Access & Entitlements",
      singular: "Access & Entitlement",
      create: "Grant Access",
      compareButton: "Compare Entitlements",
      searchPlaceholder: "Search entitlements, code, or consumer..."
    },
    authenticationMethods: {
      title: "Authentication Methods",
      subtitle: "Manage consumer authentication methods, credential types, MFA settings, and security posture.",
      plural: "Authentication Methods",
      singular: "Authentication Method",
      create: "Add Authentication Method",
      compareButton: "Compare Methods",
      searchPlaceholder: "Search authentication methods by name, code, or consumer..."
    },
    devices: {
      title: "Devices",
      subtitle: "Manage consumer devices across channels, track device health, associations, and usage.",
      plural: "Devices",
      singular: "Device",
      create: "Register Device",
      compareButton: "Compare Devices",
      searchPlaceholder: "Search devices by name, device ID, or consumer..."
    },
    sessions: {
      title: "Sessions",
      subtitle: "Monitor user sessions, activity, and lifecycle across all channels and devices.",
      plural: "Sessions",
      singular: "Session",
      create: "Create Session",
      compareButton: "Session Analytics",
      searchPlaceholder: "Search sessions by session ID, user, device, or channel..."
    },
    auditLogs: {
      title: "Audit Logs",
      subtitle: "Centralized audit, traceability, and compliance for all consumer-related activities.",
      plural: "Audit Logs",
      singular: "Audit Event",
      create: "Create Investigation",
      compareButton: "Create Investigation",
      searchPlaceholder: "Search events by ID, consumer, actor, or entity..."
    }
  },
  metrics: {
    totalConsumers: "Total Consumers",
    activeConsumers: "Active Consumers",
    newThisMonth: "New This Month",
    verifiedConsumers: "Verified Consumers",
    loyaltyMembers: "Loyalty Members",
    highValueConsumers: "High Value Consumers",
    totalGroups: "Total Groups",
    activeGroups: "Active Groups",
    avgGroupSize: "Avg. Group Size",
    totalSegments: "Total Segments",
    activeSegments: "Active Segments",
    consumersInSegments: "Consumers in Segments",
    overlappingSegments: "Overlapping Segments",
    totalIdentities: "Total Identities",
    activeIdentities: "Active Identities",
    verifiedIdentities: "Verified Identities",
    mfaEnabled: "MFA Enabled",
    totalHouseholds: "Total Households",
    activeHouseholds: "Active Households",
    totalMembers: "Total Members",
    avgHouseholdSize: "Avg. Household Size",
    totalProfiles: "Total Profiles",
    activeProfiles: "Active Profiles",
    profilesInUse: "Profiles in Use",
    highImpactProfiles: "High Impact Profiles",
    totalPreferences: "Total Preferences",
    activePreferences: "Active Preferences",
    communicationPreferences: "Communication Preferences",
    outdatedPreferences: "Outdated Preferences",
    totalConsents: "Total Consents",
    activeConsents: "Active Consents",
    revokedConsents: "Revoked Consents",
    expiredConsents: "Expired Consents",
    totalPrograms: "Total Programs",
    activePrograms: "Active Programs",
    totalLiability: "Liability",
    totalEntitlements: "Total Entitlements",
    activeEntitlements: "Active Entitlements",
    accessGrants: "Access Grants",
    restrictedAccess: "Restricted Access",
    totalMethods: "Total Methods",
    activeMethods: "Active Methods",
    highRiskMethods: "High Risk Methods",
    totalDevices: "Total Devices",
    activeDevices: "Active Devices",
    trustedDevices: "Trusted Devices",
    blockedDevices: "Blocked Devices",
    totalSessions: "Total Sessions",
    activeSessions: "Active Sessions",
    webSessions: "Web Sessions",
    suspiciousSessions: "Suspicious Sessions",
    totalAuditEvents: "Total Audit Events",
    todayEvents: "Today Events",
    securityEvents: "Security Events",
    highRiskEvents: "High Risk Events"
  },
  metricDetails: {
    totalConsumers: "Across all workspaces",
    activeConsumers: "Active local sample",
    newThisMonth: "Recent growth",
    verifiedConsumers: "Verified identities",
    loyaltyMembers: "Members enrolled",
    highValueConsumers: "High value segment",
    totalGroups: "Across all workspaces",
    activeGroups: "Active groups",
    avgGroupSize: "Consumers per group",
    totalSegments: "Across all workspaces",
    activeSegments: "Active segments",
    consumersInSegments: "Assigned consumers",
    overlappingSegments: "Require review",
    totalIdentities: "Across all workspaces",
    activeIdentities: "Active identities",
    verifiedIdentities: "Verified identities",
    mfaEnabled: "MFA coverage",
    totalHouseholds: "Across all workspaces",
    activeHouseholds: "Active households",
    totalMembers: "Across households",
    avgHouseholdSize: "Members per household",
    totalProfiles: "Across all workspaces",
    activeProfiles: "Active definitions",
    profilesInUse: "In active use",
    highImpactProfiles: "High impact fields",
    totalPreferences: "Across all workspaces",
    activePreferences: "Active preferences",
    communicationPreferences: "Communication settings",
    outdatedPreferences: "Need review",
    totalConsents: "Across all workspaces",
    activeConsents: "Currently active",
    revokedConsents: "Revoked permissions",
    expiredConsents: "Expired permissions",
    totalPrograms: "Across all workspaces",
    activePrograms: "Active programs",
    totalLiability: "Estimated value",
    totalEntitlements: "Across workspaces",
    activeEntitlements: "Currently active",
    accessGrants: "All time",
    restrictedAccess: "Restricted entitlements",
    totalMethods: "Across workspaces",
    activeMethods: "Active methods",
    highRiskMethods: "Need review",
    totalDevices: "Across workspaces",
    activeDevices: "Recently active",
    trustedDevices: "Trusted devices",
    blockedDevices: "Blocked devices",
    totalSessions: "Across workspaces",
    activeSessions: "Currently active",
    webSessions: "Web channel",
    suspiciousSessions: "Flagged sessions",
    totalAuditEvents: "All time",
    todayEvents: "Today only",
    securityEvents: "Security related",
    highRiskEvents: "High risk events"
  },
  filters: {
    search: "Search",
    all: "All",
    moreFilters: "More Filters",
    clearAll: "Clear All",
    close: "Close more filters",
    none: "No additional filters for this tab.",
    apply: "Apply Filters",
    status: "Status",
    segment: "Segment",
    country: "Country",
    channel: "Channel",
    verification: "Verification",
    loyaltyTier: "Loyalty Tier",
    groupType: "Group Type",
    parentGroup: "Parent Group",
    segmentType: "Segment Type",
    category: "Category",
    baseSegment: "Base Segment",
    identityType: "Identity Type",
    verificationStatus: "Verification Status",
    authenticationMethod: "Authentication Method",
    riskLevel: "Risk Level",
    householdType: "Household Type",
    city: "City",
    size: "Size",
    profileType: "Profile Type",
    attributeGroup: "Attribute Group",
    preferenceType: "Preference Type",
    lastUpdated: "Last Updated",
    consentType: "Consent Type",
    legalBasis: "Legal Basis",
    consumerSegment: "Consumer Segment",
    consentScope: "Consent Scope",
    expirationStatus: "Expiration Status",
    programType: "Program Type",
    loyaltyCurrency: "Loyalty Currency",
    accessType: "Access Type",
    productScope: "Product Scope",
    consumerGroup: "Consumer Group",
    methodType: "Method Type",
    mfaEnabled: "MFA Enabled",
    createdBy: "Created By",
    deviceType: "Device Type",
    platform: "Platform",
    os: "OS",
    trustLevel: "Trust Level",
    authentication: "Authentication",
    dateRange: "Date Range",
    eventType: "Event Type",
    consumer: "Consumer",
    actor: "Actor",
    severity: "Severity"
  },
  columns: {
    title: "Columns",
    description: "Choose visible columns for this Consumer Management tab.",
    close: "Close columns",
    searchPlaceholder: "Search columns...",
    reset: "Reset",
    apply: "Apply",
    name: "Name",
    email: "Email / Phone",
    status: "Status",
    segment: "Segment",
    country: "Country",
    loyaltyTier: "Loyalty Tier",
    lastActive: "Last Active",
    lifetimeValue: "Lifetime Value",
    verification: "Verification",
    code: "Code",
    groupType: "Group Type",
    parentGroup: "Parent Group",
    consumers: "Consumers",
    countries: "Countries",
    channel: "Channel",
    segmentType: "Segment Type",
    category: "Category",
    baseSegment: "Base Segment",
    priority: "Priority",
    identityType: "Identity Type",
    primaryContact: "Primary Contact",
    verificationStatus: "Verification Status",
    authenticationMethod: "Auth Method",
    mfa: "MFA",
    riskLevel: "Risk Level",
    householdType: "Household Type",
    city: "City",
    size: "Size",
    totalSpend: "Total Spend",
    profileType: "Profile Type",
    attributeGroup: "Attribute Group",
    dataType: "Data Type",
    source: "Source",
    isPii: "Is PII",
    usageCount: "Usage Count",
    preferenceType: "Preference Type",
    consentScope: "Scope",
    defaultValue: "Default Value",
    consentType: "Consent Type",
    consumer: "Consumer",
    legalBasis: "Legal Basis",
    grantedAt: "Granted At",
    expiresAt: "Expires At",
    programType: "Program Type",
    loyaltyCurrency: "Loyalty Currency",
    tiers: "Tiers",
    activeMembers: "Active Members",
    engagementScore: "Engagement Score",
    accessType: "Access Type",
    consumerGroup: "Consumer Group",
    productScope: "Product Scope",
    grantedBy: "Granted By",
    validFrom: "Valid From",
    validTo: "Valid To",
    methodType: "Method Type",
    mfaEnabled: "MFA Enabled",
    lastUsed: "Last Used",
    createdBy: "Created By",
    deviceType: "Device Type",
    platform: "Platform",
    os: "OS",
    trustLevel: "Trust Level",
    lastSeen: "Last Seen",
    device: "Device",
    location: "Location",
    ipAddress: "IP Address",
    authentication: "Authentication",
    startTime: "Start Time",
    duration: "Duration",
    timestamp: "Timestamp",
    actor: "Actor",
    eventType: "Event Type",
    entity: "Entity",
    action: "Action",
    severity: "Severity"
  },
  fields: {
    name: "Name",
    code: "Code",
    email: "Email",
    phone: "Phone",
    status: "Status",
    segment: "Segment",
    country: "Country",
    channel: "Channel",
    verification: "Verification",
    loyaltyTier: "Loyalty Tier",
    riskLevel: "Risk Level",
    healthScore: "Health Score",
    lastUpdated: "Last Updated",
    consumers: "Consumers",
    members: "Members",
    consumerCount: "Consumer Count",
    accessGrants: "Access Grants",
    devices: "Devices",
    sessions: "Sessions",
    lastActive: "Last Active",
    auditEvents: "Audit Events",
    lastChange: "Last Change",
    profiles: "Profiles",
    preferences: "Preferences",
    consents: "Consents",
    loyaltyPrograms: "Loyalty Programs",
    accessEntitlements: "Access & Entitlements",
    auditLogs: "Audit Logs",
    primaryContact: "Primary Contact",
    consumer: "Consumer",
    consumerGroup: "Consumer Group",
    groupType: "Group Type",
    parentGroup: "Parent Group",
    countries: "Countries",
    category: "Category",
    segmentType: "Segment Type",
    baseSegment: "Base Segment",
    identityType: "Identity Type",
    verificationStatus: "Verification Status",
    authenticationMethod: "Authentication Method",
    mfa: "MFA",
    householdType: "Household Type",
    city: "City",
    size: "Size",
    profileType: "Profile Type",
    attributeGroup: "Attribute Group",
    dataType: "Data Type",
    isPii: "Is PII",
    preferenceType: "Preference Type",
    defaultValue: "Default Value",
    consentType: "Consent Type",
    legalBasis: "Legal Basis",
    consentScope: "Consent Scope",
    expiresAt: "Expires At",
    programType: "Program Type",
    loyaltyCurrency: "Loyalty Currency",
    tiers: "Tiers",
    productScope: "Product Scope",
    accessType: "Access Type",
    validTo: "Valid To",
    methodType: "Method Type",
    mfaEnabled: "MFA Enabled",
    deviceType: "Device Type",
    platform: "Platform",
    os: "OS",
    trustLevel: "Trust Level",
    authentication: "Authentication",
    eventType: "Event Type",
    actor: "Actor",
    severity: "Severity",
    reason: "Reason"
  },
  relationships: {
    profiles: "Profiles",
    preferences: "Preferences",
    consents: "Consents",
    loyaltyPrograms: "Loyalty Programs",
    accessEntitlements: "Access & Entitlements",
    devices: "Devices",
    auditLogs: "Audit Logs"
  },
  status: {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    verified: "Verified",
    unverified: "Unverified",
    suspended: "Suspended",
    revoked: "Revoked",
    expired: "Expired",
    restricted: "Restricted",
    blocked: "Blocked",
    trusted: "Trusted",
    untrusted: "Untrusted",
    terminated: "Terminated",
    success: "Success",
    failed: "Failed",
    draft: "Draft",
    deprecated: "Deprecated",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    good: "Good",
    warning: "Warning"
  },
  table: {
    showing: "Showing {{start}} to {{end}} of {{total}} records",
    actions: "Actions",
    pageSize: "Page size",
    perPage: "{{size}} / page"
  },
  views: {
    listView: "List View",
    gridView: "Grid View"
  },
  common: {
    none: "-"
  },
  boolean: {
    yes: "Yes",
    no: "No"
  },
  bulk: {
    selectedCount: "{{count}} selected",
    exportSelected: "Export Selected",
    compareSelected: "Compare Selected",
    cloneSelected: "Clone Selected",
    deactivateSelected: "Deactivate Selected",
    selectAll: "Select all visible records",
    selectRow: "Select row",
    clearSelection: "Clear selection",
    states: {
      default: "{{count}} selected",
      allPageSelected: "All visible records selected",
      partialPageSelected: "{{count}} selected on this page"
    },
    errors: {
      emptySelection: "Select at least one record.",
      compareCount: "Compare requires 2 to 4 selected records.",
      processing: "Bulk operation is processing."
    },
    success: {
      exportCompleted: "Export completed successfully",
      compareCompleted: "Comparison prepared locally",
      cloneCompleted: "Selected records cloned locally",
      deactivateCompleted: "Selected records updated locally"
    },
    modals: {
      export: {
        title: "Export Selected Records",
        description: "Export selected Consumer Management records.",
        selectedCount: "Export {{count}} selected records.",
        format: "Export Format",
        formats: {
          csv: "CSV",
          xlsx: "XLSX",
          pdf: "PDF"
        }
      },
      exportProgress: {
        title: "Export In Progress",
        description: "Preparing the selected local records.",
        message: "Please wait while the export is prepared.",
        preparing: "Preparing data"
      },
      exportComplete: {
        title: "Export Completed",
        description: "Your local demo export is ready.",
        fileSummary: "File Summary",
        download: "Download"
      },
      compare: {
        title: "Compare Selected Records",
        description: "Compare selected records side by side."
      },
      clone: {
        title: "Clone Selected Records",
        description: "Create local cloned records.",
        selectedCount: "Clone {{count}} selected records.",
        prefix: "Prefix",
        prefixPlaceholder: "Copy of"
      },
      deactivate: {
        title: "Deactivate Selected Records",
        description: "Deactivate selected local records.",
        selectedCount: "Deactivate {{count}} selected records."
      }
    }
  },
  rowActions: {
    viewDetails: "View Details",
    edit: "Edit",
    clone: "Clone",
    exportRecord: "Export Record",
    viewAudit: "View Audit",
    deactivate: "Deactivate",
    addMembers: "Add Members",
    blockDevice: "Block Device",
    compare: "Compare",
    enableMfa: "Enable MFA",
    endSession: "End Session",
    exportEvents: "Export Events",
    grantAdditional: "Grant Additional",
    manageBenefits: "Manage Benefits",
    manageTiers: "Manage Tiers",
    openInvestigation: "Open Investigation",
    resetCredential: "Reset Credential",
    resetPassword: "Reset Password",
    resetTrust: "Reset Trust",
    revokeConsent: "Revoke Consent",
    viewActivity: "View Activity",
    viewBookings: "View Bookings",
    viewCampaigns: "View Campaigns",
    viewConsumer: "View Consumer",
    viewConsumers: "View Consumers",
    viewDevices: "View Devices",
    viewFullProfile: "View Full Profile",
    viewIdentity: "View Identity",
    viewMembers: "View Members",
    viewPreferences: "View Preferences",
    viewProducts: "View Products",
    viewRules: "View Rules",
    viewSessions: "View Sessions",
    viewTransactions: "View Transactions",
    viewUsage: "View Usage"
  },
  drawerActions: {
    edit: "Edit",
    clone: "Clone",
    viewAudit: "View Audit",
    deactivate: "Deactivate"
  },
  drawerTabs: {
    overview: "Overview",
    composition: "Composition",
    activity: "Activity",
    access: "Access",
    history: "History",
    relationships: "Relationships",
    security: "Security",
    usage: "Usage",
    audit: "Audit",
    definition: "Definition",
    impact: "Impact",
    tiers: "Tiers",
    benefits: "Benefits",
    earnRules: "Earn Rules",
    burnRules: "Burn Rules",
    members: "Members",
    performance: "Performance",
    scope: "Scope",
    entitlements: "Entitlements",
    restrictions: "Restrictions",
    context: "Context",
    changes: "Changes",
    evidence: "Evidence"
  },
  drawer: {
    close: "Close drawer",
    previous: "Previous",
    next: "Next",
    position: "Selected record",
    generalInformation: "General Information",
    healthRisk: "Health & Risk",
    relatedIntelligence: "Related Intelligence",
    recentActivity: "Recent Activity",
    relationshipMap: "Relationship Map"
  },
  refresh: {
    default: "Refresh",
    refreshing: "Refreshing...",
    refreshed: "Refreshed",
    failed: "Refresh Failed",
    lastUpdated: "Last updated: {{time}}"
  },
  related: {
    title: "Related Intelligence",
    description: "Relationships and usage signals for the selected Consumer Management record.",
    viewAll: "View all"
  },
  messages: {
    filtersApplied: "Filters applied.",
    filtersReset: "Filters cleared.",
    bulkCreateReady: "Bulk create flow opened.",
    refreshFailed: "Refresh failed. Try again.",
    refreshCompleted: "Consumer data refreshed.",
    created: "Record created.",
    edited: "Record updated.",
    cloned: "Record cloned.",
    importPreviewReady: "Import preview record added.",
    exportPrepared: "Export prepared.",
    compareReady: "Comparison prepared.",
    columnsUpdated: "Columns updated.",
    deactivated: "Record deactivated."
  },
  drawerPanels: {
    composition: {
      title: "Composition",
      description: "{{entity}} composition, members, rules, and hierarchy."
    },
    activity: {
      title: "Activity",
      description: "{{entity}} activity, events, and lifecycle signals."
    },
    access: {
      title: "Access",
      description: "{{entity}} access, grants, and restrictions."
    },
    history: {
      title: "History",
      description: "{{entity}} lifecycle history."
    },
    security: {
      title: "Security",
      description: "{{entity}} security posture and risk."
    },
    usage: {
      title: "Usage",
      description: "{{entity}} usage across channels."
    },
    audit: {
      title: "Audit",
      description: "{{entity}} audit trail."
    },
    definition: {
      title: "Definition",
      description: "{{entity}} definition and configuration."
    },
    impact: {
      title: "Impact",
      description: "{{entity}} impact analysis."
    },
    tiers: {
      title: "Tiers",
      description: "{{entity}} tier configuration."
    },
    benefits: {
      title: "Benefits",
      description: "{{entity}} benefit catalog."
    },
    earnRules: {
      title: "Earn Rules",
      description: "{{entity}} earning logic."
    },
    burnRules: {
      title: "Burn Rules",
      description: "{{entity}} redemption logic."
    },
    members: {
      title: "Members",
      description: "{{entity}} members and cohorts."
    },
    performance: {
      title: "Performance",
      description: "{{entity}} performance indicators."
    },
    scope: {
      title: "Scope",
      description: "{{entity}} products, channels, and scope."
    },
    entitlements: {
      title: "Entitlements",
      description: "{{entity}} granted entitlements."
    },
    restrictions: {
      title: "Restrictions",
      description: "{{entity}} restrictions and conditions."
    },
    context: {
      title: "Context",
      description: "{{entity}} event context."
    },
    changes: {
      title: "Changes",
      description: "{{entity}} field changes."
    },
    evidence: {
      title: "Evidence",
      description: "{{entity}} evidence and payloads."
    }
  },
  charts: {
    title: "Insights",
    empty: "No chart data",
    consumersByStatus: {
      title: "Consumers by Status",
      description: "Active, inactive, suspended, and pending consumers."
    },
    consumersBySegment: {
      title: "Consumers by Segment",
      description: "Top segment distribution."
    },
    loyaltyDistribution: {
      title: "Loyalty Distribution",
      description: "Loyalty tier mix."
    },
    groupsByType: {
      title: "Groups by Type",
      description: "Group type split."
    },
    groupsByCountry: {
      title: "Groups by Country",
      description: "Top countries."
    },
    segmentsByType: {
      title: "Segments by Type",
      description: "Segment strategy mix."
    },
    overlappingSegments: {
      title: "Overlapping Segments",
      description: "Overlap severity."
    },
    identitiesByType: {
      title: "Identities by Type",
      description: "Identity channel split."
    },
    authenticationMethods: {
      title: "Authentication Methods",
      description: "Primary authentication method mix."
    },
    householdsByType: {
      title: "Households by Type",
      description: "Household type mix."
    },
    householdsBySize: {
      title: "Households by Size",
      description: "Member count bands."
    },
    typeDistribution: {
      title: "Type Distribution",
      description: "Definition type distribution."
    },
    topCategories: {
      title: "Top Categories",
      description: "Top categories by usage."
    },
    consentsByType: {
      title: "Consents by Type",
      description: "Consent category mix."
    },
    revocationTrend: {
      title: "Revocation Trend",
      description: "Revocations over time."
    },
    programsByType: {
      title: "Programs by Type",
      description: "Program type split."
    },
    activeMembersTrend: {
      title: "Active Members Trend",
      description: "Member growth over time."
    },
    entitlementsByType: {
      title: "Entitlements by Type",
      description: "Access type distribution."
    },
    restrictedAccessTrend: {
      title: "Restricted Access Trend",
      description: "Restricted entitlements trend."
    },
    methodsByType: {
      title: "Methods by Type",
      description: "Authentication method mix."
    },
    mfaAdoptionTrend: {
      title: "MFA Adoption Trend",
      description: "MFA adoption over time."
    },
    devicesByType: {
      title: "Devices by Type",
      description: "Device type distribution."
    },
    deviceRiskDistribution: {
      title: "Device Risk Distribution",
      description: "Device risk levels."
    },
    sessionsOverTime: {
      title: "Sessions Over Time",
      description: "Session volume trend."
    },
    sessionsByChannel: {
      title: "Sessions by Channel",
      description: "Channel distribution."
    },
    eventsByType: {
      title: "Events by Type",
      description: "Audit event type mix."
    },
    eventsBySeverity: {
      title: "Events by Severity",
      description: "Severity distribution."
    },
    highRiskEventsTrend: {
      title: "High Risk Events Trend",
      description: "High risk audit trend."
    }
  },
  chartItems: {
    active: "Active",
    inactive: "Inactive",
    suspended: "Suspended",
    pending: "Pending",
    premiumTravelers: "Premium Travelers",
    leisureTravelers: "Leisure Travelers",
    businessTravelers: "Business Travelers",
    familyTravelers: "Family Travelers",
    platinum: "Platinum",
    gold: "Gold",
    silver: "Silver",
    member: "Member",
    dynamic: "Dynamic",
    ruleBased: "Rule-Based",
    manual: "Manual",
    import: "Import",
    unitedStates: "United States",
    unitedKingdom: "United Kingdom",
    uae: "UAE",
    france: "France",
    behavioral: "Behavioral",
    lifecycle: "Lifecycle",
    affluence: "Affluence",
    intent: "Intent",
    lowOverlap: "Low Overlap",
    mediumOverlap: "Medium Overlap",
    highOverlap: "High Overlap",
    email: "Email",
    phone: "Phone",
    socialLogin: "Social Login",
    username: "Username",
    passwordOtp: "Password + OTP",
    smsOtp: "SMS OTP",
    emailOtp: "Email OTP",
    biometric: "Biometric",
    family: "Family",
    nonFamily: "Non-Family",
    shared: "Shared",
    oneMember: "1 Member",
    twoMembers: "2 Members",
    threeMembers: "3 Members",
    fivePlusMembers: "5+ Members",
    communication: "Communication",
    privacy: "Privacy",
    experience: "Experience",
    other: "Other",
    mobileApp: "Mobile App",
    web: "Web",
    callCenter: "Call Center",
    marketing: "Marketing",
    analytics: "Analytics",
    jun: "Jun",
    jul: "Jul",
    aug: "Aug",
    sep: "Sep",
    oct: "Oct",
    may: "May",
    dec: "Dec",
    jan: "Jan",
    points: "Points",
    tier: "Tier",
    miles: "Miles",
    paidSubscription: "Paid Subscription",
    productAccess: "Product Access",
    loyaltyBenefit: "Loyalty Benefit",
    membershipAccess: "Membership Access",
    premiumAccess: "Premium Access",
    feb: "Feb",
    mar: "Mar",
    apr: "Apr",
    password: "Password",
    authenticatorApp: "Authenticator App",
    otp: "OTP",
    mobilePhone: "Mobile Phone",
    laptop: "Laptop",
    desktop: "Desktop",
    tablet: "Tablet",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    may6: "May 6",
    may7: "May 7",
    may8: "May 8",
    may9: "May 9",
    may12: "May 12",
    authentication: "Authentication",
    authorization: "Authorization",
    profile: "Profile",
    security: "Security"
  },
  modals: {
    create: "Create",
    saveChanges: "Save Changes",
    clone: "Clone",
    import: "Import",
    export: "Export",
    compare: "Compare",
    deactivate: "Deactivate",
    cancel: "Cancel",
    createDescription: "Create a local {{entity}} using the approved tab schema.",
    editTitle: "Edit {{entity}}",
    editDescription: "Update selected {{entity}} fields.",
    cloneTitle: "Clone {{entity}}",
    cloneDescription: "Create a local cloned record.",
    cloneSummary: "Clone {{entity}} {{name}} as a local draft.",
    importTitle: "Import {{entity}}",
    importDescription: "Preview and validate local import data.",
    importPreview: "Import Preview",
    exportTitle: "Export {{entity}}",
    exportDescription: "Prepare a local demo export.",
    exportSummary: "Export {{count}} {{entity}} from the current scoped view.",
    compareTitle: "Compare {{entity}}",
    compareDescription: "Compare selected local records.",
    compareSelected: "Selected Records",
    deactivateTitle: "Deactivate {{entity}}",
    deactivateDescription: "Deactivate the selected local record.",
    deactivateWarning: "Are you sure you want to deactivate this {{entity}}?",
    fileFormat: "File Format",
    previewRows: "Preview Rows",
    validateOnly: "Validate Only",
    updateExisting: "Update Existing",
    fields: {
      selectValue: "Select value"
    }
  },
  compare: {
    field: "Field",
    changeType: "Change Type",
    states: {
      same: "Same",
      added: "Added",
      removed: "Removed",
      changed: "Changed"
    }
  },
  validation: {
    requiredFields: "Complete required fields before continuing.",
    required: "This field is required.",
    invalidOption: "Select an approved lookup option.",
    uniqueCode: "Code must be unique in this tab.",
    reasonRequired: "Reason is required for deactivation."
  }
} as const;
