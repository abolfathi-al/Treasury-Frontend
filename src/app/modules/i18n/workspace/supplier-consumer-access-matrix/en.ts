export const supplierConsumerAccessMatrixWorkspaceEn = {
  title: "Supplier-Consumer Access Workspace",
  navTitle: "Access Workspace",
  breadcrumb: "Supplier-Consumer Access Workspace",
  helperText: "Manage and analyze data access between suppliers and consumers.",
  workspace: {
    title: "Supplier-Consumer Access Workspace",
    breadcrumb: "Access Workspace",
    helperText: "Manage and analyze data access between suppliers and consumers. Final access is determined by supplier policy, consumer preference, scope, and actor context."
  },
  actions: {
    accessPolicies: "Access Policies",
    export: "Export",
    exportReport: "Export Report",
    runAccessEvaluation: "Run Access Evaluation"
  },
  tabs: {
    overview: "Overview",
    supplierView: "Supplier View",
    consumerView: "Consumer View",
    relationshipWorkspace: "Relationship Workspace"
  },
  summary: {
    totalSuppliers: "Total Suppliers",
    totalSuppliersDetail: "Local demo suppliers",
    totalConsumers: "Total Consumers",
    totalConsumersDetail: "Local demo consumers",
    allowed: "Allowed",
    blocked: "Blocked",
    notConfigured: "Not Configured",
    totalAllowed: "Total Allowed",
    totalBlocked: "Total Blocked",
    pendingReview: "Pending Review",
    lastEvaluation: "Last Evaluation"
  },
  filters: {
    searchLabel: "Search",
    searchPlaceholder: "Search supplier or consumer...",
    supplier: "Supplier",
    allSuppliers: "All Suppliers",
    consumer: "Consumer",
    allConsumers: "All Consumers",
    status: "Status",
    allStatuses: "All Statuses"
  },
  overview: {
    title: "Access Overview Matrix",
    subtitle: "Matrix cells select a supplier-consumer relationship. Decisions are updated in the relationship workspace."
  },
  table: {
    supplierConsumer: "Suppliers \\ Consumers",
    supplier: "Supplier",
    consumer: "Consumer",
    summary: "Summary",
    totalByConsumer: "Total (Allowed / Blocked / Pending / Not Configured)"
  },
  status: {
    allowed: "Allowed",
    blocked: "Blocked",
    pending: "Pending",
    pendingReview: "Pending Review",
    notConfigured: "Not Configured"
  },
  supplierPolicy: {
    title: "4. Supplier Visibility Policy"
  },
  consumerPreference: {
    title: "5. Consumer Supplier Preference"
  },
  preference: {
    enabled: "Enabled",
    disabled: "Disabled",
    pending: "Pending",
    notConfigured: "Not Configured"
  },
  finalDecision: {
    title: "Final Data Access Decision",
    centerLabel: "Total Relationships",
    explanationTitle: "Final decision is calculated from:",
    explanation: "Supplier Visibility Policy + Consumer Supplier Preference + Consumer Effective Scope + Actor Context"
  },
  logic: {
    title: "3. Access Decision Logic",
    supplierVisibilityPolicy: "Supplier Visibility Policy",
    supplierVisibilityPolicyDetail: "Supplier allows or blocks consumer access.",
    consumerSupplierPreference: "Consumer Supplier Preference",
    consumerSupplierPreferenceDetail: "Consumer enables or disables the supplier.",
    consumerEffectiveScope: "Consumer Effective Scope",
    consumerEffectiveScopeDetail: "Scope determines which supplier data can be accessed.",
    actorContext: "Actor Context",
    actorContextDetail: "Membership, role, and active actor context.",
    finalDecision: "Final Data Access Decision",
    finalDecisionDetail: "Allow or block within scope boundaries."
  },
  distribution: {
    title: "Access Status Distribution",
    total: "Total"
  },
  recentChanges: {
    title: "Recent Access Changes",
    time: "Time",
    supplier: "Supplier",
    consumer: "Consumer",
    changeType: "Change Type",
    previous: "Previous",
    new: "New",
    changedBy: "Changed By",
    reason: "Reason"
  },
  changeTypes: {
    allowed: "Allowed",
    blocked: "Blocked",
    pending: "Pending",
    reset: "Reset to Default"
  },
  auditReasons: {
    initialConfiguration: "Initial configuration",
    supplierRestriction: "Supplier restriction",
    approvedBySupplier: "Approved by supplier",
    needsVerification: "Needs verification",
    contractExpired: "Contract expired",
    demoDecisionSaved: "Demo decision saved"
  },
  decision: {
    breakdownTitle: "Decision Breakdown",
    supplierVisibilityPolicy: "Supplier Visibility Policy",
    consumerSupplierPreference: "Consumer Supplier Preference",
    consumerEffectiveScope: "Consumer Effective Scope",
    actorContext: "Actor Context",
    allowed: "Allowed",
    blocked: "Blocked",
    defaultOpen: "Default Open",
    enabled: "Enabled",
    disabled: "Disabled",
    notConfigured: "Not Configured",
    valid: "Valid",
    invalid: "Invalid",
    outsideScope: "Outside Scope",
    validAgencyUser: "Valid (Agency User)",
    visibilityPolicyDetail: "Visibility Policy",
    consumerPreferenceDetail: "Supplier Preference",
    scopeDetail: "Scope Validity",
    actorContextDetail: "Agency User",
    reasons: {
      allowedByDefaultOpenSupply: "Allowed by default open supply.",
      blockedBySupplierPolicy: "Blocked by supplier policy.",
      disabledByConsumerPreference: "Disabled by consumer preference.",
      outsideConsumerEffectiveScope: "Outside consumer effective scope.",
      actorContextMismatch: "Actor context mismatch.",
      pendingReview: "Pending review before final access is confirmed.",
      notConfigured: "No explicit relationship decision is configured."
    }
  },
  relationship: {
    panelTitle: "Relationship Workspace",
    panelSubtitle: "Manage selected supplier-consumer access.",
    focusTitle: "Relationship Workspace",
    focusSubtitle: "Use the side panel to review decision evidence and update the selected relationship.",
    workspaceNoteTitle: "Relationship management",
    workspaceNote: "The matrix remains an overview selector. Relationship decisions are changed only through the form in this workspace.",
    selectedRelationship: "Selected Relationship",
    selectRelationship: "Select relationship",
    selectedRelationshipHint: "For selected relationship",
    decisionSourceTitle: "Decision Source",
    currentFinalDecision: "Current Final Decision",
    decisionSource: "Decision Source",
    lastEvaluated: "Last Evaluated",
    evaluatedBy: "Evaluated By",
    by: "by",
    updateDecision: "Update Decision",
    decision: "Decision",
    allow: "Allow",
    block: "Block",
    pendingReview: "Pending Review",
    resetToDefault: "Reset to Default",
    reason: "Reason (optional)",
    reasonPlaceholder: "Enter reason for this decision...",
    effectiveFrom: "Effective From",
    effectiveTo: "Effective To (optional)",
    reviewRequired: "Review Required",
    saveDecision: "Save Decision",
    cancel: "Cancel",
    demoAction: "Demo action selected:",
    decisionSaved: "Decision saved locally",
    decisionCanceled: "Decision changes canceled",
    openedSimulator: "Opened Access Simulator",
    openedGrants: "Opened related grants",
    viewedFullHistory: "Viewed full history",
    panelClosed: "Relationship panel close action selected",
    auditHistory: "Audit & History",
    viewFullHistory: "View full history",
    relatedActions: "Related Actions",
    openInAccessSimulator: "Open in Access Simulator",
    viewRelatedGrants: "View Related Grants",
    sources: {
      policyPreference: "Policy + Preference",
      supplierPolicy: "Supplier Policy",
      consumerPreference: "Consumer Preference",
      manualOverride: "Manual Override",
      defaultOpen: "Default Open",
      effectiveScope: "Effective Scope",
      actorContext: "Actor Context"
    }
  },
  reviewQueue: {
    title: "Pending Review Queue",
    pendingAge: "Pending demo relationship",
    viewAllPending: "View all pending"
  },
  supplierView: {
    title: "Supplier View",
    subtitle: "Scaffolded supplier-centric workspace for the next management workflow.",
    selectSupplier: "Select Supplier",
    allowSelected: "Allow Selected",
    blockSelected: "Block Selected",
    sendSelectedToReview: "Send Selected to Review",
    allowedConsumers: "Allowed Consumers",
    blockedConsumers: "Blocked Consumers",
    pendingConsumers: "Pending Consumers",
    notConfiguredConsumers: "Not Configured Consumers",
    emptyGroup: "No relationships in this group."
  },
  consumerView: {
    title: "Consumer View",
    subtitle: "Scaffolded consumer-centric workspace for the next management workflow.",
    selectConsumer: "Select Consumer",
    enableSelected: "Enable Selected",
    disableSelected: "Disable Selected",
    sendSelectedToReview: "Send Selected to Review",
    enabledSuppliers: "Enabled Suppliers",
    disabledSuppliers: "Disabled Suppliers",
    pendingSuppliers: "Pending Suppliers",
    notConfiguredSuppliers: "Not Configured Suppliers",
    emptyGroup: "No relationships in this group."
  },
  health: {
    title: "Access Health",
    healthyLabel: "Healthy",
    critical: "Critical",
    warning: "Warning",
    healthy: "Healthy"
  },
  quickActions: {
    title: "Quick Actions",
    addAccessPolicy: "Add Access Policy",
    addAccessPolicyDetail: "Configure supplier visibility",
    consumerPreferences: "Consumer Preferences",
    consumerPreferencesDetail: "Manage consumer selections",
    bulkUpdate: "Bulk Update",
    bulkUpdateDetail: "Update multiple relationships",
    pendingReviews: "Pending Reviews",
    pendingReviewsDetail: "Review pending requests",
    accessSimulator: "Access Simulator",
    accessSimulatorDetail: "Simulate access decisions",
    exportMatrix: "Export Matrix",
    exportMatrixDetail: "Export full access matrix"
  }
} as const;
