export const productModelManagementWorkspaceFa = {
  navTitle: "مدیریت مدل محصول",
  title: "مدیریت مدل محصول نسخه بعد",
  version: "نسخه بعد",
  subtitle: "طراحی و مدیریت مدل ها، خانواده ها، دسته ها، اجزا، بسته ها، مجوزها، قوانین و واحدهای اندازه گیری محصول.",
  tabs: {
    productModels: "مدل های محصول",
    productFamilies: "خانواده های محصول",
    productCategories: "دسته های محصول",
    productAttributes: "ویژگی های محصول",
    productComponents: "اجزای محصول",
    productBundles: "بسته های محصول",
    uomMapping: "نگاشت UOM",
    entitlements: "مجوزها",
    productRules: "قوانین محصول"
  },
  entities: {
    productModels: {
      title: "مدل های محصول",
      subtitle: "مدل های تجاری محصول برای قیمت گذاری، موجودی و تسویه.",
      plural: "مدل های محصول",
      singular: "مدل محصول",
      create: "ایجاد مدل محصول",
      compare: "مقایسه مدل های محصول",
      filters: "فیلترهای مدل محصول",
      search: "جستجوی مدل محصول بر اساس نام، کد یا توضیح..."
    },
    productFamilies: {
      title: "خانواده های محصول",
      subtitle: "خانواده هایی برای ساختاردهی و سازماندهی مدل های محصول.",
      plural: "خانواده های محصول",
      singular: "خانواده محصول",
      create: "ایجاد خانواده محصول",
      compare: "مقایسه خانواده ها",
      filters: "فیلترهای خانواده محصول",
      search: "جستجوی خانواده محصول بر اساس نام، کد یا توضیح..."
    },
    productCategories: {
      title: "دسته های محصول",
      subtitle: "دسته هایی برای طبقه بندی مدل های محصول.",
      plural: "دسته های محصول",
      singular: "دسته محصول",
      create: "ایجاد دسته",
      compare: "مقایسه دسته ها",
      filters: "فیلترهای دسته محصول",
      search: "جستجوی دسته بر اساس نام، کد یا توضیح..."
    },
    productAttributes: {
      title: "ویژگی های محصول",
      subtitle: "ویژگی هایی برای توصیف، اعتبارسنجی و صلاحیت مدل محصول.",
      plural: "ویژگی های محصول",
      singular: "ویژگی محصول",
      create: "ایجاد ویژگی",
      compare: "مقایسه ویژگی ها",
      filters: "فیلترهای ویژگی",
      search: "جستجوی ویژگی بر اساس نام، کد یا توضیح..."
    },
    productComponents: {
      title: "اجزای محصول",
      subtitle: "اجزای قابل استفاده مجدد برای ساخت مدل های محصول.",
      plural: "اجزای محصول",
      singular: "جزء محصول",
      create: "ایجاد جزء",
      compare: "مقایسه اجزا",
      filters: "فیلترهای جزء",
      search: "جستجوی جزء بر اساس نام، کد یا توضیح..."
    },
    productBundles: {
      title: "بسته های محصول",
      subtitle: "بسته هایی که چند جزء را به پیشنهاد قابل فروش تبدیل می کنند.",
      plural: "بسته های محصول",
      singular: "بسته محصول",
      create: "ایجاد بسته",
      compare: "مقایسه بسته ها",
      filters: "فیلترهای بسته",
      search: "جستجوی بسته بر اساس نام، کد یا توضیح..."
    },
    uomMapping: {
      title: "نگاشت UOM",
      subtitle: "نگاشت مدل محصول به واحدهای فروش و قوانین تبدیل.",
      plural: "نگاشت های UOM",
      singular: "نگاشت UOM",
      create: "ایجاد نگاشت UOM",
      compare: "مقایسه نگاشت ها",
      filters: "فیلترهای نگاشت UOM",
      search: "جستجوی نگاشت UOM بر اساس مدل، واحد یا کد..."
    },
    entitlements: {
      title: "مجوزها",
      subtitle: "مجوزهایی برای کنترل دسترسی، استفاده و حقوق در محصول و قرارداد.",
      plural: "مجوزها",
      singular: "مجوز",
      create: "ایجاد مجوز",
      compare: "مقایسه مجوزها",
      filters: "فیلترهای مجوز",
      search: "جستجوی مجوز بر اساس نام، کد یا توضیح..."
    },
    productRules: {
      title: "قوانین محصول",
      subtitle: "قوانینی برای قیمت، موجودی، مجوز، دسترسی و رفتار تجاری.",
      plural: "قوانین محصول",
      singular: "قانون محصول",
      create: "ایجاد قانون",
      compare: "مقایسه قوانین",
      filters: "فیلترهای قانون",
      search: "جستجوی قانون بر اساس نام، کد یا توضیح..."
    }
  },
  actions: {
    export: "خروجی",
    import: "ورودی",
    view: "مشاهده",
    edit: "ویرایش",
    clone: "کپی",
    deactivate: "غیرفعال سازی"
  },
  toolbar: {
    createMenu: "باز کردن گزینه های ایجاد",
    createCurrent: "ایجاد {{entity}}",
    createViaImport: "ایجاد از ورودی",
    createInBulk: "ایجاد گروهی"
  },
  moreFilters: {
    button: "فیلترهای بیشتر",
    title: "فیلترهای بیشتر",
    close: "بستن فیلترها",
    apply: "اعمال فیلترها",
    clearAll: "پاک کردن همه",
    appliedCount: "فیلترهای اعمال شده ({{count}})",
    none: "برای این تب فیلتر اضافی وجود ندارد."
  },
  columns: {
    title: "ستون ها",
    searchPlaceholder: "جستجوی ستون ها...",
    reset: "بازنشانی",
    apply: "اعمال",
    close: "بستن ستون ها",
    name: "نام",
    code: "کد",
    family: "خانواده",
    category: "دسته",
    type: "نوع",
    uom: "UOM",
    status: "وضعیت",
    channels: "کانال ها",
    validFrom: "اعتبار از",
    validTo: "اعتبار تا",
    usage: "استفاده",
    description: "توضیح",
    productModels: "مدل های محصول",
    dataType: "نوع داده",
    unitType: "نوع واحد",
    isRequired: "الزامی",
    defaultValue: "مقدار پیش فرض",
    applicableTo: "قابل اعمال بر",
    usedInModels: "استفاده در مدل ها",
    lastUpdated: "آخرین به روزرسانی",
    componentType: "نوع جزء",
    reusability: "قابلیت استفاده مجدد",
    bundleType: "نوع بسته",
    components: "اجزا",
    sellable: "قابل فروش",
    productModel: "مدل محصول",
    uomCode: "کد UOM",
    uomName: "نام UOM",
    uomType: "نوع UOM",
    conversionFactor: "ضریب تبدیل",
    baseUom: "UOM پایه",
    isDefault: "پیش فرض",
    usedIn: "استفاده شده در",
    entitlementType: "نوع مجوز",
    appliesTo: "اعمال بر",
    scope: "دامنه",
    stackable: "قابل انباشت",
    ruleType: "نوع قانون",
    domain: "دامنه",
    priority: "اولویت",
    conditionSummary: "خلاصه شرط",
    actionSummary: "خلاصه اقدام"
  },
  filters: {
    search: "جستجو",
    all: "همه",
    productFamily: "خانواده محصول",
    category: "دسته",
    status: "وضعیت",
    channel: "کانال",
    productType: "نوع محصول",
    uom: "UOM",
    usageArea: "حوزه استفاده",
    type: "نوع",
    businessImpact: "اثر کسب و کار",
    validFrom: "بازه اعتبار",
    family: "خانواده",
    categoryType: "نوع دسته",
    commercialUsage: "استفاده تجاری",
    dataType: "نوع داده",
    isRequired: "الزامی",
    applicableTo: "قابل اعمال بر",
    unitType: "نوع واحد",
    componentType: "نوع جزء",
    reusability: "استفاده مجدد",
    usedInModel: "استفاده در مدل",
    bundleType: "نوع بسته",
    sellable: "قابل فروش",
    componentCount: "تعداد جزء",
    pricingStrategy: "استراتژی قیمت",
    productModel: "مدل محصول",
    uomType: "نوع UOM",
    isDefault: "پیش فرض",
    conversionType: "نوع تبدیل",
    entitlementType: "نوع مجوز",
    appliesTo: "اعمال بر",
    scope: "دامنه",
    isStackable: "قابل انباشت",
    usageImpact: "اثر استفاده",
    ruleType: "نوع قانون",
    domain: "دامنه",
    priority: "اولویت",
    isActive: "فعال است",
    severity: "شدت"
  },
  fields: {
    name: "نام",
    code: "کد",
    family: "خانواده",
    productFamily: "خانواده محصول",
    category: "دسته",
    type: "نوع",
    productType: "نوع محصول",
    uom: "UOM",
    channel: "کانال",
    channels: "کانال ها",
    defaultChannels: "کانال های پیش فرض",
    status: "وضعیت",
    defaultUnitType: "نوع واحد پیش فرض",
    isStackable: "قابل انباشت",
    stackable: "قابل انباشت",
    sellable: "قابل فروش",
    pricingImpact: "اثر قیمت گذاری",
    inventoryImpact: "اثر موجودی",
    entitlementImpact: "اثر مجوز",
    settlementImpact: "اثر تسویه",
    usage: "استفاده",
    usageArea: "حوزه استفاده",
    validFrom: "اعتبار از",
    validTo: "اعتبار تا",
    description: "توضیح",
    productModels: "مدل های محصول",
    businessImpact: "اثر کسب و کار",
    categoryType: "نوع دسته",
    commercialUsage: "استفاده تجاری",
    dataType: "نوع داده",
    unitType: "نوع واحد",
    isRequired: "الزامی",
    defaultValue: "مقدار پیش فرض",
    applicableTo: "قابل اعمال بر",
    validationRules: "قوانین اعتبارسنجی",
    usedInModels: "استفاده در مدل ها",
    componentType: "نوع جزء",
    reusability: "قابلیت استفاده مجدد",
    parentChildRelation: "رابطه والد / فرزند",
    billable: "قابل صورتحساب",
    controllable: "قابل کنترل",
    allocatable: "قابل تخصیص",
    bundleType: "نوع بسته",
    components: "اجزا",
    componentCount: "تعداد جزء",
    requiredItems: "موارد الزامی",
    defaultQuantity: "تعداد پیش فرض",
    pricingStrategy: "استراتژی قیمت",
    productModel: "مدل محصول",
    uomCode: "کد UOM",
    uomName: "نام UOM",
    uomType: "نوع UOM",
    conversionFactor: "ضریب تبدیل",
    baseUom: "UOM پایه",
    isDefault: "پیش فرض",
    conversionType: "نوع تبدیل",
    usedIn: "استفاده شده در",
    entitlementType: "نوع مجوز",
    appliesTo: "اعمال بر",
    scope: "دامنه",
    usageImpact: "اثر استفاده",
    ruleType: "نوع قانون",
    domain: "دامنه",
    priority: "اولویت",
    conditionSummary: "شرط",
    actionSummary: "اقدام",
    severity: "شدت",
    isActive: "فعال است",
    createdBy: "ایجاد توسط",
    createdAt: "ایجاد شده در",
    updatedBy: "به روز شده توسط",
    updatedAt: "به روز شده در",
    version: "نسخه",
    lifecycleState: "وضعیت چرخه عمر"
  },
  boolean: {
    yes: "بله",
    no: "خیر"
  },
  common: {
    none: "-"
  },
  status: {
    active: "فعال",
    inactive: "غیرفعال",
    draft: "پیش نویس",
    deprecated: "منسوخ",
    archived: "بایگانی",
    system: "سیستمی"
  },
  metrics: {
    total: "کل",
    active: "فعال",
    activeShare: "سهم فعال از کل",
    acrossAllCategories: "در همه دسته ها",
    acrossAllProductModels: "در همه مدل های محصول",
    awaitingReview: "در انتظار بررسی",
    filteredCoverage: "پوشش فیلتر شده",
    requiresAttention: "نیازمند توجه",
    draft: "پیش نویس",
    deprecated: "منسوخ",
    inactive: "غیرفعال",
    usedInModels: "استفاده در مدل ها",
    usedInPricing: "استفاده در قیمت گذاری"
  },
  table: {
    actions: "اقدام ها",
    showing: "نمایش {{start}} تا {{end}} از {{total}} رکورد فیلتر شده ({{all}} کل)",
    pageSize: "اندازه صفحه",
    perPage: "{{size}} / صفحه"
  },
  views: {
    listView: "نمای فهرست",
    gridView: "نمای شبکه"
  },
  refresh: {
    default: "بازآوری",
    refreshing: "در حال بازآوری...",
    refreshed: "بازآوری شد",
    failed: "بازآوری ناموفق",
    lastUpdated: "آخرین به روزرسانی: {{time}}"
  },
  rowActions: {
    viewDetails: "مشاهده جزئیات",
    edit: "ویرایش",
    clone: "کپی",
    exportRecord: "خروجی رکورد",
    viewAudit: "مشاهده ممیزی",
    deactivate: "غیرفعال سازی",
    viewUsedIn: "مشاهده استفاده شده در",
    viewImpactAnalysis: "مشاهده تحلیل اثر",
    viewRelationships: "مشاهده رابطه ها",
    viewProductModels: "مشاهده مدل ها",
    viewPricingAuthorities: "مشاهده مراجع قیمت",
    viewPricingRules: "مشاهده قوانین قیمت",
    viewInventories: "مشاهده موجودی ها",
    configureComponents: "پیکربندی اجزا",
    viewConversionRules: "مشاهده قوانین تبدیل",
    viewEntitlementScope: "مشاهده دامنه مجوز",
    configureConditions: "پیکربندی شرط ها",
    configureActions: "پیکربندی اقدام ها"
  },
  drawer: {
    code: "کد",
    close: "بستن کشوی جزئیات",
    generalInformation: "اطلاعات عمومی",
    businessInformation: "اطلاعات کسب و کار",
    usageSummary: "خلاصه استفاده",
    tags: "برچسب ها",
    quickActions: "اقدام های سریع",
    relationshipMap: "نقشه رابطه",
    dependencyList: "فهرست وابستگی",
    tabs: {
      overview: "نمای کلی",
      relatedData: "داده مرتبط",
      impactAnalysis: "تحلیل اثر",
      metadata: "فراداده",
      audit: "ممیزی",
      history: "تاریخچه",
      relationships: "رابطه ها"
    },
    actions: {
      edit: "ویرایش",
      clone: "کپی",
      viewUsedIn: "مشاهده استفاده شده در",
      viewImpactAnalysis: "مشاهده تحلیل اثر",
      viewRelationships: "مشاهده رابطه ها",
      deactivate: "غیرفعال سازی",
      viewProductModels: "مشاهده مدل ها",
      viewPricingAuthorities: "مشاهده مراجع قیمت",
      viewPricingRules: "مشاهده قوانین قیمت",
      viewInventories: "مشاهده موجودی ها",
      configureComponents: "پیکربندی اجزا",
      viewConversionRules: "مشاهده قوانین تبدیل",
      viewAudit: "مشاهده ممیزی",
      viewEntitlementScope: "مشاهده دامنه مجوز",
      configureConditions: "پیکربندی شرط ها",
      configureActions: "پیکربندی اقدام ها"
    }
  },
  related: {
    title: "هوش مرتبط",
    description: "رابطه های رکورد انتخاب شده در تجارت، قیمت، موجودی، دسترسی و تسویه.",
    viewAll: "مشاهده همه"
  },
  relationships: {
    productModels: "مدل های محصول",
    pricingAuthorities: "مراجع قیمت",
    pricingRules: "قوانین قیمت",
    inventories: "موجودی ها",
    quotes: "پیشنهادها",
    contracts: "قراردادها",
    invoices: "فاکتورها",
    recentChanges: "تغییرات اخیر",
    family: "خانواده",
    category: "دسته",
    attributes: "ویژگی ها",
    components: "اجزا",
    bundles: "بسته ها",
    entitlements: "مجوزها",
    rules: "قوانین",
    uomMappings: "نگاشت های UOM",
    categories: "دسته ها",
    channels: "کانال ها",
    parentModel: "مدل والد",
    childComponents: "اجزای فرزند",
    includedComponents: "اجزای شامل شده",
    includedProductModels: "مدل های شامل شده",
    productModel: "مدل محصول",
    baseUom: "UOM پایه",
    conversionRules: "قوانین تبدیل",
    accessGrants: "اعطاهای دسترسی",
    appliesTo: "اعمال بر",
    conditions: "شرط ها",
    actions: "اقدام ها",
    affectedModels: "مدل های متاثر"
  },
  usage: {
    productModels: "مدل های محصول",
    pricingAuthorities: "مراجع قیمت",
    inventories: "موجودی ها",
    contracts: "قراردادها",
    invoices: "فاکتورها",
    active: "فعال",
    linked: "مرتبط",
    filtered: "فیلتر شده"
  },
  impact: {
    pricing: "اثر قیمت گذاری",
    inventory: "اثر موجودی",
    entitlement: "اثر مجوز",
    settlement: "اثر تسویه",
    affectedRecords: "رکوردهای متاثر"
  },
  audit: {
    time: "زمان",
    field: "فیلد",
    oldValue: "مقدار قبلی",
    newValue: "مقدار جدید",
    actor: "عامل",
    record: "رکورد",
    status: "وضعیت",
    relationships: "رابطه ها",
    usage: "استفاده"
  },
  history: {
    published: "منتشر شد",
    updated: "به روز شد",
    created: "ایجاد شد",
    cloned: "کپی شد"
  },
  modals: {
    cancel: "انصراف",
    title: "{{entity}}",
    create: {
      productModels: {
        description: "ایجاد مدل محصول با خانواده، دسته، UOM، اثر و کانال."
      },
      productFamilies: {
        description: "ایجاد خانواده محصول برای سازماندهی مدل ها."
      },
      productCategories: {
        description: "ایجاد دسته زیر خانواده انتخاب شده."
      },
      productAttributes: {
        description: "ایجاد ویژگی با نوع داده، نوع واحد و کاربرد."
      },
      productComponents: {
        description: "ایجاد جزء قابل استفاده مجدد."
      },
      productBundles: {
        description: "ایجاد بسته از اجزا و رفتار قیمت."
      },
      uomMapping: {
        description: "ایجاد نگاشت UOM و قانون تبدیل."
      },
      entitlements: {
        description: "ایجاد مجوز برای دسترسی، مزیت، سیاست یا تخفیف."
      },
      productRules: {
        description: "ایجاد قانون با شرط و اقدام."
      }
    },
    edit: {
      title: "ویرایش {{entity}}",
      description: "به روزرسانی {{entity}} انتخاب شده به صورت محلی."
    },
    clone: {
      title: "کپی {{entity}}",
      description: "ایجاد کپی محلی از {{entity}} انتخاب شده."
    },
    import: {
      title: "ورودی رکوردهای {{entity}}",
      description: "پیش نمایش رکوردهای {{entity}} به صورت محلی."
    },
    export: {
      title: "خروجی رکوردهای {{entity}}",
      description: "آماده سازی خروجی محلی برای رکوردهای {{entity}}."
    },
    compare: {
      title: "مقایسه رکوردهای {{entity}}",
      description: "مقایسه محلی رکوردهای {{entity}}."
    },
    deactivate: {
      title: "غیرفعال سازی {{entity}}",
      description: "غیرفعال یا بایگانی کردن {{entity}} به صورت محلی."
    },
    relatedList: {
      title: "رکوردهای مرتبط {{entity}}",
      description: "باز کردن رکوردهای مرتبط برای {{entity}} انتخاب شده."
    },
    columns: {
      localOnly: "انتخاب ستون فقط تب فعلی را تغییر می دهد."
    },
    fields: {
      selectValue: "انتخاب مقدار",
      cloneRelationships: "کپی رابطه ها",
      cloneMetadata: "کپی فراداده",
      importScope: "دامنه ورودی"
    },
    confirm: {
      create: "ایجاد",
      edit: "ذخیره تغییرات",
      clone: "کپی",
      import: "ورودی",
      export: "خروجی",
      compare: "مقایسه",
      columns: "اعمال",
      deactivate: "غیرفعال سازی",
      relatedList: "باز کردن"
    }
  },
  import: {
    currentFiltered: "نتایج فیلتر شده فعلی",
    format: "قالب",
    dropzone: "فایل را انتخاب کنید یا اینجا بکشید",
    validation: "پیش نمایش، اعتبارسنجی، اجرای آزمایشی و به روزرسانی موجودها محلی است.",
    updateExisting: "به روزرسانی رکوردهای موجود",
    dryRun: "اول اجرای آزمایشی"
  },
  export: {
    scope: "دامنه خروجی",
    format: "قالب",
    currentFiltered: "رکوردهای فیلتر شده فعلی",
    selectedRecords: "رکوردهای انتخاب شده ({{count}})",
    allRecords: "همه رکوردها",
    pdfSummary: "خلاصه PDF",
    includes: {
      metadata: "فراداده",
      relatedData: "داده مرتبط",
      usageSummary: "خلاصه استفاده",
      auditSummary: "خلاصه ممیزی"
    }
  },
  compare: {
    primary: "رکورد اصلی",
    with: "مقایسه با",
    selectedRecords: "رکوردهای انتخاب شده ({{count}})",
    differences: "تفاوت ها",
    relationships: "رابطه ها",
    usage: "استفاده",
    metadata: "فراداده"
  },
  deactivate: {
    warning: "این رکورد در تراکنش های جدید استفاده نخواهد شد.",
    impact: "ارجاعات موجود در دموی محلی قابل مشاهده می مانند.",
    reason: "دلیل",
    reasonPlaceholder: "دلیل را وارد کنید"
  },
  validation: {
    reasonRequired: "دلیل برای غیرفعال سازی الزامی است.",
    requiredFields: "فیلدهای الزامی را کامل کنید.",
    fieldRequired: "این فیلد الزامی است.",
    uniqueCode: "کد باید در این تب یکتا باشد.",
    codeFormat: "از حروف، عدد، خط تیره یا زیرخط استفاده کنید.",
    invalidLookup: "یک مقدار معتبر از فهرست انتخاب کنید.",
    validDateRange: "تاریخ پایان باید بعد از تاریخ شروع باشد.",
    positiveNumber: "عددی بزرگتر از صفر وارد کنید.",
    priorityRange: "اولویت باید بین ۱ تا ۹۹۹ باشد.",
    bundleComponents: "بسته باید حداقل دو جزء داشته باشد.",
    defaultUomUnique: "برای هر مدل محصول فقط یک UOM پیش فرض مجاز است.",
    ruleConditionRequired: "قوانین فعال به شرط نیاز دارند.",
    ruleActionRequired: "قوانین فعال به اقدام نیاز دارند."
  },
  messages: {
    bulkCreateReady: "ایجاد گروهی در دموی محلی از جریان ورودی استفاده می کند.",
    refreshFailed: "بازآوری در حالت دمو ناموفق شد. بدون Shift دوباره تلاش کنید.",
    refreshCompleted: "تب فعلی محلی بازآوری شد.",
    created: "رکورد محلی ایجاد شد.",
    edited: "رکورد محلی به روز شد.",
    cloned: "رکورد محلی کپی شد.",
    importPreviewReady: "ردیف پیش نمایش ورودی محلی اضافه شد.",
    exportPrepared: "خروجی محلی آماده شد.",
    exportPreparedSummary: "خروجی برای {{count}} رکورد به صورت CSV آماده شد.",
    compareReady: "مقایسه محلی آماده شد.",
    columnsUpdated: "ستون های تب فعلی به روز شد.",
    deactivated: "وضعیت رکورد محلی به روز شد.",
    relatedListOpened: "رکوردهای مرتبط محلی باز شد.",
    filtersReset: "فیلترهای تب فعلی پاک شد.",
    filtersApplied: "فیلترهای تب فعلی اعمال شد."
  },
  bulk: {
    selectedCount: "{{count}} انتخاب شده",
    exportSelected: "خروجی انتخاب شده ها",
    compareSelected: "مقایسه انتخاب شده ها",
    cloneSelected: "کپی انتخاب شده ها",
    deactivateSelected: "غیرفعال سازی انتخاب شده ها",
    clearSelection: "پاک کردن انتخاب",
    selectAll: "انتخاب همه رکوردهای قابل مشاهده",
    selectRow: "انتخاب ردیف",
    states: {
      default: "اقدام های گروهی آماده است",
      processing: "اقدام گروهی در حال انجام است",
      success: "اقدام گروهی با موفقیت انجام شد",
      error: "اقدام گروهی ناموفق بود. دوباره تلاش کنید.",
      allPageSelected: "همه رکوردهای این صفحه انتخاب شده اند",
      partialPageSelected: "بخشی از رکوردهای این صفحه انتخاب شده اند"
    },
    errors: {
      compareCount: "مقایسه به ۲ تا ۴ رکورد انتخاب شده نیاز دارد.",
      processing: "تا پایان اقدام گروهی فعلی صبر کنید.",
      reasonRequired: "دلیل برای غیرفعال سازی الزامی است."
    },
    success: {
      exportCompleted: "خروجی با موفقیت کامل شد",
      exportSummary: "خروجی برای {{count}} رکورد به صورت {{format}} کامل شد.",
      compareCompleted: "مقایسه محلی آماده شد",
      cloneCompleted: "رکوردهای انتخاب شده محلی کپی شدند",
      deactivateCompleted: "رکوردهای انتخاب شده محلی به روز شدند"
    },
    modals: {
      close: "بستن",
      includeRelatedData: "شامل داده مرتبط",
      export: {
        title: "خروجی رکوردهای انتخاب شده",
        description: "خروجی محلی برای رکوردهای انتخاب شده آماده کنید.",
        selectedCount: "شما در حال خروجی گرفتن از {{count}} رکورد انتخاب شده هستید.",
        scope: "دامنه خروجی",
        format: "قالب خروجی",
        confirm: "خروجی",
        scopes: {
          selected: "رکوردهای انتخاب شده ({{count}})",
          filtered: "رکوردهای فیلتر شده فعلی",
          all: "همه رکوردهای دمو"
        },
        formats: {
          csv: "CSV",
          xlsx: "XLSX",
          pdf: "PDF"
        }
      },
      exportProgress: {
        title: "خروجی در حال انجام",
        description: "فایل خروجی محلی آماده می شود.",
        message: "لطفا تا آماده شدن خروجی صبر کنید.",
        preparing: "آماده سازی داده",
        generating: "تولید فایل",
        finalizing: "نهایی سازی"
      },
      exportComplete: {
        title: "خروجی کامل شد",
        description: "خروجی شما به صورت محلی آماده است.",
        fileSummary: "خلاصه فایل",
        download: "دانلود"
      },
      compare: {
        title: "مقایسه رکوردهای انتخاب شده",
        description: "۲ تا ۴ رکورد انتخاب شده را کنار هم مقایسه کنید.",
        selectedRecords: "رکوردهای انتخاب شده",
        focus: "تمرکز مقایسه",
        confirm: "مقایسه",
        focusOptions: {
          allFields: "همه فیلدها",
          relationships: "رابطه ها",
          usage: "استفاده"
        }
      },
      clone: {
        title: "کپی رکوردهای انتخاب شده",
        description: "برای رکوردهای انتخاب شده کپی محلی بسازید.",
        selectedCount: "{{count}} انتخاب شده",
        behavior: "رفتار کپی",
        prefix: "پیشوند (اختیاری)",
        prefixPlaceholder: "کپی از",
        openCloned: "باز کردن رکوردهای کپی شده پس از ایجاد",
        confirm: "کپی",
        behaviors: {
          newRecords: "ایجاد به عنوان رکورد جدید",
          drafts: "ایجاد به عنوان پیش نویس"
        }
      },
      deactivate: {
        title: "غیرفعال سازی رکوردهای انتخاب شده",
        description: "رکوردهای انتخاب شده را محلی غیرفعال یا بایگانی کنید.",
        selectedCount: "{{count}} انتخاب شده",
        behavior: "رفتار غیرفعال سازی",
        warning: "این رکوردها پس از تایید از فهرست های فعال پنهان می شوند.",
        confirm: "غیرفعال سازی",
        behaviors: {
          soft: "غیرفعال سازی نرم",
          archive: "بایگانی"
        }
      }
    }
  },
  charts: {
    relationships: "رابطه ها",
    impact: "اثر"
  }
} as const;
