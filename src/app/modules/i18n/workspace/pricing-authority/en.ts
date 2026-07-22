export const pricingAuthorityWorkspaceEn = {
  title: "Pricing Authority",
  navTitle: "Pricing Authority",
  breadcrumb: "Pricing Authority",
  helperText: "Calculate and authorize final prices using commercial contracts, rules, taxes, fees, and context.",
  demoMode: "Demo Mode",
  actions: {
    quoteSimulator: "Quote Simulator",
    quoteSimulatorDescription: "Quote Simulator is a future pricing workflow. This demo keeps the action as a modal because no route is registered yet.",
    contractMatrix: "Contract Matrix",
    rulesEngine: "Rules Engine",
    rulesEngineDescription: "Rules Engine is not registered as a route in this shell yet. Future integration should navigate to the pricing rule library.",
    export: "Export",
    calculatePrice: "Calculate Price",
    ruleLibrary: "Rule Library",
    versions: "Versions",
    publishChanges: "Publish Changes",
    createRule: "Create New Rule",
    viewAllRules: "View all rules",
    viewDetails: "View Details"
  },
  context: {
    title: "1. Context",
    editContext: "Edit Context",
    productService: "Product / Service",
    stayDates: "Stay",
    customer: "Customer",
    channel: "Channel",
    passengerGuest: "Passenger / Guest",
    currency: "Currency",
    country: "Country",
    city: "City",
    category: "Category",
    actorContext: "Actor Context",
    supplier: "Supplier",
    consumer: "Consumer",
    effectiveScope: "Effective Scope",
    pricingBoundary: "Pricing Boundary",
    ruleVersion: "Rule Version",
    lastUpdated: "Last Updated"
  },
  summary: {
    title: "2. Price Summary",
    supplierPrice: "Supplier Price",
    commissions: "Commissions",
    rulesDiscounts: "Rules & Discounts",
    taxesFees: "Taxes & Fees",
    finalSellPrice: "Final Sell Price",
    margin: "Margin",
    adjustments: "Total Adjustments",
    priceStatus: "Price Status"
  },
  status: {
    active: "Active",
    draft: "Draft",
    profitable: "Profitable"
  },
  approvals: {
    commercial: "Commercial approval",
    legal: "Legal approval"
  },
  rules: {
    title: "3. Rule Management",
    ruleType: "Rule Type",
    ruleName: "Rule Name",
    appliesTo: "Applies To",
    result: "Result",
    status: "Status",
    details: "Details",
    supplierPolicy: "Supplier Policy",
    consumerPreference: "Consumer Preference",
    pricingRule: "Pricing Rule",
    channelRule: "Channel Rule",
    geoRule: "Geo Rule",
    openRulesEngine: "Open applied rules",
    results: {
      allow: "Allow",
      preferred: "Preferred",
      weekendMarkup: "+5.00%",
      channelDiscount: "-2.50%",
      noChange: "No Change"
    },
    detailValues: {
      noRestriction: "No restriction",
      priorityOne: "Priority 1",
      applied: "Applied",
      noImpact: "No impact"
    }
  },
  filters: {
    allRuleTypes: "All Rule Types",
    allStatuses: "All Statuses",
    searchRules: "Search rules...",
    country: "Country",
    city: "City",
    currency: "Currency",
    channel: "Channel",
    customerSegment: "Customer Segment",
    status: "Status",
    authorityType: "Authority Type",
    allAuthorityTypes: "All Authority Types",
    validationStatus: "Validation Status",
    allValidationStatuses: "All Validation Statuses",
    effectiveDateFrom: "Effective Date From",
    effectiveDateTo: "Effective Date To",
    expiryDateFrom: "Expiry Date From",
    expiryDateTo: "Expiry Date To",
    effectiveDateRange: "Effective Date Range",
    expiryDateRange: "Expiry Date Range"
  },
  activeRules: {
    title: "4. Active Rules in Chain",
    order: "Order",
    ruleName: "Rule Name",
    ruleType: "Rule Type",
    appliesTo: "Applies To",
    adjustment: "Adjustment",
    impact: "Impact",
    status: "Status",
    priority: "Priority",
    actions: "Actions",
    totalAdjustment: "Total Adjustment",
    netAdjustment: "Net Adjustment"
  },
  impact: {
    title: "5. Impact Overview",
    catalogsAffected: "Catalogs Affected",
    suppliersImpacted: "Suppliers Impacted",
    bookingsImpacted: "Bookings Impacted (Est.)",
    revenueImpact: "Revenue Impact (Est.)"
  },
  scope: {
    title: "Scope Coverage",
    country: "Country",
    city: "City",
    category: "Category",
    channel: "Channel",
    product: "Product",
    scopePath: "Scope Path",
    visibilityStatus: "Visibility Status",
    visibilityRule: "Visibility Rule",
    effectiveFrom: "Effective From",
    affectedChannels: "Affected Channels",
    openExplorer: "Open in Scope Explorer"
  },
  ruleImpact: {
    title: "7. Pricing Rule Impact Analysis",
    rule: "Rule",
    revenueImpact: "Revenue Impact",
    bookingsImpact: "Bookings Impact",
    marginImpact: "Margin Impact",
    viewFullReport: "View full impact report",
    tabs: {
      revenue: "By Revenue",
      bookings: "By Bookings",
      suppliers: "By Suppliers",
      catalogs: "By Catalogs"
    }
  },
  waterfall: {
    title: "8. Price Waterfall (Detailed)",
    supplierPrice: "Supplier Price",
    commission: "Commission",
    boundary: "Boundary",
    rules: "Rules",
    taxes: "Taxes",
    finalPrice: "Final Price",
    increase: "Increase",
    decrease: "Decrease",
    subtotal: "Subtotal"
  },
  warnings: {
    title: "9. Rule Conflicts & Warnings",
    overlapTitle: "Overlapping Rule Detected",
    overlapDetail: "Corporate Pricing Rule overlaps with Weekend Rate Rule.",
    marginTitle: "Potential Margin Risk",
    marginDetail: "Total adjustments exceed 20% threshold.",
    viewAllIssues: "View all issues"
  },
  version: {
    title: "10. Publication & Versioning",
    currentVersion: "Current Version",
    status: "Status",
    lastPublished: "Last Published",
    publishedBy: "Published By",
    nextReview: "Next Review",
    compareVersions: "Compare Versions",
    viewHistory: "View Version History"
  },
  next: {
    title: "11. Next Actions",
    simulatePrice: "Simulate Price",
    simulatePriceDetail: "Run what-if simulation",
    createRule: "Create New Rule",
    createRuleDetail: "Add new pricing rule",
    cloneRuleSet: "Clone Rule Set",
    cloneRuleSetDetail: "Clone from existing",
    exportPlan: "Export Pricing Plan",
    exportPlanDetail: "Export to PDF / Excel",
    shareTeam: "Share with Team",
    shareTeamDetail: "Collaborate with team",
    auditTrail: "Audit Trail",
    auditTrailDetail: "View change history"
  },
  metrics: {
    calculatedQuotes: "Calculated Quotes",
    calculatedQuotesDetail: "Today",
    authorizedQuotes: "Authorized Quotes",
    authorizedQuotesDetail: "83.0% of calculated",
    policyViolations: "Policy Violations",
    policyViolationsDetail: "2.2% of calculated",
    avgFinalMargin: "Avg. Final Margin",
    avgFinalMarginDetail: "Across authorized",
    priceChanges: "Price Changes",
    priceChangesDetail: "Today",
    manualOverrides: "Manual Overrides",
    manualOverridesDetail: "1.3% of authorized"
  },
  tabs: {
    context: "Context",
    contractScope: "Contract & Scope",
    rulesPolicies: "Rules & Policies",
    priceComponents: "Price Components",
    validation: "Validation",
    finalPrice: "Final Price",
    authorization: "Authorization",
    auditTrail: "Audit Trail"
  },
  contract: {
    title: "2. Contract & Scope",
    activeContract: "Active Contract",
    detailsTitle: "Contract Details",
    commercialTerms: "Commercial Terms",
    contractId: "Contract ID",
    supplier: "Supplier",
    consumer: "Consumer",
    product: "Product",
    effectiveDate: "Effective",
    expiryDate: "Expires",
    tier: "Tier",
    policyMode: "Policy Mode",
    commission: "Commission",
    minSellPrice: "Min Sell Price",
    maxSellPrice: "Max Sell Price",
    currency: "Currency",
    gold: "Gold",
    bounded: "Bounded",
    percent: "Percent",
    perNight: "Per Night",
    viewContractMatrix: "View in Contract Matrix"
  },
  statuses: {
    inScope: "In Scope",
    passed: "Passed",
    authorized: "Authorized",
    calculated: "Calculated",
    manualOverride: "Manual Override",
    pendingAuthorization: "Pending Authorization",
    demoOnly: "Demo Only",
    demoRead: "Demo Read",
    failed: "Failed",
    warning: "Warning"
  },
  components: {
    title: "4. Price Components",
    component: "Component",
    calculation: "Calculation",
    amount: "Amount (USD)",
    basePrice: "Base Price From Supplier",
    weekendMarkup: "Weekend Markup",
    channelDiscount: "Channel Discount",
    commission: "Commission",
    subtotal: "Subtotal",
    vat: "VAT (8%)",
    cityTax: "City Tax",
    serviceFee: "Service Fee",
    paymentFee: "Payment Fee",
    finalPrice: "Total Final Price",
    customerPays: "Customer Pays",
    waterfallTitle: "Price component waterfall"
  },
  validation: {
    title: "5. Validation",
    contractValidity: "Contract Validity",
    scopeValidation: "Scope Validation",
    minSellPrice: "Min Sell Price",
    maxSellPrice: "Max Sell Price",
    policyCompliance: "Policy Compliance",
    ruleConflicts: "Rule Conflicts",
    priceReasonability: "Price Reasonability",
    evidenceCompleteness: "Evidence Completeness",
    run: "Run Validation",
    reasonRequired: "Reason is required before deactivation.",
    openValidation: "Open validation details",
    scenarioLabel: "Validation scenario",
    passedScenario: "Passed validation",
    failedScenario: "Failed validation",
    nextStepsTitle: "Next steps for failed validation",
    nextStepsDescription: "Resolve the contract boundary, rule conflict, or policy warning before this price can be authorized normally.",
    details: {
      withinEffectiveDates: "Within effective dates",
      allInScope: "All in-scope",
      sellPriceRange: "$80.00 - $200.00",
      noViolations: "No violations",
      noConflicts: "No conflicts",
      acceptableRange: "Within acceptable range",
      minSellViolation: "Final price is below the contract minimum sell price.",
      policyWarning: "Supplier policy requires manual review for this channel.",
      ruleConflict: "Weekend Markup Rule conflicts with Corporate Pricing Rule.",
      priceReasonabilityWarning: "Margin is below the configured review threshold."
    },
    nextSteps: {
      reviewContractMatrix: "Review Contract Matrix",
      openRulesEngine: "Open Rules Engine",
      runWhatIf: "Run What-if Scenario",
      manualAuthorization: "Send for Manual Authorization"
    }
  },
  finalPrice: {
    title: "Final Price Summary",
    detailTitle: "6. Final Price",
    customerPays: "Final Price (Customer Pays)",
    supplierPayout: "Supplier Payout (Net)",
    totalCommission: "Total Commission",
    agencyMargin: "Agency Margin",
    commission: "Commission",
    taxesFees: "Taxes & Fees",
    margin: "Margin",
    marginContribution: "Margin & Contribution"
  },
  quickActions: {
    title: "Quick Actions",
    recalculate: "Recalculate Price",
    manualOverride: "Apply Manual Override",
    changeCommission: "Change Commission Plan",
    whatIf: "Run What-if Scenario",
    sendAuthorization: "Send For Authorization",
    createRule: "Create Price Rule"
  },
  about: {
    title: "About Pricing Authority vNext",
    description: "Pricing Authority calculates and authorizes final prices using commercial contracts, rules, fees, and context.",
    boundaryNote: "It consumes contract, supplier policy, consumer preference, tax, fee, FX, scope, and context inputs but does not own those domains.",
    learnMore: "Learn more"
  },
  authorization: {
    pendingTitle: "Pending Price Authorizations ({{count}})",
    quoteId: "Quote ID",
    product: "Product",
    supplier: "Supplier",
    finalPrice: "Final Price",
    requestedBy: "Requested By",
    requestedOn: "Requested On",
    actions: "Actions",
    review: "Review"
  },
  changes: {
    title: "Recent Price Changes",
    time: "Time",
    change: "Change",
    product: "Product",
    changedBy: "Changed By",
    priceIncreased: "Price Increased",
    ruleApplied: "Rule Applied",
    commissionChanged: "Commission Changed",
    priceRecalculated: "Price Recalculated",
    manualOverride: "Manual Override Applied",
    policyWarningReviewed: "Policy Warning Reviewed",
    validationScenarioRun: "Validation Scenario Run",
    viewAll: "View all recent price changes",
    modalTitle: "All Recent Price Changes",
    modalDescription: "Review local demo price changes with search, type filtering, and page-size control.",
    search: "Search",
    searchPlaceholder: "Search changes, products, or actors...",
    typeFilter: "Type",
    pageSize: "Page size",
    showing: "Showing {{count}} of {{total}} changes",
    close: "Close",
    filters: {
      all: "All changes",
      success: "Successful changes",
      primary: "Rule and calculation changes",
      warning: "Warnings and overrides"
    }
  },
  whatIf: {
    title: "What-if Scenarios",
    scenario: "Scenario",
    change: "Change",
    impact: "Impact on Price",
    actions: "Actions",
    view: "View",
    runNew: "Run new what-if scenario"
  },
  scenarios: {
    lowerCommission: "Lower Commission to 10%",
    noWeekendMarkup: "No Weekend Markup",
    applyTenDiscount: "Apply 10% Discount",
    commissionMinusTwo: "Commission -2%",
    removeRule: "Remove Rule",
    manualDiscount: "Manual Discount"
  },
  fixtures: {
    hotelCityCenter: "Hotel - City Center",
    hotelTaksim: "Hotel - Taksim",
    flightIstanbulDubai: "Flight - IST > DXB"
  },
  audit: {
    title: "Audit Trail",
    scaffold: "Traceable demo audit events for price calculation, validation, authorization, and future backend decision snapshots.",
    time: "Time",
    event: "Event",
    actor: "Actor",
    result: "Result",
    priceAuthorized: "Price Authorized",
    validationPassed: "Validation Passed",
    contractRead: "Contract Matrix Input Read",
    priceCalculated: "Price Calculated",
    manualOverride: "Manual Override Recorded",
    commissionScenario: "Commission Scenario Captured",
    whatIfRun: "What-if Scenario Run",
    authorizationRequested: "Authorization Requested",
    ruleDrafted: "Price Rule Drafted",
    authorityDeactivated: "Authority Deactivated"
  },
  bulk: {
    noSelection: "Select at least one authority first.",
    compareRequiresTwoToFour: "Select 2 to 4 authorities to compare.",
    cloneRequiresOne: "Select exactly one authority to clone."
  },
  export: {
    action: "Export",
    success: "Export prepared for {{count}} authorities as {{format}}.",
    scope: {
      title: "Export Scope",
      currentFiltered: "Current filtered results",
      selected: "Selected authorities only",
      all: "All demo authorities",
      workspace: "Current tab workspace"
    },
    format: {
      title: "Format",
      csv: "CSV",
      xlsx: "XLSX",
      pdf: "PDF summary"
    },
    includes: {
      title: "Include Options",
      authoritySummary: "Authority summary",
      productHierarchy: "Product hierarchy",
      pricingTerms: "Pricing terms",
      validationResults: "Validation results",
      linkedContractReferences: "Linked contract references",
      linkedPoliciesRules: "Linked policies / rules",
      auditSummary: "Audit summary"
    }
  },
  compare: {
    action: "Compare",
    pricingTerms: "Pricing terms",
    productScope: "Product scope",
    validation: "Validation",
    commissionMargin: "Commission / margin",
    ruleCoverage: "Rule coverage",
    selectionHint: "Pick 2 to 4 authorities for this local comparison."
  },
  deactivate: {
    action: "Deactivate"
  },
  related: {
    scopedDescription: "This full list is filtered by the selected authority product scope. It is local demo data only.",
    item: "Item",
    scope: "Scope"
  },
  modal: {
    context: "Context Summary",
    basePrice: "Base Price",
    weekendMarkup: "Weekend Markup",
    channelDiscount: "Channel Discount",
    overridePrice: "Override Final Price",
    reason: "Reason",
    reasonPlaceholder: "Enter reason for this demo override...",
    commissionPercent: "Commission Percent",
    commissionBoundary: "Pricing Authority can test commission inputs here, but contract ownership remains in Commercial Contract Matrix.",
    scenarioName: "Scenario Name",
    scenarioChange: "Scenario Change",
    authorizationNote: "Authorization Note",
    authorizationPlaceholder: "Enter authorization note for this demo price...",
    ruleName: "Rule Name",
    rulePlaceholder: "Pricing Rule Library is not registered yet. This creates local demo feedback only.",
    demoNote: "Demo only. This updates local UI state only and does not call backend APIs, persist data, authorize real prices, or calculate a real booking price.",
    cancel: "Cancel",
    confirm: "Confirm",
    calculateTitle: "Calculate / Recalculate Price",
    calculateDescription: "Run the local demo calculation using the current contract, rules, fees, scope, and context.",
    manualOverrideTitle: "Apply Manual Override",
    manualOverrideDescription: "Capture a demo manual override with a reason and visible local feedback.",
    commissionTitle: "Change Commission Plan",
    commissionDescription: "Test a commission input for the current calculation without changing the source commercial contract.",
    whatIfTitle: "Run What-if Scenario",
    whatIfDescription: "Create a local scenario preview for pricing impact analysis.",
    authorizationTitle: "Send For Authorization",
    authorizationDescription: "Send the current final price into the local demo authorization queue.",
    createRuleTitle: "Create Price Rule",
    createRuleDescription: "Draft a local price rule placeholder until the future Pricing Rule Library exists."
  },
  messages: {
    priceCalculated: "Price recalculated in local demo state.",
    manualOverride: "Manual override applied in local demo state.",
    commissionChanged: "Commission scenario captured in local demo state.",
    whatIf: "What-if scenario added in local demo state.",
    authorization: "Price sent for authorization in local demo state.",
    createRule: "Price rule placeholder created in local demo state."
  },
  productHierarchy: {
    supplier: "Supplier",
    consumer: "Consumer",
    catalog: "Catalog",
    serviceGroup: "Service Group",
    serviceProduct: "Service / Product",
    variantRatePlan: "Variant / Rate Plan",
    unitType: "Unit Type"
  },
  unitTypes: {
    legendTitle: "Unit Type Legend",
    seatBased: "Seat-based",
    seatBasedDetail: "Transport seats / tickets (flights, trains, buses)",
    stayBased: "Stay-based",
    stayBasedDetail: "Hotel / accommodation (night-based)",
    slotBased: "Slot-based",
    slotBasedDetail: "Experience slots / time-based activities",
    ticketBased: "Ticket-based",
    ticketBasedDetail: "Attraction / event tickets",
    packageBased: "Package-based",
    packageBasedDetail: "Bundle / package products"
  },
  authorityDetails: {
    close: "Close pricing authority details",
    scopeSummary: "Scope Summary",
    authoritySummary: "Authority Summary",
    paymentTerms: "Payment Terms",
    contractReference: "Contract Reference",
    contractEvidence: "Contract Evidence",
    uploaded: "Uploaded",
    downloadContractDocument: "Download contract document",
    downloadContractDocumentDescription: "This opens a local demo download placeholder for the selected contract evidence. No file is fetched from a backend.",
    linkedPoliciesRules: "Linked Policies & Rules",
    quickActions: "Quick Actions",
    openPricingAuthority: "Open in Pricing Authority",
    viewPolicyWorkspace: "View in Policy Workspace",
    simulateQuote: "Simulate Quote",
    viewRelatedContracts: "View Related Contracts",
    tabs: {
      overview: "Overview",
      pricingTerms: "Pricing & Terms",
      rulesConditions: "Rules & Conditions",
      evidence: "Evidence",
      audit: "Audit"
    }
  },
  vNext: {
    title: "Pricing Authority vNext",
    subtitle: "Define and manage pricing authority at full product depth with contract evidence, rules, and validation.",
    currentProductScopePath: "Current Product Scope Path",
    tabs: {
      authorityMatrix: "Authority Matrix",
      bySupplier: "By Supplier",
      byConsumer: "By Consumer",
      byProduct: "By Product",
      byChannel: "By Channel",
      byCountryCity: "By Country / City",
      byGeography: "By Geography",
      validationCenter: "Validation Center",
      simulation: "Simulation",
      auditTrail: "Audit Trail"
    },
    filters: {
      title: "More Filters",
      description: "These filters update the local demo authority matrix by scope dimensions and validity dates.",
      allSuppliers: "All Suppliers",
      allConsumers: "All Consumers",
      allCatalogs: "All Catalogs",
      allServiceGroups: "All Service Groups",
      allServices: "All Services",
      allVariants: "All Variants",
      allUnitTypes: "All Unit Types",
      moreFilters: "More Filters",
      country: "Country",
      city: "City",
      currency: "Currency",
      channel: "Channel",
      customerSegment: "Customer Segment",
      status: "Status",
      effectiveDate: "Effective Date",
      expiryDate: "Expiry Date",
      allCountries: "All Countries",
      allCities: "All Cities",
      allCurrencies: "All Currencies",
      allChannels: "All Channels",
      allCustomerSegments: "All Customer Segments",
      allStatuses: "All Statuses",
      reset: "Reset",
      apply: "Apply Filters",
      close: "Close filters"
    },
    metrics: {
      activeAuthorities: "Active Authorities",
      allScopes: "Across all scopes",
      valid: "Valid",
      validDetail: "76.6% of total",
      expiredInactive: "Expired / Inactive",
      expiredInactiveDetail: "Within 90 days",
      failedValidation: "Failed Validation",
      failedValidationDetail: "Require attention",
      draft: "Draft",
      draftDetail: "Not yet effective",
      totalSuppliers: "Total Suppliers",
      totalSuppliersDetail: "With pricing authority",
      totalConsumers: "Total Consumers",
      totalConsumersDetail: "With pricing authority"
    },
    table: {
      title: "Pricing Authorities ({{count}})",
      authorityId: "Authority ID",
      authorityType: "Authority Type",
      status: "Status",
      effectiveDate: "Effective Date",
      expiryDate: "Expiry Date",
      actions: "Actions",
      pageSize4: "4 / page",
      pageSize10: "10 / page",
      pageSize20: "20 / page"
    },
    actions: {
      compare: "Compare",
      compareDescription: "Compare opens a local demo placeholder for selected authority comparison. Backend comparison is disabled.",
      newAuthority: "New Pricing Authority",
      clearPath: "Clear Path",
      columnOptions: "Column Options",
      columnOptionsDescription: "Column options are represented as local demo behavior. No table preference is persisted."
    },
    rowActions: {
      view: "View",
      edit: "Edit",
      clone: "Clone",
      viewDetails: "View Details",
      editAuthority: "Edit Authority",
      cloneAuthority: "Clone Authority",
      runValidation: "Run Validation",
      simulateQuote: "Simulate Quote",
      viewRelatedContract: "View Related Contract",
      viewDocuments: "View Documents",
      viewAuditTrail: "View Audit Trail",
      deactivateAuthority: "Deactivate Authority",
      viewAudit: "View Audit Trail"
    },
    bulkActions: {
      selectedCount: "{{count}} selected",
      selectAll: "Select all visible authorities",
      selectRow: "Select authority row",
      runValidationSelected: "Run Validation for Selected",
      exportSelected: "Export Selected",
      compareSelected: "Compare Selected",
      cloneSelected: "Clone Selected",
      deactivateSelected: "Deactivate Selected"
    },
    statuses: {
      active: "Active",
      valid: "Valid",
      expiredInactive: "Expired / Inactive",
      failedValidation: "Failed Validation",
      draft: "Draft"
    },
    authorityTypes: {
      contractBased: "Contract-based",
      policyBased: "Policy-based",
      manualOverride: "Manual override"
    },
    related: {
      title: "Related Intelligence for Current Scope",
      description: "Supplier policies, pricing rules, conflicts, changes, and documents tied to the selected product-depth authority.",
      supplierPolicies: "Related Supplier Policies",
      pricingRules: "Related Pricing Rules",
      conflictAlerts: "Conflict Alerts",
      recentChanges: "Recent Changes",
      contractDocuments: "Contract Documents",
      openPolicies: "Open policy workspace",
      openRules: "Mark rules reviewed",
      reviewConflicts: "Review conflicts",
      openChangeLog: "Open change log",
      openDocuments: "Open documents"
    },
    drawer: {
      tabs: {
        overview: "Overview",
        pricingTerms: "Pricing & Terms",
        rulesConditions: "Rules & Conditions",
        validation: "Validation",
        evidence: "Evidence",
        audit: "Audit"
      },
      overview: {
        authoritySummary: "Authority Summary",
        scopeSummary: "Scope Summary",
        currentFinalPrice: "Current Final Price Example",
        validationStatus: "Validation Status",
        quickActions: "Quick Actions"
      },
      pricing: {
        commissionPricing: "Commission & Pricing",
        paymentTerms: "Payment Terms",
        tierConfiguration: "Tier Configuration",
        currentCommissionAmount: "Current Commission Amount",
        editTerms: "Edit Terms",
        viewCalculations: "View Calculations"
      },
      rules: {
        effectiveRules: "Effective Rules",
        ruleImpact: "Rule Impact",
        viewFullRulesEngine: "View Full Rules Engine"
      },
      validation: {
        validationResults: "Validation Results",
        validationChecks: "Validation Checks",
        contractScope: "Contract scope checks",
        ruleConflicts: "Rule conflict checks",
        warningChecks: "Warning checks",
        runAllValidations: "Run All Validations"
      },
      evidence: {
        contractDocuments: "Contract Documents",
        approvals: "Approvals",
        viewAllEvidence: "View All Evidence"
      },
      audit: {
        actorFilter: "Actor",
        actionFilter: "Action",
        dateFilter: "Date",
        exportLogs: "Export Logs"
      }
    },
    tabContent: {
      authorityMatrix: {
        title: "Pricing Authorities ({{count}})",
        description: "Product-depth authority matrix with filters, scope path, row actions, bulk actions, and related intelligence."
      },
      shared: {
        activeAuthorities: "Active Authorities",
        coverage: "Coverage",
        violations: "Violations",
        marginImpact: "Margin Impact",
        missingExpired: "Missing / Expired",
        ruleCoverage: "Rule Coverage",
        validationStatus: "Validation Status",
        revenueImpact: "Revenue Impact",
        geoRulesImpact: "Geo Rules Impact",
        warnings: "Warnings",
        recommendedActions: "Recommended Actions",
        scenarios: "Scenarios",
        impactPreview: "Impact Preview",
        compareReady: "Compare Ready",
        auditEvents: "Audit Events",
        lastActor: "Last Actor",
        exportable: "Exportable"
      },
      actions: {
        openContractMatrix: "Open Contract Matrix",
        viewSupplierPolicies: "View Supplier Policies",
        simulateQuote: "Simulate Quote",
        viewViolations: "View Violations",
        exportReport: "Export Report",
        createAuthority: "Create Authority",
        openConsumerPreferences: "Open Consumer Preferences",
        openAccessWorkspace: "Open Access Workspace",
        viewMissingAuthorities: "View Missing Authorities",
        openScopeHierarchy: "Open Scope Hierarchy",
        runProductSimulation: "Run Product Simulation",
        openChannelRules: "Open Channel Rules",
        simulateChannelQuote: "Simulate Channel Quote",
        openGeoScope: "Open Scope Hierarchy by Geography",
        viewGeoRules: "View Geo Rules",
        bulkResolveValidations: "Bulk Resolve Validations",
        runValidation: "Run Validation",
        openValidationDetail: "Open Validation Detail",
        viewRecommendedAction: "View Recommended Action",
        createScenario: "Create Scenario",
        runSimulation: "Run Simulation",
        saveScenario: "Save Scenario",
        compareScenarios: "Compare Scenarios",
        exportScenario: "Export Scenario",
        exportLogs: "Export Logs",
        openEntityDetails: "Open Entity Details"
      },
      bySupplier: {
        title: "By Supplier Workspace",
        description: "Supplier-level product tree, consumer coverage matrix, authority health, violations, and supplier actions.",
        selector: "Supplier selector",
        productTree: "Product Tree",
        consumerCoverage: "Consumer Coverage Matrix",
        authorityHealth: "Authority Health"
      },
      byConsumer: {
        title: "By Consumer Workspace",
        description: "Consumer-level supplier coverage, product coverage, missing authority alerts, and margin impact.",
        selector: "Consumer selector",
        topSuppliers: "Top Suppliers",
        productCoverage: "Product Coverage by Catalog",
        alerts: "Missing / Expired Authority Alerts"
      },
      byProduct: {
        title: "By Product Workspace",
        description: "Product hierarchy selector, supplier-consumer-variant coverage grid, authority coverage, validation, and rules.",
        selector: "Product hierarchy selector",
        hierarchySelector: "Product Hierarchy Selector",
        coverageGrid: "Supplier x Consumer x Variant Coverage Grid",
        ruleCoverage: "Rule Coverage"
      },
      byChannel: {
        title: "By Channel Workspace",
        description: "Channel authority health with revenue impact, violations, rule coverage, and channel authority rows.",
        selector: "Channel selector",
        activeByChannel: "Active Authorities by Channel",
        ruleCoverage: "Channel Rule Coverage",
        authorityTable: "Channel Authority Table"
      },
      byGeography: {
        title: "By Geography Workspace",
        description: "Country and city authority coverage with geography-specific health, top cities, and geo rule impact.",
        selector: "Country / city selector",
        countryCityCoverage: "Country / City Coverage",
        topCities: "Top Cities Table",
        geoRulesImpact: "Geo Rules Impact"
      },
      validationCenter: {
        title: "Validation Center Workspace",
        description: "Failed validations, warnings, type and severity filters, recommended actions, and bulk resolution.",
        selector: "Validation filter",
        failedValidations: "Failed Validations",
        recommendedActions: "Recommended Actions",
        filters: "Severity / Type Filters"
      },
      simulation: {
        title: "Simulation Workspace",
        description: "Scenario list, scenario builder, what-if changes, impact preview, scenario comparison, and saved scenarios.",
        selector: "Scenario selector",
        scenarioList: "Scenario List",
        scenarioBuilder: "Scenario Builder",
        whatIfChanges: "What-if Changes"
      },
      auditTrail: {
        title: "Audit Trail Workspace",
        description: "Full audit log with actor, action, date, and entity filters plus entity details and change history.",
        selector: "Audit entity selector",
        auditTable: "Full Audit Table",
        filters: "Audit Filters",
        changeHistory: "Change History"
      }
    },
    modals: {
      fields: {
        authorityId: "Authority ID",
        status: "Status",
        effectiveDate: "Effective Date",
        expiryDate: "Expiry Date",
        commission: "Commission",
        minSellPrice: "Min Sell Price",
        maxSellPrice: "Max Sell Price",
        paymentTerms: "Payment Terms",
        policyMode: "Policy Mode",
        linkedContract: "Linked Contract",
        includeEvidence: "Include evidence",
        newAuthorityId: "New Authority ID",
        includeDocuments: "Include documents",
        includeRules: "Include rules",
        includeValidationSnapshot: "Include validation snapshot",
        checkIn: "Check-in / Start",
        checkOut: "Check-out / End",
        quantity: "Guests / Passengers / Quantity",
        channel: "Channel / Source",
        currency: "Currency",
        selectedValidations: "Selected validations",
        selectedAuthorities: "Selected authorities",
        validationType: "Validation type",
        resolutionAction: "Resolution action",
        comparisonType: "Comparison type",
        markReviewed: "Mark reviewed",
        requestContractUpdate: "Request contract update",
        notes: "Notes",
        scenarioName: "Scenario name",
        description: "Description",
        changeType: "Change type",
        newValue: "New commission / rule / discount",
        effectiveFrom: "Effective from",
        reason: "Reason",
        openContract: "Open contract",
        downloadDemo: "Download demo",
        csv: "CSV",
        pdf: "PDF",
        xlsx: "XLSX"
      },
      calculate: {
        title: "Calculate / Recalculate Price",
        description: "Run the local demo calculation against the selected authority scope."
      },
      manualOverride: {
        title: "Apply Manual Override",
        description: "Capture a local override with selected authority context."
      },
      commission: {
        title: "Change Commission Plan",
        description: "Preview a commission change without changing backend contract data."
      },
      whatIf: {
        title: "Run What-if Scenario",
        description: "Create a local what-if pricing scenario for the selected authority."
      },
      authorization: {
        title: "Send For Authorization",
        description: "Queue a local authorization event for this selected authority."
      },
      createRule: {
        title: "Create Price Rule",
        description: "Create a local pricing rule placeholder for this scope."
      },
      editAuthority: {
        title: "Edit Authority",
        description: "Edit status, dates, commission, sell boundaries, and payment terms locally."
      },
      cloneAuthority: {
        title: "Clone Authority",
        description: "Clone the selected authority into a local draft authority."
      },
      simulateQuote: {
        title: "Simulate Quote",
        description: "Run a local quote simulation with date, quantity, channel, and currency inputs."
      },
      runValidationSelected: {
        title: "Run Validation for Selected",
        description: "Run contract, scope, pricing-boundary, rule-conflict, or evidence validation locally."
      },
      bulkResolveValidations: {
        title: "Bulk Resolve Validations",
        description: "Resolve selected validation findings in local demo state."
      },
      createSimulationScenario: {
        title: "Create Simulation Scenario",
        description: "Save and run a reusable local what-if scenario."
      },
      viewRelatedContracts: {
        title: "View Related Contracts",
        description: "Review related commercial contracts for the selected authority."
      },
      deactivateAuthority: {
        title: "Deactivate Authority",
        description: "Confirm local deactivation for the selected authority scope.",
        confirmation: "Deactivate selected authority?",
        warning: "This updates only local demo state and does not deactivate a backend authority."
      },
      export: {
        title: "Export Pricing Authorities",
        description: "Choose CSV, PDF, or XLSX for a local export placeholder."
      },
      compare: {
        title: "Compare Authorities",
        description: "Compare selected authority rows in local demo state."
      },
      newAuthority: {
        title: "New Pricing Authority",
        description: "Create a local draft authority with product-depth fields."
      },
      viewDocuments: {
        title: "View Documents",
        description: "Review contract evidence documents for this authority."
      },
      validationDetail: {
        title: "Validation Detail",
        description: "Inspect failed validations and recommended resolution context."
      },
      relatedList: {
        title: "Related Intelligence",
        description: "Review scoped policies, pricing rules, conflicts, changes, or documents for this authority."
      },
      entityDetails: {
        title: "Authority Entity Details",
        description: "Inspect the selected authority entity and its product-depth scope."
      }
    },
    scaffold: {
      title: "Product-depth authority grouping",
      description: "This tab is scaffolded with the same authority rows grouped by the selected product-depth filters. Full analytics remain demo-only."
    },
    bottomCards: {
      validationSummary: "Validation Summary",
      goToValidationCenter: "Go to Validation Center",
      failedValidations: "Failed Validations",
      openFailedValidations: "View all failed validations",
      recentChanges: "Recent Changes",
      openRecentChanges: "View all changes",
      conflictsAlerts: "Conflicts & Alerts",
      goToConflictCenter: "Go to Conflict Center",
      modalDescription: "This opens a complete local demo list/action placeholder for the selected authority scope. No backend workflow is called."
    },
    failures: {
      minMaxSellViolation: "Min/Max Sell Price Violation",
      commissionLimit: "Commission Over Limit",
      currencyMismatch: "Currency Mismatch",
      missingContractReference: "Missing Contract Reference"
    },
    conflicts: {
      minSellViolation: "Min Sell Price Violation",
      policyConflict: "Contract vs Policy Conflict",
      overlappingAuthority: "Overlapping Authority",
      commissionRuleConflict: "Commission Rule Conflict"
    },
    messages: {
      filtersApplied: "Filters applied in local demo state.",
      filtersReset: "More filters reset in local demo state.",
      pathCleared: "Product path filters cleared in local demo state.",
      authorityOpened: "Selected authority context opened in local demo state.",
      validationCenterOpened: "Validation Center tab opened for the current local scope.",
      workspaceSelectionUpdated: "Workspace selector updated in local demo state.",
      validationRun: "Validation run completed in local demo state.",
      bulkValidationRun: "Validation run completed for selected authorities.",
      pricingRulesOpened: "Pricing rule context marked reviewed in local demo state.",
      conflictsOpened: "Conflict context opened in Validation Center.",
      rulesContextOpened: "Rules context opened in local demo state.",
      authorityEdited: "Authority edited in local demo state.",
      authorityCloned: "Authority cloned as a local draft.",
      quoteSimulated: "Quote simulation completed in local demo state.",
      validationsResolved: "Validations resolved in local demo state.",
      relatedContractsOpened: "Related contracts reviewed in local demo state.",
      authorityDeactivated: "Authority deactivated in local demo state.",
      exportPrepared: "Export prepared as a local demo placeholder.",
      compareOpened: "Authority comparison opened in local demo state.",
      newAuthorityCreated: "New draft authority created in local demo state.",
      documentsOpened: "Contract documents opened in local demo state.",
      validationDetailOpened: "Validation detail opened in local demo state.",
      relatedListOpened: "Related intelligence list opened in local demo state.",
      entityDetailsOpened: "Authority entity details opened in local demo state.",
      scenarioSaved: "Scenario saved in local demo state.",
      columnOptionsReviewed: "Column options reviewed in local demo state."
    }
  }
} as const;
