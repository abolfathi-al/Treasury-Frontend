export const baseDataManagementWorkspaceEn = {
  navTitle: "Base Data Management",
  title: "Base Data Management vNext",
  version: "vNext",
  subtitle: "Manage foundational master data used across all workspaces and business domains.",
  tabs: {
    countries: "Countries",
    cities: "Cities",
    currencies: "Currencies",
    languages: "Languages",
    channels: "Channels",
    customerSegments: "Customer Segments",
    taxFeeTypes: "Tax & Fee Types",
    paymentTerms: "Payment Terms",
    unitTypes: "Unit Types",
    availabilityUnits: "Availability Units"
  },
  entities: {
    countries: {
      title: "Countries",
      subtitle: "Country master list and regional details.",
      plural: "Countries",
      singular: "Country",
      create: "Create Country",
      compare: "Compare Countries",
      filters: "Country Filters",
      search: "Search countries by name, code, or region..."
    },
    cities: {
      title: "Cities",
      subtitle: "City master list used across workspace scope, access, and pricing.",
      plural: "Cities",
      singular: "City",
      create: "Create City",
      compare: "Compare Cities",
      filters: "City Filters",
      search: "Search cities by name, code, country, or region..."
    },
    currencies: {
      title: "Currencies",
      subtitle: "Currency master list and exchange basics.",
      plural: "Currencies",
      singular: "Currency",
      create: "Create Currency",
      compare: "Compare Currencies",
      filters: "Currency Filters",
      search: "Search currencies by code, name, symbol, or country..."
    },
    languages: {
      title: "Languages",
      subtitle: "Language master data, scripts, direction, and formatting rules.",
      plural: "Languages",
      singular: "Language",
      create: "Create Language",
      compare: "Compare Languages",
      filters: "Language Filters",
      search: "Search languages by name, code, region, or script..."
    },
    channels: {
      title: "Channels",
      subtitle: "Sales and distribution channels across workspaces and domains.",
      plural: "Channels",
      singular: "Channel",
      create: "Create Channel",
      compare: "Compare Channels",
      filters: "Channel Filters",
      search: "Search channels by name, code, category, or description..."
    },
    customerSegments: {
      title: "Customer Segments",
      subtitle: "Customer segments used for targeting, access control, pricing, and policies.",
      plural: "Customer Segments",
      singular: "Customer Segment",
      create: "Create Segment",
      compare: "Compare Segments",
      filters: "Segment Filters",
      search: "Search segments by name, code, or description..."
    },
    taxFeeTypes: {
      title: "Tax & Fee Types",
      subtitle: "Tax and fee definitions used in pricing, invoicing, settlements, and reporting.",
      plural: "Tax & Fee Types",
      singular: "Tax/Fee Type",
      create: "Create Tax/Fee Type",
      compare: "Compare Tax/Fee Types",
      filters: "Tax & Fee Filters",
      search: "Search by name, code, category, or description..."
    },
    paymentTerms: {
      title: "Payment Terms",
      subtitle: "Standard payment terms used in contracts, pricing, and settlements.",
      plural: "Payment Terms",
      singular: "Payment Term",
      create: "Create Payment Term",
      compare: "Compare Terms",
      filters: "Payment Term Filters",
      search: "Search payment terms by name, code, or description..."
    },
    unitTypes: {
      title: "Unit Types",
      subtitle: "Unit types used for pricing, inventory, availability, and settlement calculations.",
      plural: "Unit Types",
      singular: "Unit Type",
      create: "Create Unit Type",
      compare: "Compare Unit Types",
      filters: "Unit Type Filters",
      search: "Search unit types by name, code, or description..."
    },
    availabilityUnits: {
      title: "Availability Units",
      subtitle: "Availability units used for inventory, capacity, allocation, and availability control.",
      plural: "Availability Units",
      singular: "Availability Unit",
      create: "Create Availability Unit",
      compare: "Compare Units",
      filters: "Availability Unit Filters",
      search: "Search availability units by name, code, or description..."
    }
  },
  actions: {
    export: "Export",
    import: "Import",
    columns: "Columns",
    gridView: "Grid View",
    gridViewDisabled: "Grid view is disabled in the local demo; table view remains active for this tab.",
    view: "View",
    edit: "Edit",
    clone: "Clone",
    viewRelated: "View Related Data",
    viewAudit: "View Audit",
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
  filters: {
    search: "Search",
    quickFilters: "Quick Filters",
    all: "All",
    status: "Status",
    category: "Category",
    allCategories: "All categories",
    region: "Region",
    subregion: "Subregion",
    currency: "Currency",
    language: "Language",
    activeMarket: "Active Market",
    country: "Country",
    timeZone: "Timezone",
    cityType: "City Type",
    airportSupport: "Airport Support",
    baseCurrency: "Base Currency",
    decimalPlaces: "Decimal Places",
    exchangeSource: "Exchange Source",
    countryRegion: "Country / Region",
    languageType: "Language Type",
    script: "Script",
    direction: "Direction",
    baseLanguage: "Is Base Language",
    channelType: "Channel Type",
    ownership: "Ownership",
    distributionModel: "Distribution Model",
    supportedRegion: "Supported Region",
    segmentType: "Segment Type",
    baseSegment: "Base Segment",
    channelApplicable: "Channel Applicable",
    type: "Type",
    appliesTo: "Applies To",
    taxability: "Taxability",
    effectiveFrom: "Effective Date",
    dueBasis: "Due Basis",
    depositRequired: "Deposit Required",
    measurementBasis: "Measurement Basis",
    settlementBasis: "Settlement Basis",
    isBillable: "Is Billable",
    unitType: "Unit Type",
    controllable: "Controllable",
    allocatable: "Allocatable",
    depletable: "Depletable",
    locationLevel: "Location Level",
    apply: "Apply Filters",
    reset: "Reset"
  },
  quick: {
    active: "Active Records",
    base: "Base Records",
    inactive: "Inactive Records",
    draft: "Draft Records",
    countries: {
      active: "Active Countries",
      primary: "Regions",
      inactive: "Inactive Countries",
      draft: "Draft Countries"
    },
    cities: {
      active: "Active Cities",
      primary: "Capital Cities",
      inactive: "Inactive Cities",
      draft: "Draft Cities"
    },
    currencies: {
      active: "Active Currencies",
      primary: "Base Currencies",
      inactive: "Obsolete Currencies",
      draft: "Draft Currencies"
    },
    languages: {
      active: "Active Languages",
      primary: "RTL Languages",
      inactive: "Inactive Languages",
      draft: "Draft Languages"
    },
    channels: {
      active: "Active Channels",
      primary: "B2B Channels",
      inactive: "Inactive Channels",
      draft: "Draft Channels"
    },
    customerSegments: {
      active: "Active Segments",
      primary: "Base Segments",
      inactive: "Inactive Segments",
      draft: "System Segments"
    },
    taxFeeTypes: {
      active: "Active Types",
      primary: "Tax Types",
      inactive: "Inactive Types",
      draft: "Fee Types"
    },
    paymentTerms: {
      active: "Active Terms",
      primary: "Standard Terms",
      inactive: "Other Terms",
      draft: "Milestone Terms"
    },
    unitTypes: {
      active: "Active Types",
      primary: "Capacity Based",
      inactive: "Custom Types",
      draft: "Time Based"
    },
    availabilityUnits: {
      active: "Active Units",
      primary: "Room / Accommodation",
      inactive: "Other Units",
      draft: "Time Based"
    }
  },
  legend: {
    title: "Legend (Status)"
  },
  status: {
    all: "All",
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
    filteredCoverage: "Filtered coverage",
    draft: "Draft",
    awaitingReview: "Awaiting review",
    inactive: "Inactive",
    requiresAttention: "Requires attention",
    regions: "Regions",
    capitalCities: "Capital Cities",
    baseCurrencies: "Base Currencies",
    rtlLanguages: "RTL Languages",
    b2bChannels: "B2B Channels",
    baseSegments: "Base Segments",
    taxTypes: "Tax Types",
    standardTerms: "Standard Terms",
    capacityBased: "Capacity Based",
    roomAccommodation: "Room / Accommodation"
  },
  table: {
    name: "Name",
    code: "Code",
    category: "Category",
    type: "Type",
    status: "Status",
    createdAt: "Created At",
    actions: "Actions",
    description: "Shared master-data table with row actions, bulk selection, and local pagination.",
    showing: "Showing {{start}} to {{end}} of {{total}} filtered records ({{all}} total)",
    pageSize: "Page size",
    perPage: "{{size}} / page"
  },
  columns: {
    title: "Columns",
    searchPlaceholder: "Search columns...",
    reset: "Reset",
    apply: "Apply",
    close: "Close columns",
    name: "Name",
    code: "Code",
    iso2: "ISO2",
    iso3: "ISO3",
    region: "Region",
    subregion: "Subregion",
    currency: "Currency",
    timeZone: "Timezone",
    status: "Status",
    createdAt: "Created At",
    country: "Country",
    airportSupport: "Airport Support",
    isoCode: "ISO Code",
    symbol: "Symbol",
    decimalPlaces: "Decimal Places",
    exchangeSource: "Exchange Source",
    baseCurrency: "Base Currency",
    languageName: "Language Name",
    iso6391: "ISO-639-1",
    iso6393: "ISO-639-3",
    nativeName: "Native Name",
    script: "Script",
    direction: "Direction",
    type: "Type",
    baseLanguage: "Is Base",
    channelName: "Channel Name",
    category: "Category",
    ownership: "Ownership",
    distributionModel: "Distribution Model",
    primaryRegion: "Primary Region",
    isBase: "Is Base",
    segmentName: "Segment Name",
    segmentType: "Segment Type",
    baseSegment: "Base Segment",
    channelApplicable: "Channel Applicable",
    priority: "Priority",
    appliesTo: "Applies To",
    taxability: "Taxability",
    calculationBasis: "Calculation Basis",
    rateValue: "Rate / Value",
    countryRegion: "Country / Region",
    dueBasis: "Due Basis",
    depositRequired: "Deposit Required",
    netDaysMilestone: "Net Days / Milestone",
    unitTypeName: "Unit Type Name",
    measurementBasis: "Measurement Basis",
    settlementBasis: "Settlement Basis",
    isBillable: "Is Billable",
    isActive: "Is Active",
    defaultUnit: "Default Unit",
    unitName: "Unit Name",
    unitType: "Unit Type",
    controllable: "Controllable",
    allocatable: "Allocatable",
    depletable: "Depletable",
    locationLevel: "Location Level"
  },
  fields: {
    name: "Name",
    code: "Code",
    category: "Category",
    type: "Type",
    iso2: "Code (ISO-2)",
    iso3: "Code (ISO-3)",
    iso4217: "Code (ISO-4217)",
    iso639: "Code (ISO-639)",
    isoCode: "ISO Code",
    iso6391: "ISO-639-1",
    iso6393: "ISO-639-3",
    symbol: "Symbol",
    decimals: "Decimals",
    decimalPlaces: "Decimal Places",
    country: "Country",
    countryRegion: "Country / Region",
    region: "Region",
    subregion: "Sub-Region",
    currency: "Currency",
    languages: "Languages",
    language: "Language",
    activeMarket: "Active Market",
    phoneCode: "Phone Code",
    timeZone: "Time Zone",
    population: "Population",
    cityType: "City Type",
    airportSupport: "Airport Support",
    geoLevel: "Geo Level",
    exchangeSource: "Exchange Source",
    ratePrecision: "Rate Precision",
    baseCurrency: "Base Currency",
    rateFrequency: "Rate Frequency",
    nativeName: "Native Name",
    script: "Script",
    direction: "Direction",
    languageType: "Language Type",
    baseLanguage: "Is Base Language",
    locale: "Locale",
    formattingRules: "Formatting Rules",
    firstDayOfWeek: "First Day of Week",
    digits: "Digits",
    channelKind: "Channel Type",
    channelType: "Channel Type",
    ownership: "Ownership",
    distributionModel: "Distribution Model",
    primaryRegion: "Primary Region",
    supportedRegion: "Supported Region",
    isBase: "Is Base",
    defaultCurrency: "Default Currency",
    defaultLanguage: "Default Language",
    multiCurrency: "Supports Multi-Currency",
    multiLanguage: "Supports Multi-Language",
    segmentKind: "Segment Type",
    segmentType: "Segment Type",
    baseSegment: "Base Segment",
    channelApplicable: "Channel Applicable",
    priority: "Priority",
    definitionSource: "Definition Source",
    rulesCount: "Rules Count",
    dynamicSegment: "Dynamic Segment",
    autoUpdate: "Auto Update",
    appliesTo: "Applies To",
    taxability: "Taxability",
    calculationRule: "Calculation Rule",
    calculationBasis: "Calculation Basis",
    rateValue: "Rate / Value",
    effectiveFrom: "Effective From",
    effectiveTo: "Effective To",
    countrySpecific: "Country Specific",
    globalType: "Global Type",
    compound: "Compound",
    compoundAllowed: "Compound Allowed",
    rounding: "Rounding",
    dueBasis: "Due Basis",
    netDays: "Net Days",
    netDaysMilestone: "Net Days / Milestone",
    depositRequired: "Deposit Required",
    discountAllowed: "Discount Allowed",
    discountTypeValue: "Discount Type / Value",
    discountType: "Discount Type",
    discountValue: "Discount Value",
    graceDays: "Grace Days",
    depositPercent: "Deposit Percent",
    measurementBasis: "Measurement Basis",
    settlementBasis: "Settlement Basis",
    billable: "Billable",
    isBillable: "Is Billable",
    isActive: "Is Active",
    defaultUnit: "Default Unit",
    pricingImpact: "Pricing Impact",
    inventoryImpact: "Inventory Impact",
    availabilityImpact: "Availability Impact",
    settlementImpact: "Settlement Impact",
    capacityBased: "Capacity Based",
    timeBased: "Time Based",
    usageBased: "Usage Based",
    financialBased: "Financial Based",
    unitType: "Unit Type",
    controllable: "Controllable",
    allocatable: "Allocatable",
    depletable: "Depletable",
    locationLevel: "Location Level",
    allocationRule: "Allocation Rule",
    overbookingAllowed: "Overbooking Allowed",
    holdSupported: "Hold Supported",
    releaseRule: "Release Rule",
    minBookableQty: "Min Bookable Qty",
    maxBookableQty: "Max Bookable Qty",
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
  rowActions: {
    viewDetails: "View Details",
    edit: "Edit",
    clone: "Clone",
    exportRecord: "Export Record",
    viewAudit: "View Audit",
    deactivate: "Deactivate"
  },
  drawer: {
    code: "Code",
    close: "Close details drawer",
    generalInformation: "General Information",
    businessInformation: "Business Information",
    usageSummary: "Usage Summary",
    tags: "Tags",
    quickActions: "Quick Actions",
    tabs: {
      overview: "Overview",
      relatedData: "Related Data",
      impactAnalysis: "Impact Analysis",
      metadata: "Metadata",
      audit: "Audit",
      history: "History"
    },
    actions: {
      edit: "Edit",
      clone: "Clone",
      viewCities: "View Cities",
      viewTaxFees: "View Tax & Fees",
      viewAudit: "View Audit",
      viewRelatedHotels: "View Related Hotels",
      viewPricingAuthorities: "View Pricing Authorities",
      viewAccessDecisions: "View Access Decisions",
      viewCountries: "View Countries",
      viewContracts: "View Contracts",
      viewInvoices: "View Invoices",
      viewTranslations: "View Translations",
      viewWorkspaces: "View Workspaces",
      viewFormattingRules: "View Formatting Rules",
      viewSupportedRegions: "View Supported Regions",
      viewRelatedMembers: "View Related Members",
      viewAccessGrants: "View Access Grants",
      viewPricingRules: "View Pricing Rules",
      viewUsageDetails: "View Usage Details",
      viewQuotes: "View Quotes",
      viewInventory: "View Inventory Items",
      deactivate: "Deactivate",
      deactivateCountry: "Deactivate Country",
      deactivateCity: "Deactivate City",
      deactivateCurrency: "Deactivate Currency",
      deactivateLanguage: "Deactivate Language",
      deactivateChannel: "Deactivate Channel",
      deactivateSegment: "Deactivate Segment",
      deactivateTaxFeeType: "Deactivate Tax/Fee Type",
      deactivatePaymentTerm: "Deactivate Payment Term",
      deactivateUnitType: "Deactivate Unit Type",
      deactivateAvailabilityUnit: "Deactivate Availability Unit"
    }
  },
  usage: {
    active: "Active",
    linked: "Linked",
    filtered: "Filtered",
    cities: "Cities",
    contracts: "Contracts",
    pricingAuthorities: "Pricing Authorities",
    hotels: "Hotels / Accommodations",
    suppliers: "Suppliers",
    accessDecisions: "Access Decisions",
    covered: "Covered",
    effective: "Effective",
    paymentTerms: "Payment Terms",
    using: "Using",
    pages: "Pages",
    translationKeys: "Translation Keys",
    translated: "Translated",
    workspaces: "Workspaces",
    total: "Total",
    countries: "Countries",
    invoices: "Invoices",
    pricingRules: "Pricing Rules",
    quotes: "Quotes",
    inventoryItems: "Inventory Items",
    items: "Items",
    consumers: "Consumers",
    accessGrants: "Access Grants",
    members: "Members"
  },
  relationships: {
    cities: "Cities",
    currencies: "Currencies",
    taxTypes: "Tax Types",
    channels: "Channels",
    contracts: "Contracts",
    pricingAuthorities: "Pricing Authorities",
    hotels: "Hotels",
    suppliers: "Suppliers",
    accessDecisions: "Access Decisions",
    quotes: "Quotes",
    invoices: "Invoices",
    paymentTerms: "Payment Terms",
    translations: "Translations",
    pages: "Pages",
    workspaces: "Workspaces",
    formattingRules: "Formatting Rules",
    consumers: "Consumers",
    commercialContracts: "Commercial Contracts",
    policies: "Policies",
    members: "Members",
    pricingRules: "Pricing Rules",
    inventory: "Inventory"
  },
  impact: {
    usedIn: "Used In",
    affectedObjects: "Affected Objects",
    deletionImpact: "Deletion Impact",
    riskLevel: "Risk Level"
  },
  audit: {
    record: "Record",
    status: "Status",
    relationships: "Relationships",
    time: "Time",
    field: "Field",
    oldValue: "Old Value",
    newValue: "New Value",
    actor: "Actor"
  },
  history: {
    updated: "Updated",
    created: "Created",
    cloned: "Cloned"
  },
  related: {
    title: "Related Intelligence",
    description: "Relationships for the selected record across contracts, pricing, access, and inventory.",
    viewAll: "View all"
  },
  actionMap: {
    title: "Action Behavior Map",
    viewDetails: "Open drawer overview",
    edit: "Open edit modal",
    clone: "Open clone modal",
    exportRecord: "Open export modal",
    viewAudit: "Open audit tab",
    deactivate: "Open confirmation modal"
  },
  modalLibrary: {
    title: "Modal Library"
  },
  backendMapping: {
    title: "Future Backend Mapping"
  },
  unitReference: {
    title: "Unit / Relationship Reference"
  },
  modals: {
    context: "Selected Context",
    cancel: "Cancel",
    create: {
      title: "Create Record",
      description: "Create a new {{entity}} in local demo state.",
      countries: {
        description: "Create a country with regional, currency, language, and market settings."
      },
      cities: {
        description: "Create a city with country, timezone, type, and airport support."
      },
      currencies: {
        description: "Create a currency with decimal, exchange source, and country coverage."
      },
      languages: {
        description: "Create a language with script, direction, region, and formatting rules."
      },
      channels: {
        description: "Create a channel with ownership, distribution model, and region coverage."
      },
      customerSegments: {
        description: "Create a customer segment with ownership, base segment, and priority."
      },
      taxFeeTypes: {
        description: "Create a tax or fee type with calculation, currency, and effective date."
      },
      paymentTerms: {
        description: "Create payment terms with due basis, discounts, deposit, and currency."
      },
      unitTypes: {
        description: "Create a unit type with measurement, settlement, and impact controls."
      },
      availabilityUnits: {
        description: "Create an availability unit with allocation, hold, and release behavior."
      }
    },
    edit: {
      title: "Edit Record",
      description: "Edit the selected {{entity}} locally.",
      countries: {
        title: "Edit Country",
        description: "Edit country reference data locally."
      },
      cities: {
        title: "Edit City",
        description: "Edit city reference data locally."
      },
      currencies: {
        title: "Edit Currency",
        description: "Edit currency settings locally."
      },
      languages: {
        title: "Edit Language",
        description: "Edit language and formatting settings locally."
      },
      channels: {
        title: "Edit Channel",
        description: "Edit channel settings locally."
      },
      customerSegments: {
        title: "Edit Segment",
        description: "Edit customer segment settings locally."
      },
      taxFeeTypes: {
        title: "Edit Tax/Fee Type",
        description: "Edit tax or fee calculation settings locally."
      },
      paymentTerms: {
        title: "Edit Payment Term",
        description: "Edit payment term settings locally."
      },
      unitTypes: {
        title: "Edit Unit Type",
        description: "Edit unit type settings locally."
      },
      availabilityUnits: {
        title: "Edit Availability Unit",
        description: "Edit availability unit behavior locally."
      }
    },
    clone: {
      title: "Clone Record",
      description: "Clone the selected {{entity}} as a draft.",
      countries: {
        title: "Clone Country",
        description: "Clone selected country as a draft."
      },
      cities: {
        title: "Clone City",
        description: "Clone selected city as a draft."
      },
      currencies: {
        title: "Clone Currency",
        description: "Clone selected currency as a draft."
      },
      languages: {
        title: "Clone Language",
        description: "Clone selected language as a draft."
      },
      channels: {
        title: "Clone Channel",
        description: "Clone selected channel as a draft."
      },
      customerSegments: {
        title: "Clone Segment",
        description: "Clone selected segment as a draft."
      },
      taxFeeTypes: {
        title: "Clone Tax/Fee Type",
        description: "Clone selected tax or fee type as a draft."
      },
      paymentTerms: {
        title: "Clone Payment Term",
        description: "Clone selected payment term as a draft."
      },
      unitTypes: {
        title: "Clone Unit Type",
        description: "Clone selected unit type as a draft."
      },
      availabilityUnits: {
        title: "Clone Availability Unit",
        description: "Clone selected availability unit as a draft."
      }
    },
    import: {
      title: "Import Records",
      description: "Preview and validate imported {{entity}} records.",
      countries: {
        title: "Import Countries",
        description: "Preview imported country rows."
      },
      cities: {
        title: "Import Cities",
        description: "Preview imported city rows."
      },
      currencies: {
        title: "Import Currencies",
        description: "Preview imported currency rows."
      },
      languages: {
        title: "Import Languages",
        description: "Preview imported language rows."
      },
      channels: {
        title: "Import Channels",
        description: "Preview imported channel rows."
      },
      customerSegments: {
        title: "Import Segments",
        description: "Preview imported segment rows."
      },
      taxFeeTypes: {
        title: "Import Tax/Fee Types",
        description: "Preview imported tax and fee rows."
      },
      paymentTerms: {
        title: "Import Payment Terms",
        description: "Preview imported payment term rows."
      },
      unitTypes: {
        title: "Import Unit Types",
        description: "Preview imported unit type rows."
      },
      availabilityUnits: {
        title: "Import Availability Units",
        description: "Preview imported availability unit rows."
      }
    },
    export: {
      title: "Export Records",
      description: "Prepare a local export for {{entity}} records.",
      countries: {
        title: "Export Countries",
        description: "Export filtered or selected countries locally."
      },
      cities: {
        title: "Export Cities",
        description: "Export filtered or selected cities locally."
      },
      currencies: {
        title: "Export Currencies",
        description: "Export filtered or selected currencies locally."
      },
      languages: {
        title: "Export Languages",
        description: "Export filtered or selected languages locally."
      },
      channels: {
        title: "Export Channels",
        description: "Export filtered or selected channels locally."
      },
      customerSegments: {
        title: "Export Segments",
        description: "Export filtered or selected segments locally."
      },
      taxFeeTypes: {
        title: "Export Tax/Fee Types",
        description: "Export filtered or selected tax and fee types locally."
      },
      paymentTerms: {
        title: "Export Payment Terms",
        description: "Export filtered or selected payment terms locally."
      },
      unitTypes: {
        title: "Export Unit Types",
        description: "Export filtered or selected unit types locally."
      },
      availabilityUnits: {
        title: "Export Availability Units",
        description: "Export filtered or selected availability units locally."
      }
    },
    compare: {
      title: "Compare Records",
      description: "Compare 2 to 4 {{entity}} records.",
      countries: {
        title: "Compare Countries",
        description: "Compare country metadata, usage, and relationships."
      },
      cities: {
        title: "Compare Cities",
        description: "Compare city metadata, usage, and relationships."
      },
      currencies: {
        title: "Compare Currencies",
        description: "Compare currency precision, rates, and usage."
      },
      languages: {
        title: "Compare Languages",
        description: "Compare language scripts, formatting, and coverage."
      },
      channels: {
        title: "Compare Channels",
        description: "Compare channel ownership, coverage, and usage."
      },
      customerSegments: {
        title: "Compare Segments",
        description: "Compare segment rules, members, and usage."
      },
      taxFeeTypes: {
        title: "Compare Tax/Fee Types",
        description: "Compare calculation, applicability, and usage."
      },
      paymentTerms: {
        title: "Compare Payment Terms",
        description: "Compare payment structure, discounts, and usage."
      },
      unitTypes: {
        title: "Compare Unit Types",
        description: "Compare measurement, settlement, and impact settings."
      },
      availabilityUnits: {
        title: "Compare Availability Units",
        description: "Compare behavior, allocation, and usage."
      }
    },
    columns: {
      localOnly: "Column choices are local to this demo tab.",
      countries: {
        title: "Country Columns",
        description: "Choose visible columns for countries."
      },
      cities: {
        title: "City Columns",
        description: "Choose visible columns for cities."
      },
      currencies: {
        title: "Currency Columns",
        description: "Choose visible columns for currencies."
      },
      languages: {
        title: "Language Columns",
        description: "Choose visible columns for languages."
      },
      channels: {
        title: "Channel Columns",
        description: "Choose visible columns for channels."
      },
      customerSegments: {
        title: "Segment Columns",
        description: "Choose visible columns for segments."
      },
      taxFeeTypes: {
        title: "Tax/Fee Columns",
        description: "Choose visible columns for tax and fee types."
      },
      paymentTerms: {
        title: "Payment Term Columns",
        description: "Choose visible columns for payment terms."
      },
      unitTypes: {
        title: "Unit Type Columns",
        description: "Choose visible columns for unit types."
      },
      availabilityUnits: {
        title: "Availability Unit Columns",
        description: "Choose visible columns for availability units."
      }
    },
    deactivate: {
      title: "Deactivate Record",
      description: "Deactivate the selected {{entity}} locally.",
      countries: {
        title: "Deactivate Country",
        description: "Mark selected country inactive locally."
      },
      cities: {
        title: "Deactivate City",
        description: "Mark selected city inactive locally."
      },
      currencies: {
        title: "Deactivate Currency",
        description: "Mark selected currency inactive locally."
      },
      languages: {
        title: "Deactivate Language",
        description: "Mark selected language inactive locally."
      },
      channels: {
        title: "Deactivate Channel",
        description: "Mark selected channel inactive locally."
      },
      customerSegments: {
        title: "Deactivate Segment",
        description: "Mark selected segment inactive locally."
      },
      taxFeeTypes: {
        title: "Deactivate Tax/Fee Type",
        description: "Mark selected tax or fee type inactive locally."
      },
      paymentTerms: {
        title: "Deactivate Payment Term",
        description: "Mark selected payment term inactive locally."
      },
      unitTypes: {
        title: "Deactivate Unit Type",
        description: "Mark selected unit type inactive locally."
      },
      availabilityUnits: {
        title: "Deactivate Availability Unit",
        description: "Mark selected availability unit inactive locally."
      }
    },
    relatedList: {
      title: "Related Records",
      description: "Review full related data for the selected {{entity}}.",
      countries: {
        title: "Related Country Data",
        description: "Review city, currency, tax, and contract relationships."
      },
      cities: {
        title: "Related City Data",
        description: "Review hotel, supplier, access, and pricing relationships."
      },
      currencies: {
        title: "Related Currency Data",
        description: "Review country, contract, invoice, and pricing relationships."
      },
      languages: {
        title: "Related Language Data",
        description: "Review translation, workspace, and formatting relationships."
      },
      channels: {
        title: "Related Channel Data",
        description: "Review consumer, contract, pricing, and access relationships."
      },
      customerSegments: {
        title: "Related Segment Data",
        description: "Review member, grant, pricing, and policy relationships."
      },
      taxFeeTypes: {
        title: "Related Tax/Fee Data",
        description: "Review usage, contracts, pricing rules, and invoices."
      },
      paymentTerms: {
        title: "Related Payment Term Data",
        description: "Review contract, invoice, quote, and pricing rule relationships."
      },
      unitTypes: {
        title: "Related Unit Type Data",
        description: "Review contract, pricing, quote, and invoice relationships."
      },
      availabilityUnits: {
        title: "Related Availability Data",
        description: "Review inventory, contract, pricing, and quote relationships."
      }
    },
    fields: {
      enterName: "Enter name",
      enterCode: "Enter code",
      selectCategory: "Select category",
      selectType: "Select type",
      selectValue: "Select value",
      description: "Description",
      cloneRelationships: "Clone related data summary",
      cloneMetadata: "Clone metadata and tags",
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
      relatedList: "Keep Open"
    }
  },
  import: {
    currentFiltered: "Current filtered results",
    format: "Format",
    dropzone: "Choose file or drag here",
    validation: "Preview, validation, update existing, and dry-run are enabled locally.",
    updateExisting: "Update existing records",
    dryRun: "Dry run first"
  },
  export: {
    scope: "Export Scope",
    format: "Format",
    currentFiltered: "Current filtered results",
    selectedRecords: "Selected records ({{count}})",
    allRecords: "All records",
    pdfSummary: "PDF Summary",
    includes: {
      metadata: "Metadata",
      relatedData: "Related Data Summary",
      usageSummary: "Usage Summary",
      auditSummary: "Audit Summary"
    }
  },
  compare: {
    primary: "Primary Record",
    with: "Compare With",
    selectedRecords: "{{count}} selected records",
    differences: "Differences",
    relationships: "Relationships",
    usage: "Usage",
    metadata: "Metadata"
  },
  deactivate: {
    warning: "This will mark the record inactive.",
    impact: "New transactions stop using this record. Existing references remain visible.",
    reason: "Reason",
    reasonPlaceholder: "Enter reason"
  },
  validation: {
    reasonRequired: "Reason is required before deactivation.",
    requiredFields: "Complete the required fields before continuing.",
    fieldRequired: "This field is required.",
    uniqueCode: "Code must be unique in this tab.",
    invalidFormat: "Use the approved code format.",
    codeFormat: "Use letters, numbers, hyphens, or underscores.",
    iso2Format: "Use a 2-letter ISO code.",
    iso3Format: "Use a 3-letter ISO code.",
    isoCodeFormat: "Use a 3-letter ISO currency code.",
    iso6391Format: "Use a 2-letter ISO language code.",
    numberRange: "Enter a valid number in the allowed range."
  },
  messages: {
    created: "Record created locally.",
    edited: "Record updated locally.",
    cloned: "Record cloned as draft.",
    importPreviewReady: "Import preview prepared locally.",
    exportPrepared: "Export prepared locally.",
    compareReady: "Comparison result shown.",
    deactivated: "Record status set to inactive.",
    relatedListOpened: "Related records filtered.",
    filtersReset: "Filters reset.",
    filtersApplied: "Filters applied.",
    columnsUpdated: "Column preferences applied locally.",
    refreshCompleted: "Local data refreshed.",
    refreshFailed: "Refresh failed in demo mode.",
    bulkCreateReady: "Bulk create uses the import preview workflow locally."
  }
} as const;
