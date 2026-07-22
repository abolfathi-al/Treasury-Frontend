export const accessSimulatorWorkspaceEn = {
  title: "Access Simulator",
  navTitle: "Access Simulator",
  breadcrumb: "Access Simulator",
  helperText: "Simulate how a grant, permission change, or delegation update will affect effective access, pricing, and visibility.",
  actions: {
    loadSimulation: "Load Simulation",
    saveSimulation: "Save Simulation",
    runSimulation: "Run Simulation",
    advancedOptions: "Advanced Options",
    viewPermissionDiff: "View permission diff",
    viewPricingRules: "View all pricing rules",
    viewVisibilityRules: "View all visibility rules",
    nextActions: "Next Actions",
    applyGrant: "Apply This Grant",
    shareSimulation: "Share Simulation",
    exportReport: "Export Report (PDF)"
  },
  timeline: {
    title: "11. Simulation Timeline",
    currentState: "Current State",
    currentStateDetail: "Today 10:15 AM",
    grantApplied: "Grant Applied",
    grantAppliedDetail: "+ Read Catalog Access",
    effectiveRecalculated: "Effective Access Recalculated",
    effectiveRecalculatedDetail: "Engine Recompute",
    visibilityUpdated: "Visibility Updated",
    visibilityUpdatedDetail: "Rules Evaluation",
    pricingAnalyzed: "Pricing Impact Analyzed",
    pricingAnalyzedDetail: "Rules & Permissions",
    finalReady: "Final Result Ready",
    finalReadyDetail: "Simulation Complete"
  },
  inputs: {
    title: "1. Simulation Inputs",
    membership: "User / Membership",
    actorType: "Actor Type",
    grantTemplate: "Grant Template",
    permissions: "Permissions",
    scope: "Scope",
    delegationBoundary: "Delegation Boundary"
  },
  comparison: {
    title: "2. Access Comparison",
    before: "Before",
    after: "After (Simulated)",
    diff: "Diff",
    currentAccess: "Effective Access (Before)",
    simulatedAccess: "Effective Access (After - Simulated)",
    accessDifference: "Access Difference",
    netPermissions: "Net +4 Permissions",
    netChange: "Net Change"
  },
  impact: {
    title: "3. Impact Summary",
    permissionsAdded: "Permissions Added",
    permissionsRemoved: "Permissions Removed",
    resourcesAffected: "Resources Affected",
    suppliersAffected: "Suppliers Affected",
    riskLevel: "Risk Level",
    overview: "Impact Overview",
    riskFactors: "Risk Factors",
    overviewGrant: "This simulation grants READ access to Hotelbeds Catalogs.",
    overviewRules: "2 suppliers, 3 catalogs, and 14 pricing rules will be impacted.",
    overviewVisibility: "No visibility rules will be reduced.",
    overviewRisk: "Risk level is Medium due to pricing impact and data sensitivity.",
    accessChangeConfidence: "Access change confidence",
    pricingRulesImpacted: "Pricing rules impacted",
    crossSupplierAccess: "Cross-supplier access",
    sensitiveDataAccess: "Sensitive data access"
  },
  permissions: {
    title: "4. Permissions Changes",
    added: "Added (5)",
    removed: "Removed (1)",
    unchanged: "Unchanged",
    permission: "Permission",
    scope: "Scope",
    reason: "Change Reason"
  },
  resources: {
    title: "5. Affected Resources",
    suppliers: "Suppliers",
    countries: "Countries",
    cities: "Cities",
    catalogs: "Catalogs",
    services: "Services",
    channels: "Channels",
    resource: "Resource",
    before: "Before",
    after: "After",
    change: "Change"
  },
  memberships: {
    title: "Affected Memberships",
    membership: "Membership",
    impactType: "Impact Type",
    change: "Change"
  },
  pricing: {
    title: "6. Pricing Rules Affected",
    ruleName: "Rule Name",
    ruleType: "Rule Type",
    change: "Change"
  },
  visibility: {
    title: "7. Visibility Rules Affected",
    reduced: "0 Reduced",
    ruleName: "Rule Name",
    appliesTo: "Applies To",
    change: "Change"
  },
  inheritance: {
    title: "8. Inheritance Changes",
    newInherited: "New Inherited (2)",
    inheritanceLost: "Inheritance Lost (0)",
    changedPath: "Changed Path (1)",
    resource: "Resource",
    changeType: "Change Type",
    from: "From",
    to: "To",
    reason: "Reason",
    newlyInherited: "Newly Inherited",
    lost: "Lost",
    pathChanged: "Path Changed"
  },
  result: {
    completed: "Simulation Completed Successfully",
    completedDetail: "The simulation has been calculated using current policies and rules.",
    simulationId: "Simulation ID",
    runBy: "Run By",
    runAt: "Run At",
    duration: "Duration"
  },
  labels: {
    total: "Total",
    permissions: "Permissions",
    rules: "Rules",
    allowed: "Allowed",
    inherited: "Inherited",
    explicit: "Explicit",
    denied: "Denied"
  },
  changes: {
    added: "Added",
    removed: "Removed",
    unchanged: "Unchanged",
    increased: "Increased",
    noChange: "No Change",
    changed: "Changed"
  },
  impactTypes: {
    added: "Added",
    removed: "Removed",
    changed: "Changed",
    inherited: "Inherited"
  },
  reasons: {
    grantApplied: "Grant Applied",
    scopeMatched: "Scope matched",
    permissionIncluded: "Permission included",
    readOnlyTemplate: "Read-only template",
    alreadyEffective: "Already effective",
    newParentGrant: "New grant at parent level",
    scopeBoundaryUpdated: "Scope boundary updated"
  }
} as const;
