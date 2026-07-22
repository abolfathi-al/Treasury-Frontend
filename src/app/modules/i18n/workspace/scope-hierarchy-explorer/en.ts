export const scopeHierarchyExplorerWorkspaceEn = {
  title: "Scope Hierarchy Explorer",
  navTitle: "Scope Hierarchy Explorer",
  breadcrumb: "Scope Hierarchy Explorer",
  helperText: "Explore the workspace product hierarchy. Select any node to view product context, separated scope dimensions, impact, and related resources.",
  actions: {
    howItWorks: "How it works",
    export: "Export",
    share: "Share",
    compareScope: "Compare Scope",
    createScope: "Create Scope",
    editScope: "Edit Scope",
    cloneScope: "Clone Scope",
    moveScope: "Move Scope",
    importScope: "Import Scope",
    bulkUpload: "Bulk Upload",
    exportScope: "Export Scope",
    runValidation: "Run Validation",
    more: "More",
    coverageAnalysis: "Coverage Analysis",
    dependencyAnalysis: "Dependency Analysis",
    validationCenter: "Validation Center",
    governanceDashboard: "Governance Dashboard",
    simulationCenter: "Simulation Center",
    validateScope: "Validate Scope",
    resolutionCenter: "Resolution Center",
    investigation: "Investigation",
    publishScope: "Publish Scope",
    restoreScope: "Restore Scope",
    auditDetails: "Audit Details",
    deleteNode: "Delete Scope",
    localActionComplete: "Local demo action completed for the selected scope.",
    viewAllChildren: "View all children",
    viewAllGrants: "View all grants",
    viewAllPricingRules: "View all pricing rules",
    viewAllVisibilityRules: "View all visibility rules"
  },
  share: {
    title: "Share scope context",
    description: "Share selected node context locally without creating a backend link.",
    selectedNode: "Selected node",
    shareLink: "Share link",
    target: "Share target",
    permission: "Permission",
    expiryLabel: "Expiry",
    note: "Note",
    copyLink: "Copy share link",
    copyNodeId: "Copy node ID",
    copiedLink: "Share link captured in local state.",
    copiedNodeId: "Node ID captured in local state.",
    result: "Share link prepared locally for the selected scope.",
    auditTitle: "Scope share prepared",
    auditDescription: "A local share event was added for {{node}}.",
    targets: {
      copyInternalLink: "Copy internal link",
      workspaceRole: "Share with workspace role",
      user: "Share with user"
    },
    permissions: {
      viewOnly: "View only",
      review: "Review"
    },
    expiry: {
      none: "No expiry",
      sevenDays: "7 days",
      customDate: "Custom date"
    }
  },
  export: {
    auditTitle: "Scope export prepared",
    auditDescription: "A local export event was added for {{node}}.",
    scope: {
      title: "Export Scope",
      currentFilteredNodes: "Current filtered nodes",
      selectedNodes: "Selected nodes only",
      selectedNodeSubtree: "Current selected node subtree",
      fullDemoHierarchy: "Full demo hierarchy",
      currentTabWorkspace: "Current tab workspace"
    },
    format: {
      title: "Format",
      csv: "CSV",
      xlsx: "XLSX",
      pdfSummary: "PDF summary",
      jsonHierarchy: "JSON hierarchy"
    },
    include: {
      title: "Include Options",
      nodeMetadata: "Node metadata",
      productHierarchyPath: "Product hierarchy path",
      scopeDimensions: "Scope dimensions",
      relatedGrants: "Related grants",
      relatedCommercialContracts: "Related commercial contracts",
      relatedPricingRules: "Related pricing rules",
      accessDecisions: "Access decisions",
      validationResults: "Validation results",
      auditSummary: "Audit summary"
    }
  },
  compare: {
    firstNode: "First node",
    secondNode: "Second node",
    samePath: "Same hierarchy path",
    sameDimensions: "Same dimensions",
    noMissingVariants: "No missing variant differences",
    modes: {
      hierarchyPath: "Hierarchy path",
      dimensions: "Dimensions",
      relatedAccess: "Related access",
      relatedCommercial: "Related commercial",
      validation: "Validation"
    },
    differences: {
      path: "Path differences",
      missingVariants: "Missing variants / rate plans",
      dimensions: "Dimension differences",
      coverage: "Contract/rule coverage differences"
    }
  },
  vNext: {
    title: "Scope Hierarchy Explorer vNext",
    subtitle: "Explore the full scope hierarchy across suppliers, catalogs, services, variants, and unit types.",
    graphSubtitle: "Workspace -> Supplier -> Catalog -> Service Group -> Service / Product -> Variant / Rate Plan -> Unit Type",
    currentScopePath: "Hierarchy Path (Current Scope)",
    exportDescription: "Export opens a scoped local flow with selected node context. No backend export job or real access state is used.",
    shareDescription: "Share opens an in-page selected-node panel. No backend share link is created.",
    filtersDescription: "More filters are scaffolded as local demo behavior. Country, city, currency, channel, language, and customer segment filters already update the graph and tree locally.",
    demoActionDescription: "This is a local demo action with selected-node context only. It does not call backend APIs.",
    quickActions: {
      viewRelatedContracts: "View Related Contracts",
      openPricingAuthority: "Open in Pricing Authority",
      viewRelatedPolicies: "View Related Policies",
      simulateQuote: "Simulate Quote",
      simulateQuoteDescription: "Quote simulation opens a scoped local flow because no Quote Simulator route or backend integration is enabled for this task.",
      demoDescription: "This quick action keeps the selected node context in local demo state only."
    }
  },
  tabs: {
    hierarchyExplorer: "Hierarchy Explorer",
    bySupplier: "By Supplier",
    byProduct: "By Product",
    byGeography: "By Geography",
    byChannel: "By Channel",
    accessCoverage: "Access Coverage",
    commercialCoverage: "Commercial Coverage",
    scopeValidation: "Scope Validation",
    auditTrail: "Audit Trail"
  },
  blueprints: {
    filters: "Filters",
    columns: "Columns",
    railActions: "Intelligence Rail Actions",
    search: "Search",
    moreFilters: "More Filters",
    moreFiltersDescription: "Apply tab-specific filters without changing the approved workspace layout.",
    applyFilters: "Apply Filters",
    columnSearchPlaceholder: "Search columns...",
    columnsDescription: "Choose the visible columns for this workspace tab.",
    applyColumns: "Apply Columns",
    listView: "List View",
    gridView: "Grid View",
    filterLabels: {
      supplier: "Supplier",
      region: "Region",
      country: "Country",
      type: "Type",
      status: "Status",
      coverage: "Coverage",
      catalog: "Catalog",
      serviceGroup: "Service Group",
      productType: "Product Type",
      language: "Language",
      currency: "Currency",
      channel: "Channel",
      channelType: "Channel Type",
      organization: "Organization",
      team: "Team",
      role: "Role",
      grant: "Grant",
      scopeType: "Scope Type",
      contract: "Contract",
      pricingAuthority: "Pricing Authority",
      program: "Program",
      issueType: "Issue Type",
      severity: "Severity",
      product: "Product",
      domain: "Domain",
      dateRange: "Date Range",
      eventType: "Event Type",
      actor: "Actor",
      riskLevel: "Risk Level"
    },
    columnLabels: {
      name: "Name",
      nodeType: "Node Type",
      id: "ID",
      unitType: "Unit Type",
      status: "Status",
      scopeDimensions: "Scope Dimensions",
      actions: "Actions",
      supplier: "Supplier",
      scopeCount: "Scope Count",
      catalogs: "Catalogs",
      products: "Products",
      variants: "Variants",
      unitTypes: "Unit Types",
      coverage: "Coverage",
      product: "Product",
      catalog: "Catalog",
      serviceGroup: "Service Group",
      country: "Country",
      region: "Region",
      validation: "Validation",
      lastUpdated: "Last Updated",
      channel: "Channel",
      type: "Type",
      scopes: "Scopes",
      consumers: "Consumers",
      roles: "Roles",
      teams: "Teams",
      organizations: "Organizations",
      grants: "Grants",
      permissions: "Permissions",
      contracts: "Contracts",
      pricingAuthorities: "Pricing Authorities",
      programs: "Programs",
      annualRevenue: "Annual Revenue",
      commercialScore: "Commercial Score",
      gaps: "Gaps",
      issue: "Issue",
      severity: "Severity",
      owner: "Owner",
      lastDetected: "Last Detected",
      impact: "Impact",
      recommendedAction: "Recommended Action",
      eventId: "Event ID",
      timestamp: "Timestamp",
      domain: "Domain",
      event: "Event",
      actor: "Actor",
      result: "Result"
    },
    railActionLabels: {
      viewRelatedContracts: "View Related Contracts",
      openPricingAuthority: "Open Pricing Authority",
      viewRelatedPolicies: "View Related Policies",
      simulateQuote: "Simulate Quote",
      createScope: "Create Scope",
      openSupplier: "Open Supplier",
      runSimulation: "Run Simulation",
      validateScope: "Validate Scope",
      exportSupplierScope: "Export Supplier Scope",
      createVariant: "Create Variant",
      validateProduct: "Validate Product",
      runProductSimulation: "Run Product Simulation",
      exportProductScope: "Export Product Scope",
      createMarket: "Create Market",
      runGeographySimulation: "Run Geography Simulation",
      validateGeography: "Validate Geography",
      exportMarketCoverage: "Export Market Coverage",
      createChannelMapping: "Create Channel Mapping",
      runChannelSimulation: "Run Channel Simulation",
      validateChannelCoverage: "Validate Channel Coverage",
      exportChannelScope: "Export Channel Scope",
      openGrantBuilder: "Open Grant Builder",
      runAccessSimulation: "Run Access Simulation",
      validateCoverage: "Validate Coverage",
      exportCoverageReport: "Export Coverage Report",
      createContract: "Create Contract",
      assignPricingAuthority: "Assign Pricing Authority",
      assignProgram: "Assign Program",
      runCommercialSimulation: "Run Commercial Simulation",
      validateCommercialCoverage: "Validate Commercial Coverage",
      runFullValidation: "Run Full Validation",
      openResolutionCenter: "Open Resolution Center",
      validateSpecificScope: "Validate Specific Scope",
      exportValidationReport: "Export Validation Report",
      openInvestigation: "Open Investigation",
      exportAuditReport: "Export Audit Report",
      viewVersionHistory: "View Version History",
      compareVersions: "Compare Versions",
      runGovernanceReview: "Run Governance Review"
    },
    searchPlaceholders: {
      hierarchyExplorer: "Search hierarchy nodes...",
      bySupplier: "Search suppliers, catalogs, or scope paths...",
      byProduct: "Search products, variants, or unit types...",
      byGeography: "Search countries, regions, or markets...",
      byChannel: "Search channels, mappings, or coverage...",
      accessCoverage: "Search roles, grants, teams, or permissions...",
      commercialCoverage: "Search contracts, pricing authorities, or programs...",
      scopeValidation: "Search validation issues, owners, or impacted scopes...",
      auditTrail: "Search audit events, actors, or domains..."
    }
  },
  charts: {
    title: "D3 Analytics",
    healthScore: "Scope Health Score"
  },
  emptyStates: {
    hierarchyExplorer: "No hierarchy scopes match the current filters.",
    bySupplier: "No supplier scope coverage matches the current filters.",
    byProduct: "No product scope coverage matches the current filters.",
    byGeography: "No geography scope coverage matches the current filters.",
    byChannel: "No channel scope coverage matches the current filters.",
    accessCoverage: "No access coverage records match the current filters.",
    commercialCoverage: "No commercial coverage records match the current filters.",
    scopeValidation: "No scope validation issues match the current filters.",
    auditTrail: "No audit events match the current filters."
  },
  kpis: {
    activeNodes: "Active Nodes",
    activeNodesDetail: "Across current scope",
    suppliers: "Suppliers",
    suppliersDetail: "With scope coverage",
    contracts: "Contracts",
    contractsDetail: "Linked commercially",
    violations: "Violations",
    violationsDetail: "Require review",
    catalogs: "Catalogs",
    catalogsDetail: "Under supplier",
    serviceGroups: "Service Groups",
    serviceGroupsDetail: "Grouped offers",
    products: "Products",
    productsDetail: "Services / products",
    variants: "Variants",
    variantsDetail: "Rate plans",
    unitTypes: "Unit Types",
    unitTypesDetail: "Commercial units",
    rules: "Rules",
    rulesDetail: "Pricing and policy rules",
    consumers: "Consumers",
    consumersDetail: "Covered consumers",
    activeContracts: "Active Contracts",
    activeContractsDetail: "Current commercial coverage",
    grants: "Grants",
    grantsDetail: "Scoped grants",
    permissions: "Permissions",
    permissionsDetail: "Effective permissions",
    accessDecisions: "Access Decisions",
    accessDecisionsDetail: "Evaluated decisions",
    pricingAuthorities: "Pricing Authorities",
    pricingAuthoritiesDetail: "Authority rows",
    pricingRules: "Pricing Rules",
    pricingRulesDetail: "Linked pricing rules",
    supplierPolicies: "Supplier Policies",
    supplierPoliciesDetail: "Policy links",
    orphanNodes: "Orphan Nodes",
    orphanNodesDetail: "No parent issues",
    brokenPaths: "Broken Paths",
    brokenPathsDetail: "Path integrity",
    missingVariants: "Missing Variants",
    missingVariantsDetail: "Validation warnings",
    missingUnitTypes: "Missing Unit Types",
    missingUnitTypesDetail: "Validation warnings",
    unusedScopes: "Unused Scopes",
    unusedScopesDetail: "Informational",
    auditEvents: "Audit Events",
    auditEventsDetail: "Local history",
    actors: "Actors",
    actorsDetail: "Recent actors",
    scopeChanges: "Scope Changes",
    scopeChangesDetail: "Tracked locally",
    exports: "Exports",
    exportsDetail: "Demo export events"
  },
  tabContent: {
    hierarchyExplorer: {
      title: "Hierarchy Explorer",
      description: "Graph and tree views of the product-depth hierarchy."
    },
    bySupplier: {
      title: "Supplier Workspace",
      description: "Supplier-centric hierarchy, coverage, health, and actions."
    },
    byProduct: {
      title: "Product Workspace",
      description: "Product hierarchy selector and supplier-consumer-variant coverage."
    },
    byGeography: {
      title: "Geography Workspace",
      description: "Country and city scope coverage with geography-specific actions."
    },
    byChannel: {
      title: "Channel Workspace",
      description: "B2B, B2C, Marketplace, and API coverage by scope."
    },
    accessCoverage: {
      title: "Access Coverage",
      description: "Grants, permissions, decisions, consumers, and suppliers for the selected scope."
    },
    commercialCoverage: {
      title: "Commercial Coverage",
      description: "Contracts, pricing authorities, pricing rules, and supplier policy coverage."
    },
    scopeValidation: {
      title: "Scope Validation",
      description: "Orphans, broken paths, missing variants, missing unit types, and unused scopes."
    },
    auditTrail: {
      title: "Audit Trail",
      description: "Filtered change history for hierarchy and scope operations."
    },
    sections: {
      supplierTree: "Supplier Tree",
      coverage: "Coverage",
      productHierarchySelector: "Product Hierarchy Selector",
      coverageGrid: "Coverage Grid",
      selectors: "Selectors",
      coverageSummary: "Coverage Summary",
      channels: "Channels",
      channelCoverage: "Channel Coverage",
      relatedAccess: "Related Access",
      coverageMatrix: "Coverage Matrix",
      relatedCommercial: "Related Commercial",
      validationBuckets: "Validation Buckets",
      auditFilters: "Audit Filters",
      auditTable: "Audit Table"
    },
    actions: {
      openContractMatrix: "Open Contract Matrix",
      viewPolicies: "View Policies",
      simulateQuote: "Simulate Quote",
      viewViolations: "View Violations",
      exportReport: "Export Report",
      createScope: "Create Scope",
      openPricingAuthority: "Open Pricing Authority",
      simulateProduct: "Simulate Product",
      openScopeRules: "Open Scope Rules",
      simulateGeography: "Simulate Geography",
      openChannelRules: "Open Channel Rules",
      simulateChannel: "Simulate Channel",
      openAccessWorkspace: "Open Access Workspace",
      openEffectiveAccess: "Open Effective Access",
      validateScope: "Validate Scope",
      exportValidation: "Export Validation",
      resolveValidation: "Resolve Validation",
      exportLogs: "Export Logs",
      viewProductCoverage: "View Product Coverage",
      viewAccessDecisions: "View Access Decisions",
      viewPricingRules: "View Pricing Rules",
      bulkResolve: "Bulk Resolve",
      viewRecommendedAction: "View Recommended Action",
      viewEntityDetails: "View Entity Details"
    }
  },
  productHierarchy: {
    organizationWorkspace: "Organization / Workspace",
    suppliers: "Suppliers",
    catalogs: "Catalogs",
    serviceGroups: "Service Groups",
    servicesProducts: "Services / Products",
    variantsRatePlans: "Variants / Rate Plans",
    unitType: "Unit Type"
  },
  unitTypes: {
    seatBased: "Seat-based",
    stayBased: "Stay-based",
    slotBased: "Slot-based",
    ticketBased: "Ticket-based",
    packageBased: "Package-based"
  },
  nodeTypes: {
    organizationWorkspace: "Organization / Workspace",
    supplierGroup: "Supplier Group",
    supplier: "Supplier",
    catalogGroup: "Catalog Group",
    catalog: "Catalog",
    serviceGroupContainer: "Service Group Container",
    serviceGroup: "Service Group",
    serviceProductContainer: "Service / Product Container",
    serviceProduct: "Service / Product",
    variantRatePlanContainer: "Variant / Rate Plan Container",
    variantRatePlan: "Variant / Rate Plan",
    unitType: "Unit Type"
  },
  dimensions: {
    title: "Scope Dimensions",
    country: "Country",
    city: "City",
    currency: "Currency",
    channel: "Channel",
    language: "Language",
    customerSegment: "Customer Segment",
    countries: "Countries",
    cities: "Cities",
    currencies: "Currencies",
    channels: "Channels",
    languages: "Languages",
    customerSegments: "Customer Segments"
  },
  filters: {
    all: "All",
    yes: "Yes",
    no: "No",
    allCountries: "Country: All",
    allCities: "City: All",
    allCurrencies: "Currency: All",
    allChannels: "Channel: All",
    allLanguages: "Language: All",
    allCustomerSegments: "Customer Segment: All",
    clearAll: "Clear All",
    reset: "Reset filters",
    fields: {
      nodeType: "Node Type",
      unitType: "Unit Type",
      status: "Status",
      country: "Country",
      city: "City",
      currency: "Currency",
      channel: "Channel",
      language: "Language",
      customerSegment: "Customer Segment",
      hasContracts: "Has contracts",
      hasPricingAuthority: "Has pricing authority",
      hasAccessDecisions: "Has access decisions",
      validationStatus: "Validation status"
    }
  },
  summary: {
    totalNodes: "Total Nodes",
    totalNodesDetail: "Across all levels",
    leafNodes: "Leaf Nodes",
    leafNodesDetail: "69% of total",
    activeGrants: "Active Grants",
    activeGrantsDetail: "Using selected scopes",
    pricingRules: "Pricing Rules",
    pricingRulesDetail: "Using selected scopes",
    visibilityRules: "Visibility Rules",
    visibilityRulesDetail: "Using selected scopes",
    lastUpdated: "Last Updated",
    lastUpdatedDetail: "10:15 AM"
  },
  graph: {
    title: "Hierarchy Explorer",
    mode: "Hierarchy display mode",
    treeView: "Tree View",
    graphView: "Graph View",
    searchPlaceholder: "Search by node name, ID, or type...",
    submitSearch: "Search hierarchy",
    clearSearch: "Clear search",
    searchSummary: "{{count}} local node matches for \"{{query}}\"",
    emptyTitle: "No matching nodes",
    emptyText: "Clear search or try another supplier, catalog, service, variant, unit type, or dimension.",
    filters: "Filters",
    miniMap: "Mini-map",
    controls: {
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      fitToView: "Fit to view",
      resetView: "Reset view",
      lockNodes: "Lock node dragging",
      unlockNodes: "Unlock node dragging",
      showLegend: "Show legend",
      hideLegend: "Hide legend",
      showMiniMap: "Show mini-map",
      hideMiniMap: "Hide mini-map",
      expand: "Expand graph",
      collapse: "Collapse graph"
    },
    legend: {
      title: "Scope Levels",
      expand: "Expand scope level legend",
      collapse: "Collapse scope level legend",
      level0: "Workspace",
      level1: "Supplier",
      level2: "Catalog",
      level3: "Service Group",
      level4: "Service / Product",
      level5: "Variant / Rate Plan",
      level6: "Unit Type",
      level7: "Level 7 Services / Products Container",
      level8: "Level 8 Services / Products",
      level9: "Level 9 Variants / Rate Plans Container",
      level10: "Level 10 Variants / Rate Plans",
      level11: "Level 11 Unit Type"
    }
  },
  tree: {
    title: "Primary Hierarchy Tree",
    searchPlaceholder: "Search in hierarchy..."
  },
  details: {
    nodeType: "Node Type",
    scopeLevel: "Scope Level",
    children: "Children",
    parent: "Parent",
    path: "Path",
    inheritance: "Inheritance",
    unitType: "Unit Type",
    catalog: "Catalog",
    serviceGroup: "Service Group",
    serviceProduct: "Service / Product",
    variantRatePlan: "Variant / Rate Plan",
    scopeDimensions: "Scope Dimensions"
  },
  nodeDetails: {
    title: "Selected Node Details",
    overview: "Overview",
    dimensions: "Dimensions",
    metadata: "Metadata",
    relatedAccess: "Related Access",
    relatedCommercial: "Related Commercial",
    validation: "Validation",
    audit: "Audit",
    name: "Name",
    displayId: "Display ID",
    id: "ID",
    nodeType: "Node Type",
    status: "Status",
    fullPath: "Full Path",
    parent: "Parent",
    children: "Children",
    catalog: "Catalog",
    serviceGroup: "Service Group",
    serviceProduct: "Service / Product",
    variantRatePlan: "Variant / Rate Plan",
    unitType: "Unit Type",
    description: "Description",
    createdAt: "Created At",
    lastUpdated: "Last Updated",
    scopeDimensions: "Scope Dimensions (Applied to this node)",
    quickActions: "Quick Actions",
    auditEvents: {
      nodeSelected: {
        title: "Node context selected",
        description: "{{node}} is selected for local scope review."
      },
      dimensionsReviewed: {
        title: "Scope dimensions reviewed",
        description: "Country, city, currency, channel, language, and segment dimensions are stored as metadata for {{node}}."
      },
      pricingContext: {
        title: "Pricing context linked",
        description: "{{type}} context is available for Pricing Authority and related contract demo actions."
      }
    }
  },
  parentChain: {
    title: "4. Parent Chain"
  },
  usage: {
    title: "9. Usage Statistics",
    directGrants: "Direct Grants",
    inheritedGrants: "Inherited Grants",
    pricingRules: "Pricing Rules",
    visibilityRules: "Visibility Rules",
    supplierPolicies: "Supplier Policies",
    usersImpacted: "Users Impacted",
    workspacesImpacted: "Workspaces Impacted"
  },
  resources: {
    childResources: "5. Child Resources ({{count}})",
    relatedGrants: "6. Related Grants ({{count}})",
    relatedPricingRules: "7. Related Pricing Rules ({{count}})",
    visibilityRules: "8. Visibility Rules ({{count}})"
  },
  relatedTabs: {
    childNodes: "Child Nodes",
    relatedGrants: "Related Grants",
    relatedSupplierPolicies: "Related Supplier Policies",
    relatedCommercialContracts: "Related Commercial Contracts",
    relatedPricingRules: "Related Pricing Rules",
    relatedAccessDecisions: "Related Access Decisions"
  },
  related: {
    title: "Related Intelligence",
    description: "Scope-based intelligence cards for the selected node; drawer tabs hold the detailed drill-downs.",
    relatedGrants: "Related Grants",
    relatedSupplierPolicies: "Related Supplier Policies",
    relatedCommercialContracts: "Related Commercial Contracts",
    relatedPricingRules: "Related Pricing Rules",
    relatedAccessDecisions: "Related Access Decisions",
    conflictAlerts: "Conflict Alerts",
    actions: {
      openGrants: "Open all grants",
      openPolicies: "Open all policies",
      openContracts: "Open all contracts",
      openRules: "Open all rules",
      openDecisions: "Open all decisions",
      openAlerts: "Open all alerts"
    }
  },
  relatedResources: {
    title: "Node Details / Related Resources",
    emptyTitle: "No related rows for this node",
    emptyText: "Select a parent node or switch tabs to review related demo resources.",
    fullListDescription: "This opens a complete local child-node flow for the selected node. Backend-backed full-list pagination is not enabled in this demo."
  },
  relatedWorkspaces: {
    scopeHierarchy: "Scope Hierarchy Explorer",
    grantBuilder: "Grant Builder",
    supplierPolicies: "Supplier Policy Management",
    commercialContracts: "Commercial Contract Matrix",
    pricingAuthority: "Pricing Authority",
    accessWorkspace: "Access Workspace"
  },
  rowActions: {
    view: "View",
    openWorkspace: "Open Workspace",
    viewDetails: "View Details",
    openRelatedWorkspace: "Open Related Workspace",
    copyId: "Copy ID",
    viewAudit: "View Audit Trail",
    exportScope: "Export Scope",
    compareScope: "Compare Scope",
    validateScope: "Validate Scope",
    deleteNode: "Delete Node"
  },
  bulk: {
    selectedCount: "{{count}} selected",
    noSelection: "Select at least one node before running bulk actions.",
    compareRequiresTwo: "Compare Selected requires exactly two selected nodes.",
    exportSelected: "Export Selected",
    compareSelected: "Compare Selected",
    validateSelected: "Validate Selected",
    deleteSelected: "Delete Selected"
  },
  relatedActions: {
    title: "Related Resource Action",
    contextAware: "Context-aware demo action",
    demoBody: "This local demo action includes the selected hierarchy node and related row context. It does not call backend APIs or persist real access state.",
    selectedNode: "Selected Node",
    relatedRow: "Related Row",
    targetWorkspace: "Target Workspace",
    scopePath: "Scope Path",
    detailsOpened: "Selected node details opened in the right panel.",
    copiedId: "Node ID copied into local demo state.",
    auditOpened: "Audit tab opened for the selected related node."
  },
  flow: {
    currentScope: "Current Scope",
    stepsTitle: "Flow Steps",
    detailsTitle: "Flow Details",
    resultTitle: "Local Flow Result",
    backendDisabled: "Backend integration is disabled for this velora-shell flow.",
    close: "Close",
    status: {
      ready: "Ready",
      inProgress: "In progress",
      pending: "Pending",
      complete: "Complete"
    },
    context: {
      node: "Selected Node",
      path: "Full Path",
      unitType: "Unit Type",
      dimensions: "Scope Dimensions"
    },
    export: {
      title: "Export Scope Package",
      description: "Review selected hierarchy context, included dimensions, and export payload before generating a local package.",
      primaryAction: "Generate Local Export",
      result: "Local export package prepared with hierarchy path, scope dimensions, related rows, and audit context.",
      rows: {
        scopePath: "Scope Path",
        format: "Formats",
        records: "Visible Records"
      },
      steps: {
        context: {
          title: "Resolve selected scope",
          description: "Uses the selected node and full product-depth path."
        },
        review: {
          title: "Review export payload",
          description: "Includes hierarchy fields, dimensions, related resources, and audit markers."
        },
        result: {
          title: "Prepare package",
          description: "Creates a local export summary without calling backend jobs."
        }
      }
    },
    filters: {
      title: "Advanced Scope Filters",
      description: "Review the active dimension filters and how they narrow graph, tree, and related resources locally.",
      primaryAction: "Apply Local Filters",
      result: "Local filters applied to visible graph and tree data. No backend query was executed.",
      steps: {
        context: {
          title: "Read filter state",
          description: "Uses country, city, currency, channel, language, and customer segment filters."
        },
        review: {
          title: "Preview visible scope",
          description: "Shows the selected dimension values before applying them to the local hierarchy."
        },
        result: {
          title: "Apply locally",
          description: "Updates local graph and tree visibility using the current filter state."
        }
      }
    },
    children: {
      title: "Child Node Drill-down",
      description: "Inspect the selected node child list with node IDs, node types, and unit-type context.",
      primaryAction: "Open Local Child List",
      result: "Child-node list prepared from local hierarchy data with selected scope context preserved.",
      steps: {
        context: {
          title: "Resolve parent node",
          description: "Uses the selected node as the parent for child-node discovery."
        },
        review: {
          title: "List children",
          description: "Displays child nodes, node types, IDs, dimensions, and unit-type hints."
        },
        result: {
          title: "Keep context",
          description: "Preserves selected scope for follow-up row actions."
        }
      }
    },
    quote: {
      title: "Quote Simulation Context",
      description: "Build a quote simulation handoff from selected product-depth scope and unit type.",
      primaryAction: "Prepare Quote Context",
      result: "Quote context prepared locally with supplier, catalog, service, variant, unit type, and dimensions.",
      rows: {
        scope: "Simulation Scope",
        unitType: "Commercial Unit",
        contractContext: "Contract Context"
      },
      steps: {
        context: {
          title: "Read commercial scope",
          description: "Uses supplier, catalog, service group, service/product, variant, and unit type."
        },
        review: {
          title: "Check quote inputs",
          description: "Confirms dimensions and commercial terms needed by a future Quote Simulator."
        },
        result: {
          title: "Prepare handoff",
          description: "Creates local quote context without backend pricing execution."
        }
      }
    }
  },
  modals: {
    close: "Close",
    cancel: "Cancel",
    bodyTitle: "Modal Body",
    backendDisabled: "Backend integration is disabled. This modal updates local demo state only.",
    context: {
      title: "Context Summary",
      selectedNode: "Selected Node",
      path: "Path",
      unitType: "Unit Type",
      selectedRows: "Selected Rows"
    },
    createScope: {
      title: "Create Scope",
      description: "Create a local demo hierarchy scope with product-depth fields.",
      primaryAction: "Create Local Scope",
      result: "Local scope creation prepared with product-depth hierarchy fields.",
      validationNote: "Hierarchy rules are enforced in the demo form: unit type is an end node, variants require a service/product parent, service/products require service groups, service groups require catalogs, and catalogs require suppliers.",
      form: {
        parentNode: "Parent node",
        nodeType: "Node type",
        name: "Name",
        id: "ID",
        supplier: "Supplier",
        catalog: "Catalog",
        serviceGroup: "Service Group",
        serviceProduct: "Service / Product",
        variantRatePlan: "Variant / Rate Plan",
        unitType: "Unit Type",
        status: "Status",
        description: "Description",
        countries: "Countries",
        cities: "Cities",
        currencies: "Currencies",
        channels: "Channels",
        languages: "Languages",
        customerSegments: "Customer Segments"
      },
      fields: {
        primary: "New Scope Source",
        scope: "Scope Path",
        dimensions: "Scope Dimensions"
      }
    },
    editScope: {
      title: "Edit Scope",
      description: "Edit selected local scope metadata without calling backend APIs.",
      primaryAction: "Save Local Changes",
      result: "Local scope edit prepared.",
      auditTitle: "Scope edit prepared",
      auditDescription: "A local edit event was added for {{node}}.",
      fields: {
        primary: "Edit Target",
        scope: "Edited Scope",
        dimensions: "Edited Dimensions"
      }
    },
    cloneScope: {
      title: "Clone Scope",
      description: "Create a local clone draft with children, dimensions, dependencies, and policies.",
      primaryAction: "Clone Scope",
      result: "Local scope clone draft prepared.",
      auditTitle: "Scope clone prepared",
      auditDescription: "A local clone event was added for {{node}}.",
      fields: {
        primary: "Clone Source",
        scope: "Clone Scope",
        dimensions: "Cloned Dimensions"
      }
    },
    moveScope: {
      title: "Move Scope",
      description: "Validate a new local path for the selected scope before moving it.",
      primaryAction: "Move Scope",
      result: "Scope move validation prepared locally.",
      fields: {
        primary: "Move Target",
        scope: "Current Path",
        dimensions: "Move Dimensions"
      }
    },
    compareScope: {
      title: "Compare Scope",
      description: "Compare selected or visible hierarchy scopes with dimensions and related coverage.",
      primaryAction: "Compare Scopes",
      result: "Scope comparison prepared in local demo state.",
      fields: {
        primary: "Comparison Anchor",
        scope: "Scope Path",
        dimensions: "Dimensions Compared"
      }
    },
    dependencyAnalysis: {
      title: "Scope Dependency Analysis",
      description: "Analyze grants, policies, contracts, pricing, programs, and access decisions linked to the selected scope.",
      primaryAction: "Analyze Dependencies",
      result: "Dependency analysis prepared in local demo state.",
      fields: {
        primary: "Dependency Anchor",
        scope: "Dependency Scope",
        dimensions: "Dependency Dimensions"
      }
    },
    scopeSimulation: {
      title: "Scope Simulation",
      description: "Simulate local impact from creating, updating, moving, or deleting a scope.",
      primaryAction: "Run Simulation",
      result: "Scope simulation prepared in local demo state.",
      fields: {
        primary: "Simulation Target",
        scope: "Simulation Scope",
        dimensions: "Simulation Dimensions"
      }
    },
    exportScope: {
      title: "Export Scope Hierarchy",
      description: "Export selected hierarchy scope metadata and related intelligence as a local demo package.",
      primaryAction: "Export",
      result: "Scope export prepared locally.",
      fields: {
        primary: "Export Anchor",
        scope: "Export Scope",
        dimensions: "Included Dimensions"
      },
      options: {
        hierarchy: "Include hierarchy",
        dimensions: "Include dimensions",
        relatedAccess: "Include related access",
        commercial: "Include commercial links",
        audit: "Include audit summary"
      }
    },
    validateScope: {
      title: "Validate Scope",
      description: "Run local validation checks for path integrity and product-depth completeness.",
      primaryAction: "Run Validation",
      result: "Scope validation completed in local demo state.",
      fields: {
        primary: "Validation Target",
        scope: "Validated Scope",
        dimensions: "Validated Dimensions"
      },
      checks: {
        orphanNodes: "Orphan nodes",
        brokenPaths: "Broken paths",
        missingVariants: "Missing variants",
        missingUnitTypes: "Missing unit types",
        unusedScopes: "Unused scopes"
      }
    },
    resolutionCenter: {
      title: "Resolution Center",
      description: "Review validation issues, suggested fixes, and bulk resolution actions.",
      primaryAction: "Prepare Resolution",
      result: "Resolution Center prepared in local demo state.",
      fields: {
        primary: "Resolution Target",
        scope: "Resolution Scope",
        dimensions: "Affected Dimensions"
      }
    },
    coverageAnalysis: {
      title: "Coverage Analysis",
      description: "Review scope coverage across product, geography, channel, access, and commercial dimensions.",
      primaryAction: "Analyze Coverage",
      result: "Coverage analysis prepared in local demo state.",
      fields: {
        primary: "Coverage Target",
        scope: "Coverage Scope",
        dimensions: "Coverage Dimensions"
      }
    },
    auditDetails: {
      title: "Audit Details",
      description: "Review selected scope audit history and related local change markers.",
      primaryAction: "Open Audit Details",
      result: "Audit details opened in local demo state.",
      fields: {
        primary: "Audit Target",
        scope: "Audit Scope",
        dimensions: "Audit Dimensions"
      }
    },
    investigation: {
      title: "Investigation",
      description: "Create a local investigation draft for high-risk scope, validation, access, or commercial events.",
      primaryAction: "Save Investigation",
      result: "Investigation draft prepared in local demo state.",
      fields: {
        primary: "Investigation Target",
        scope: "Investigated Scope",
        dimensions: "Investigation Dimensions"
      }
    },
    deleteNode: {
      title: "Delete Node",
      description: "Confirm destructive local demo deletion for selected scope rows.",
      primaryAction: "Delete",
      result: "Selected local rows cleared from demo selection.",
      auditTitle: "Scope node archived",
      auditDescription: "Selected scope nodes were archived in local demo state.",
      warning: "Deleting scope nodes is destructive in a real workflow and requires reasoned confirmation.",
      reason: "Reason",
      fields: {
        primary: "Delete Target",
        scope: "Affected Scope",
        dimensions: "Affected Dimensions"
      }
    },
    importScope: {
      title: "Import Scope",
      description: "Preview CSV, Excel, or JSON scope imports against local hierarchy mappings.",
      primaryAction: "Preview Import",
      result: "Import preview prepared in local demo state.",
      fields: {
        primary: "Import Target",
        scope: "Import Scope",
        dimensions: "Mapped Dimensions"
      }
    },
    bulkUpload: {
      title: "Bulk Upload",
      description: "Upload and validate multiple local scope rows before applying demo changes.",
      primaryAction: "Upload Preview",
      result: "Bulk upload preview prepared in local demo state.",
      fields: {
        primary: "Upload Target",
        scope: "Upload Scope",
        dimensions: "Validated Dimensions"
      }
    },
    advancedFilters: {
      title: "Advanced Scope Filters",
      description: "Apply local node, unit, dimension, related-object, and validation filters.",
      primaryAction: "Apply Filters",
      result: "Advanced filters applied to local graph and tree state.",
      fields: {
        primary: "Filter Anchor",
        scope: "Filtered Scope",
        dimensions: "Active Dimensions"
      }
    },
    shareScope: {
      title: "Share Scope",
      description: "Prepare a local share action for the selected scope context.",
      primaryAction: "Copy / Share",
      result: "Scope share prepared in local demo state.",
      fields: {
        primary: "Share Target",
        scope: "Shared Scope",
        dimensions: "Shared Dimensions"
      }
    },
    simulateQuote: {
      title: "Simulate Quote",
      description: "Prepare quote simulation context from selected product-depth scope.",
      primaryAction: "Run Simulation",
      result: "Quote simulation context prepared locally for the selected product-depth scope.",
      form: {
        dateContext: "Date context",
        quantity: "Quantity",
        channel: "Channel",
        currency: "Currency"
      },
      fields: {
        primary: "Simulation Target",
        scope: "Simulation Scope",
        dimensions: "Simulation Dimensions"
      }
    },
    relatedList: {
      title: "Related Scope List",
      description: "Review full related intelligence for the selected scope.",
      primaryAction: "Keep Context",
      result: "Related scope list opened in local demo state.",
      fields: {
        primary: "Related List",
        scope: "Related Scope",
        dimensions: "Related Dimensions"
      }
    }
  },
  table: {
    name: "Name",
    type: "Type",
    id: "ID",
    context: "Context",
    children: "Children",
    unitType: "Unit Type",
    mixedUnitTypes: "Multiple unit types",
    notApplicable: "Not applicable",
    status: "Status",
    scopeDimensionsSummary: "Scope Dimensions (Summary)",
    actions: "Actions",
    grantName: "Grant Name",
    accessType: "Access Type",
    users: "Users",
    ruleName: "Rule Name",
    ruleType: "Rule Type",
    priority: "Priority",
    appliesTo: "Applies To",
    nodesTitle: "Authorized / Nodes",
    nodesDescription: "Node table with row quick actions, context menu actions, and bulk selection.",
    page: "page"
  },
  status: {
    active: "Active",
    archived: "Archived"
  },
  validation: {
    valid: "Valid",
    warning: "Warning",
    auditTitle: "Scope validation run",
    auditDescription: "Local scope validation was run for {{node}}.",
    validationType: "Validation type",
    types: {
      pathIntegrity: "Path integrity",
      missingChildren: "Missing children",
      dimensionCompleteness: "Dimension completeness",
      relatedObjectCoverage: "Related object coverage",
      orphanReferenceCheck: "Orphan/reference check"
    }
  },
  impact: {
    title: "10. Impact Summary",
    ifModified: "If this node is modified",
    grantsAffected: "Grants Affected",
    pricingRulesAffected: "Pricing Rules Affected",
    visibilityRulesAffected: "Visibility Rules Affected",
    usersPotentiallyImpacted: "Users Potentially Impacted",
    ifRestricted: "If this node is restricted",
    accessReduction: "Access Reduction",
    affectedResources: "Affected Resources",
    riskLevel: "Risk Level",
    reviewRequired: "Review Required",
    ifRemoved: "If this node is removed",
    orphanedChildren: "Orphaned Children",
    brokenGrants: "Broken Grants",
    brokenPricingRules: "Broken Pricing Rules",
    brokenVisibilityRules: "Broken Visibility Rules",
    inheritanceOverview: "Inheritance Overview"
  },
  path: {
    title: "Scope Path Preview",
    fullPath: "Full Path"
  },
  legend: {
    inherited: "Inherited",
    inheritedDetail: "Permissions inherited from parent",
    overridden: "Overridden",
    overriddenDetail: "Permissions overridden at this node",
    explicit: "Explicit",
    explicitDetail: "Explicitly granted at this node",
    denied: "Denied",
    deniedDetail: "Explicitly denied at this node"
  },
  refresh: {
    default: "Refresh",
    refreshing: "Refreshing...",
    refreshed: "Refreshed",
    failed: "Refresh Failed"
  },
  messages: {
    workspaceFiltersApplied: "Workspace filters applied locally.",
    workspaceFiltersCleared: "Workspace filters cleared.",
    workspaceColumnsUpdated: "Workspace columns updated.",
    workspaceRefreshCompleted: "Workspace data refreshed from local demo state."
  }
} as const;
