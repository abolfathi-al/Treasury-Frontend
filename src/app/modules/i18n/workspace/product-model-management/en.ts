export const productModelManagementWorkspaceEn = {
  navTitle: "Product Model Management",
  title: "Product Model Management vNext",
  version: "vNext",
  subtitle: "Design, manage, and govern product models, families, categories, components, bundles, entitlements, rules, and units of measure.",
  tabs: {
    productModels: "Product Models",
    productFamilies: "Product Families",
    productCategories: "Product Categories",
    productAttributes: "Product Attributes",
    productComponents: "Product Components",
    productBundles: "Product Bundles",
    uomMapping: "UOM Mapping",
    entitlements: "Entitlements",
    productRules: "Product Rules"
  },
  entities: {
    productModels: {
      title: "Product Models",
      subtitle: "Commercial product models used across pricing, inventory, and settlement.",
      plural: "Product Models",
      singular: "Product Model",
      create: "Create Product Model",
      compare: "Compare Product Models",
      filters: "Product Model Filters",
      search: "Search product models by name, code, or description..."
    },
    productFamilies: {
      title: "Product Families",
      subtitle: "Product families that structure and organize product models.",
      plural: "Product Families",
      singular: "Product Family",
      create: "Create Product Family",
      compare: "Compare Product Families",
      filters: "Product Family Filters",
      search: "Search product families by name, code, or description..."
    },
    productCategories: {
      title: "Product Categories",
      subtitle: "Categories that classify and organize product models.",
      plural: "Product Categories",
      singular: "Product Category",
      create: "Create Category",
      compare: "Compare Categories",
      filters: "Product Category Filters",
      search: "Search categories by name, code, or description..."
    },
    productAttributes: {
      title: "Product Attributes",
      subtitle: "Attributes used to describe, qualify, and validate product models.",
      plural: "Product Attributes",
      singular: "Product Attribute",
      create: "Create Attribute",
      compare: "Compare Attributes",
      filters: "Attribute Filters",
      search: "Search attributes by name, code, or description..."
    },
    productComponents: {
      title: "Product Components",
      subtitle: "Reusable product components that build and compose product models.",
      plural: "Product Components",
      singular: "Product Component",
      create: "Create Component",
      compare: "Compare Components",
      filters: "Component Filters",
      search: "Search components by name, code, or description..."
    },
    productBundles: {
      title: "Product Bundles",
      subtitle: "Bundles that combine multiple components into sellable offerings.",
      plural: "Product Bundles",
      singular: "Product Bundle",
      create: "Create Bundle",
      compare: "Compare Bundles",
      filters: "Bundle Filters",
      search: "Search bundles by name, code, or description..."
    },
    uomMapping: {
      title: "UOM Mapping",
      subtitle: "Map product models to sellable units of measure and conversion rules.",
      plural: "UOM Mappings",
      singular: "UOM Mapping",
      create: "Create UOM Mapping",
      compare: "Compare Mappings",
      filters: "UOM Mapping Filters",
      search: "Search UOM mappings by product model, UOM, or code..."
    },
    entitlements: {
      title: "Entitlements",
      subtitle: "Entitlements that control access, usage, and rights across products and contracts.",
      plural: "Entitlements",
      singular: "Entitlement",
      create: "Create Entitlement",
      compare: "Compare Entitlements",
      filters: "Entitlement Filters",
      search: "Search entitlements by name, code, or description..."
    },
    productRules: {
      title: "Product Rules",
      subtitle: "Business rules that govern pricing, availability, entitlements, access, and commercial behavior.",
      plural: "Product Rules",
      singular: "Product Rule",
      create: "Create Rule",
      compare: "Compare Rules",
      filters: "Rule Filters",
      search: "Search rules by name, code, or description..."
    }
  },
  actions: {
    export: "Export",
    import: "Import",
    view: "View",
    edit: "Edit",
    clone: "Clone",
    deactivate: "Deactivate"
  },
  toolbar: {
    createMenu: "Open create options",
    createCurrent: "Create {{entity}}",
    createViaImport: "Create via Import",
    createInBulk: "Create in Bulk"
  },
  moreFilters: {
    button: "More Filters",
    title: "More Filters",
    close: "Close more filters",
    apply: "Apply Filters",
    clearAll: "Clear All",
    appliedCount: "Filters Applied ({{count}})",
    none: "No additional filters for this tab."
  },
  columns: {
    title: "Columns",
    searchPlaceholder: "Search columns...",
    reset: "Reset",
    apply: "Apply",
    close: "Close columns",
    name: "Name",
    code: "Code",
    family: "Family",
    category: "Category",
    type: "Type",
    uom: "UOM",
    status: "Status",
    channels: "Channels",
    validFrom: "Valid From",
    validTo: "Valid To",
    usage: "Usage",
    description: "Description",
    productModels: "Product Models",
    dataType: "Data Type",
    unitType: "Unit Type",
    isRequired: "Is Required",
    defaultValue: "Default Value",
    applicableTo: "Applicable To",
    usedInModels: "Used In Models",
    lastUpdated: "Last Updated",
    componentType: "Component Type",
    reusability: "Reusability",
    bundleType: "Bundle Type",
    components: "Components",
    sellable: "Sellable",
    productModel: "Product Model",
    uomCode: "UOM Code",
    uomName: "UOM Name",
    uomType: "UOM Type",
    conversionFactor: "Conversion Factor",
    baseUom: "Base UOM",
    isDefault: "Is Default",
    usedIn: "Used In",
    entitlementType: "Entitlement Type",
    appliesTo: "Applies To",
    scope: "Scope",
    stackable: "Stackable",
    ruleType: "Rule Type",
    domain: "Domain",
    priority: "Priority",
    conditionSummary: "Condition Summary",
    actionSummary: "Action Summary"
  },
  filters: {
    search: "Search",
    all: "All",
    productFamily: "Product Family",
    category: "Category",
    status: "Status",
    channel: "Channel",
    productType: "Product Type",
    uom: "UOM",
    usageArea: "Usage Area",
    type: "Type",
    businessImpact: "Business Impact",
    validFrom: "Valid Date Range",
    family: "Family",
    categoryType: "Category Type",
    commercialUsage: "Commercial Usage",
    dataType: "Data Type",
    isRequired: "Is Required",
    applicableTo: "Applicable To",
    unitType: "Unit Type",
    componentType: "Component Type",
    reusability: "Reusability",
    usedInModel: "Used In Model",
    bundleType: "Bundle Type",
    sellable: "Sellable",
    componentCount: "Component Count",
    pricingStrategy: "Pricing Strategy",
    productModel: "Product Model",
    uomType: "UOM Type",
    isDefault: "Is Default",
    conversionType: "Conversion Type",
    entitlementType: "Entitlement Type",
    appliesTo: "Applies To",
    scope: "Scope",
    isStackable: "Stackable",
    usageImpact: "Usage Impact",
    ruleType: "Rule Type",
    domain: "Domain",
    priority: "Priority",
    isActive: "Is Active",
    severity: "Severity"
  },
  fields: {
    name: "Name",
    code: "Code",
    family: "Family",
    productFamily: "Product Family",
    category: "Category",
    type: "Type",
    productType: "Product Type",
    uom: "UOM",
    channel: "Channel",
    channels: "Channels",
    defaultChannels: "Default Channels",
    status: "Status",
    defaultUnitType: "Default Unit Type",
    isStackable: "Stackable",
    stackable: "Stackable",
    sellable: "Sellable",
    pricingImpact: "Pricing Impact",
    inventoryImpact: "Inventory Impact",
    entitlementImpact: "Entitlement Impact",
    settlementImpact: "Settlement Impact",
    usage: "Usage",
    usageArea: "Usage Area",
    validFrom: "Valid From",
    validTo: "Valid To",
    description: "Description",
    productModels: "Product Models",
    businessImpact: "Business Impact",
    categoryType: "Category Type",
    commercialUsage: "Commercial Usage",
    dataType: "Data Type",
    unitType: "Unit Type",
    isRequired: "Is Required",
    defaultValue: "Default Value",
    applicableTo: "Applicable To",
    validationRules: "Validation Rules",
    usedInModels: "Used In Models",
    componentType: "Component Type",
    reusability: "Reusability",
    parentChildRelation: "Parent / Child Relation",
    billable: "Billable",
    controllable: "Controllable",
    allocatable: "Allocatable",
    bundleType: "Bundle Type",
    components: "Components",
    componentCount: "Component Count",
    requiredItems: "Required Items",
    defaultQuantity: "Default Quantity",
    pricingStrategy: "Pricing Strategy",
    productModel: "Product Model",
    uomCode: "UOM Code",
    uomName: "UOM Name",
    uomType: "UOM Type",
    conversionFactor: "Conversion Factor",
    baseUom: "Base UOM",
    isDefault: "Is Default",
    conversionType: "Conversion Type",
    usedIn: "Used In",
    entitlementType: "Entitlement Type",
    appliesTo: "Applies To",
    scope: "Scope",
    usageImpact: "Usage Impact",
    ruleType: "Rule Type",
    domain: "Domain",
    priority: "Priority",
    conditionSummary: "Condition",
    actionSummary: "Action",
    severity: "Severity",
    isActive: "Is Active",
    createdBy: "Created By",
    createdAt: "Created At",
    updatedBy: "Updated By",
    updatedAt: "Updated At",
    version: "Version",
    lifecycleState: "Lifecycle State"
  },
  boolean: {
    yes: "Yes",
    no: "No"
  },
  common: {
    none: "-"
  },
  status: {
    active: "Active",
    inactive: "Inactive",
    draft: "Draft",
    deprecated: "Deprecated",
    archived: "Archived",
    system: "System"
  },
  metrics: {
    total: "Total",
    active: "Active",
    activeShare: "Active share of total",
    acrossAllCategories: "Across all categories",
    acrossAllProductModels: "Across all product models",
    awaitingReview: "Awaiting review",
    filteredCoverage: "Filtered coverage",
    requiresAttention: "Requires attention",
    draft: "Draft",
    deprecated: "Deprecated",
    inactive: "Inactive",
    usedInModels: "Used in Models",
    usedInPricing: "Used in Pricing"
  },
  table: {
    actions: "Actions",
    showing: "Showing {{start}} to {{end}} of {{total}} filtered records ({{all}} total)",
    pageSize: "Page size",
    perPage: "{{size}} / page"
  },
  views: {
    listView: "List View",
    gridView: "Grid View"
  },
  refresh: {
    default: "Refresh",
    refreshing: "Refreshing...",
    refreshed: "Refreshed",
    failed: "Refresh Failed",
    lastUpdated: "Last updated: {{time}}"
  },
  rowActions: {
    viewDetails: "View Details",
    edit: "Edit",
    clone: "Clone",
    exportRecord: "Export Record",
    viewAudit: "View Audit",
    deactivate: "Deactivate",
    viewUsedIn: "View Used In",
    viewImpactAnalysis: "View Impact Analysis",
    viewRelationships: "View Relationships",
    viewProductModels: "View Product Models",
    viewPricingAuthorities: "View Pricing Authorities",
    viewPricingRules: "View Pricing Rules",
    viewInventories: "View Inventories",
    configureComponents: "Configure Components",
    viewConversionRules: "View Conversion Rules",
    viewEntitlementScope: "View Entitlement Scope",
    configureConditions: "Configure Conditions",
    configureActions: "Configure Actions"
  },
  drawer: {
    code: "Code",
    close: "Close details drawer",
    generalInformation: "General Information",
    businessInformation: "Business Information",
    usageSummary: "Usage Summary",
    tags: "Tags",
    quickActions: "Quick Actions",
    relationshipMap: "Relationship Map",
    dependencyList: "Dependency List",
    tabs: {
      overview: "Overview",
      relatedData: "Related Data",
      impactAnalysis: "Impact Analysis",
      metadata: "Metadata",
      audit: "Audit",
      history: "History",
      relationships: "Relationships"
    },
    actions: {
      edit: "Edit",
      clone: "Clone",
      viewUsedIn: "View Used In",
      viewImpactAnalysis: "View Impact Analysis",
      viewRelationships: "View Relationships",
      deactivate: "Deactivate",
      viewProductModels: "View Product Models",
      viewPricingAuthorities: "View Pricing Authorities",
      viewPricingRules: "View Pricing Rules",
      viewInventories: "View Inventories",
      configureComponents: "Configure Components",
      viewConversionRules: "View Conversion Rules",
      viewAudit: "View Audit",
      viewEntitlementScope: "View Entitlement Scope",
      configureConditions: "Configure Conditions",
      configureActions: "Configure Actions"
    }
  },
  related: {
    title: "Related Intelligence",
    description: "Relationships for the selected record across commercial, pricing, inventory, access, and settlement.",
    viewAll: "View all"
  },
  relationships: {
    productModels: "Product Models",
    pricingAuthorities: "Pricing Authorities",
    pricingRules: "Pricing Rules",
    inventories: "Inventories",
    quotes: "Quotes",
    contracts: "Contracts",
    invoices: "Invoices",
    recentChanges: "Recent Changes",
    family: "Family",
    category: "Category",
    attributes: "Attributes",
    components: "Components",
    bundles: "Bundles",
    entitlements: "Entitlements",
    rules: "Rules",
    uomMappings: "UOM Mappings",
    categories: "Categories",
    channels: "Channels",
    parentModel: "Parent Model",
    childComponents: "Child Components",
    includedComponents: "Included Components",
    includedProductModels: "Included Product Models",
    productModel: "Product Model",
    baseUom: "Base UOM",
    conversionRules: "Conversion Rules",
    accessGrants: "Access Grants",
    appliesTo: "Applies To",
    conditions: "Conditions",
    actions: "Actions",
    affectedModels: "Affected Models"
  },
  usage: {
    productModels: "Product Models",
    pricingAuthorities: "Pricing Authorities",
    inventories: "Inventories",
    contracts: "Contracts",
    invoices: "Invoices",
    active: "Active",
    linked: "Linked",
    filtered: "Filtered"
  },
  impact: {
    pricing: "Pricing Impact",
    inventory: "Inventory Impact",
    entitlement: "Entitlement Impact",
    settlement: "Settlement Impact",
    affectedRecords: "Affected Records"
  },
  audit: {
    time: "Time",
    field: "Field",
    oldValue: "Old Value",
    newValue: "New Value",
    actor: "Actor",
    record: "Record",
    status: "Status",
    relationships: "Relationships",
    usage: "Usage"
  },
  history: {
    published: "Published",
    updated: "Updated",
    created: "Created",
    cloned: "Cloned"
  },
  modals: {
    cancel: "Cancel",
    title: "{{entity}}",
    create: {
      productModels: {
        description: "Create a product model with family, category, UOM, impact, and channel context."
      },
      productFamilies: {
        description: "Create a product family that organizes product models."
      },
      productCategories: {
        description: "Create a category under the selected product family."
      },
      productAttributes: {
        description: "Create an attribute with data type, unit type, and applicability."
      },
      productComponents: {
        description: "Create a reusable product component."
      },
      productBundles: {
        description: "Create a bundle from components and pricing behavior."
      },
      uomMapping: {
        description: "Create a UOM mapping and conversion rule."
      },
      entitlements: {
        description: "Create an entitlement for access, benefits, policy, or discount rights."
      },
      productRules: {
        description: "Create a rule with condition and action behavior."
      }
    },
    edit: {
      title: "Edit {{entity}}",
      description: "Update the selected {{entity}} locally."
    },
    clone: {
      title: "Clone {{entity}}",
      description: "Create a local copy of the selected {{entity}}."
    },
    import: {
      title: "Import {{entity}} Records",
      description: "Preview imported {{entity}} records locally."
    },
    export: {
      title: "Export {{entity}} Records",
      description: "Prepare a local export for {{entity}} records."
    },
    compare: {
      title: "Compare {{entity}} Records",
      description: "Compare selected {{entity}} records locally."
    },
    deactivate: {
      title: "Deactivate {{entity}}",
      description: "Deactivate or archive the selected {{entity}} locally."
    },
    relatedList: {
      title: "Related {{entity}} Records",
      description: "Open scoped related records for the selected {{entity}}."
    },
    columns: {
      localOnly: "Column choices update the current tab only."
    },
    fields: {
      selectValue: "Select value",
      cloneRelationships: "Clone relationships",
      cloneMetadata: "Clone metadata",
      importScope: "Import Scope"
    },
    confirm: {
      create: "Create",
      edit: "Save Changes",
      clone: "Clone",
      import: "Import",
      export: "Export",
      compare: "Compare",
      columns: "Apply",
      deactivate: "Deactivate",
      relatedList: "Open"
    }
  },
  import: {
    currentFiltered: "Current filtered results",
    format: "Format",
    dropzone: "Choose file or drag here",
    validation: "Preview, validation, dry-run, and update existing are enabled locally.",
    updateExisting: "Update existing records",
    dryRun: "Dry run first"
  },
  export: {
    scope: "Export Scope",
    format: "Format",
    currentFiltered: "Current Filtered Records",
    selectedRecords: "Selected Records ({{count}})",
    allRecords: "All Records",
    pdfSummary: "PDF Summary",
    includes: {
      metadata: "Metadata",
      relatedData: "Related Data",
      usageSummary: "Usage Summary",
      auditSummary: "Audit Summary"
    }
  },
  compare: {
    primary: "Primary Record",
    with: "Compare With",
    selectedRecords: "Selected records ({{count}})",
    differences: "Differences",
    relationships: "Relationships",
    usage: "Usage",
    metadata: "Metadata"
  },
  deactivate: {
    warning: "This will stop the selected record from being used in new transactions.",
    impact: "Existing references remain visible in local demo mode.",
    reason: "Reason",
    reasonPlaceholder: "Enter reason"
  },
  validation: {
    reasonRequired: "Reason is required before deactivation.",
    requiredFields: "Complete the required fields before continuing.",
    fieldRequired: "This field is required.",
    uniqueCode: "Code must be unique in this tab.",
    codeFormat: "Use letters, numbers, hyphens, or underscores.",
    invalidLookup: "Select an approved lookup value.",
    validDateRange: "Valid To must be later than Valid From.",
    positiveNumber: "Enter a number greater than zero.",
    priorityRange: "Priority must be between 1 and 999.",
    bundleComponents: "Bundles must include at least two components.",
    defaultUomUnique: "Only one default UOM is allowed per product model.",
    ruleConditionRequired: "Active rules require a condition.",
    ruleActionRequired: "Active rules require an action."
  },
  messages: {
    bulkCreateReady: "Bulk create uses the import preview flow in this local demo.",
    refreshFailed: "Refresh failed in demo state. Retry without Shift.",
    refreshCompleted: "Current tab refreshed locally.",
    created: "Record created locally.",
    edited: "Record updated locally.",
    cloned: "Record cloned locally.",
    importPreviewReady: "Import preview row added locally.",
    exportPrepared: "Export prepared locally.",
    exportPreparedSummary: "Export prepared for {{count}} records as CSV.",
    compareReady: "Comparison prepared locally.",
    columnsUpdated: "Columns updated for current tab.",
    deactivated: "Record status updated locally.",
    relatedListOpened: "Scoped related records opened locally.",
    filtersReset: "Current tab filters cleared.",
    filtersApplied: "Current tab filters applied."
  },
  bulk: {
    selectedCount: "{{count}} selected",
    exportSelected: "Export Selected",
    compareSelected: "Compare Selected",
    cloneSelected: "Clone Selected",
    deactivateSelected: "Deactivate Selected",
    clearSelection: "Clear selected records",
    selectAll: "Select all visible records",
    selectRow: "Select row",
    states: {
      default: "Bulk actions ready",
      processing: "Bulk action in progress",
      success: "Bulk action completed successfully",
      error: "Bulk action failed. Please try again.",
      allPageSelected: "All records on this page selected",
      partialPageSelected: "Some records on this page selected"
    },
    errors: {
      compareCount: "Compare requires 2 to 4 selected records.",
      processing: "Wait for the current bulk action to finish.",
      reasonRequired: "Reason is required before deactivation."
    },
    success: {
      exportCompleted: "Export completed successfully",
      exportSummary: "Export completed for {{count}} records as {{format}}.",
      compareCompleted: "Comparison prepared locally",
      cloneCompleted: "Selected records cloned locally",
      deactivateCompleted: "Selected records updated locally"
    },
    modals: {
      close: "Close",
      includeRelatedData: "Include related data",
      export: {
        title: "Export Selected Records",
        description: "Prepare a local export for selected records.",
        selectedCount: "You are about to export {{count}} selected records.",
        scope: "Export Scope",
        format: "Export Format",
        confirm: "Export",
        scopes: {
          selected: "Selected Records ({{count}})",
          filtered: "Current Filtered Records",
          all: "All Demo Records"
        },
        formats: {
          csv: "CSV",
          xlsx: "XLSX",
          pdf: "PDF"
        }
      },
      exportProgress: {
        title: "Export In Progress",
        description: "Preparing the local export file.",
        message: "Please wait while we prepare your export.",
        preparing: "Preparing data",
        generating: "Generating file",
        finalizing: "Finalizing"
      },
      exportComplete: {
        title: "Export Completed",
        description: "Your export is ready locally.",
        fileSummary: "File summary",
        download: "Download"
      },
      compare: {
        title: "Compare Selected Records",
        description: "Compare 2 to 4 selected records side by side.",
        selectedRecords: "Selected Records",
        focus: "Comparison Focus",
        confirm: "Compare",
        focusOptions: {
          allFields: "All Fields",
          relationships: "Relationships",
          usage: "Usage"
        }
      },
      clone: {
        title: "Clone Selected Records",
        description: "Create local copies for selected records.",
        selectedCount: "{{count}} selected",
        behavior: "Clone Behavior",
        prefix: "Prefix (Optional)",
        prefixPlaceholder: "Copy of",
        openCloned: "Open cloned records after creation",
        confirm: "Clone",
        behaviors: {
          newRecords: "Create as New Records",
          drafts: "Create as Drafts"
        }
      },
      deactivate: {
        title: "Deactivate Selected Records",
        description: "Deactivate or archive selected records locally.",
        selectedCount: "{{count}} selected",
        behavior: "Deactivation Behavior",
        warning: "These records will be hidden from active lists after confirmation.",
        confirm: "Deactivate",
        behaviors: {
          soft: "Deactivate (Soft)",
          archive: "Archive"
        }
      }
    }
  },
  charts: {
    relationships: "Relationships",
    impact: "Impact"
  }
} as const;
