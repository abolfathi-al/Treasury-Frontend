export const consumerManagementWorkspaceFa = {
  navTitle: "مدیریت مصرف کننده",
  title: "مدیریت مصرف کننده vNext",
  version: "vNext",
  subtitle: "مدیریت مصرف کنندگان، پروفایل ها، بخش ها، ترجیحات، دسترسی، امنیت هویت، دستگاه ها، نشست ها، وفاداری و لاگ های حسابرسی.",
  actions: {
    export: "خروجی",
    import: "ورودی",
    view: "نمایش",
    edit: "ویرایش",
    clone: "کپی"
  },
  toolbar: {
    createMenu: "گزینه های ایجاد",
    createCurrent: "ایجاد {{entity}}",
    createViaImport: "ایجاد از طریق ورود",
    createInBulk: "ایجاد گروهی"
  },
  tabs: {
    consumers: "مصرف کنندگان",
    consumerGroups: "گروه های مصرف کننده",
    segments: "بخش ها",
    identities: "هویت ها",
    households: "خانوارها",
    profiles: "پروفایل ها",
    preferences: "ترجیحات",
    consents: "رضایت ها",
    loyaltyPrograms: "برنامه های وفاداری",
    accessEntitlements: "دسترسی و امتیازها",
    authenticationMethods: "روش های احراز هویت",
    devices: "دستگاه ها",
    sessions: "نشست ها",
    auditLogs: "لاگ های حسابرسی"
  },
  drawerTypes: {
    consumerCentric: "مصرف کننده محور",
    identitySecurity: "هویت و امنیت",
    preferencePrivacy: "ترجیحات و حریم خصوصی",
    loyalty: "وفاداری",
    accessEntitlements: "دسترسی و امتیازها",
    auditCompliance: "حسابرسی و تطبیق"
  },
  entities: {
    consumers: {
      title: "مصرف کنندگان",
      subtitle: "مدیریت مصرف کنندگان در همه کانال ها.",
      plural: "مصرف کنندگان",
      singular: "مصرف کننده",
      create: "ایجاد مصرف کننده",
      compareButton: "مقایسه مصرف کنندگان",
      searchPlaceholder: "جستجوی مصرف کنندگان بر اساس نام، ایمیل، تلفن یا شناسه..."
    },
    consumerGroups: {
      title: "گروه های مصرف کننده",
      subtitle: "مدیریت گروه ها و سلسله مراتب مصرف کننده.",
      plural: "گروه های مصرف کننده",
      singular: "گروه مصرف کننده",
      create: "ایجاد گروه",
      compareButton: "مقایسه گروه ها",
      searchPlaceholder: "جستجوی گروه ها بر اساس نام، کد یا توضیح..."
    },
    segments: {
      title: "بخش ها",
      subtitle: "مدیریت بخش های مصرف کننده برای هدف گیری و کنترل دسترسی.",
      plural: "بخش ها",
      singular: "بخش",
      create: "ایجاد بخش",
      compareButton: "مقایسه بخش ها",
      searchPlaceholder: "جستجوی بخش ها بر اساس نام، کد یا توضیح..."
    },
    identities: {
      title: "هویت ها",
      subtitle: "مدیریت هویت های دیجیتال مصرف کننده.",
      plural: "هویت ها",
      singular: "هویت",
      create: "ایجاد هویت",
      compareButton: "مقایسه هویت ها",
      searchPlaceholder: "جستجوی هویت ها بر اساس ایمیل، تلفن، شناسه یا نام کاربری..."
    },
    households: {
      title: "خانوارها",
      subtitle: "مدیریت خانوارها و واحدهای خانوادگی.",
      plural: "خانوارها",
      singular: "خانوار",
      create: "ایجاد خانوار",
      compareButton: "مقایسه خانوارها",
      searchPlaceholder: "جستجوی خانوارها بر اساس نام، کد، ایمیل، تلفن یا آدرس..."
    },
    profiles: {
      title: "پروفایل ها",
      subtitle: "مدیریت ویژگی های پروفایل مصرف کننده.",
      plural: "پروفایل ها",
      singular: "پروفایل",
      create: "ایجاد پروفایل",
      compareButton: "مقایسه پروفایل ها",
      searchPlaceholder: "جستجوی پروفایل ها بر اساس نام، ویژگی یا مقدار..."
    },
    preferences: {
      title: "ترجیحات",
      subtitle: "مدیریت ترجیحات ارتباطی، محتوا و تجربه.",
      plural: "ترجیحات",
      singular: "ترجیح",
      create: "ایجاد ترجیح",
      compareButton: "مقایسه ترجیحات",
      searchPlaceholder: "جستجوی ترجیحات بر اساس نام، کد یا توضیح..."
    },
    consents: {
      title: "رضایت ها",
      subtitle: "مدیریت رضایت ها و مجوزهای حریم خصوصی.",
      plural: "رضایت ها",
      singular: "رضایت",
      create: "ایجاد رضایت",
      compareButton: "مقایسه رضایت ها",
      searchPlaceholder: "جستجوی رضایت ها بر اساس نام، کد یا مصرف کننده..."
    },
    loyaltyPrograms: {
      title: "برنامه های وفاداری",
      subtitle: "مدیریت برنامه ها، سطوح، مزایا و قوانین وفاداری.",
      plural: "برنامه های وفاداری",
      singular: "برنامه وفاداری",
      create: "ایجاد برنامه وفاداری",
      compareButton: "مقایسه برنامه ها",
      searchPlaceholder: "جستجوی برنامه های وفاداری بر اساس نام یا کد..."
    },
    accessEntitlements: {
      title: "دسترسی و امتیازها",
      subtitle: "مدیریت حقوق دسترسی، امتیازها و محدودیت ها.",
      plural: "دسترسی و امتیازها",
      singular: "دسترسی و امتیاز",
      create: "اعطای دسترسی",
      compareButton: "مقایسه امتیازها",
      searchPlaceholder: "جستجوی امتیاز، کد یا مصرف کننده..."
    },
    authenticationMethods: {
      title: "روش های احراز هویت",
      subtitle: "مدیریت روش های احراز هویت، اعتبارنامه و MFA.",
      plural: "روش های احراز هویت",
      singular: "روش احراز هویت",
      create: "افزودن روش احراز هویت",
      compareButton: "مقایسه روش ها",
      searchPlaceholder: "جستجوی روش ها بر اساس نام، کد یا مصرف کننده..."
    },
    devices: {
      title: "دستگاه ها",
      subtitle: "مدیریت دستگاه های مصرف کننده، سلامت و استفاده.",
      plural: "دستگاه ها",
      singular: "دستگاه",
      create: "ثبت دستگاه",
      compareButton: "مقایسه دستگاه ها",
      searchPlaceholder: "جستجوی دستگاه ها بر اساس نام، شناسه یا مصرف کننده..."
    },
    sessions: {
      title: "نشست ها",
      subtitle: "پایش نشست های کاربر و چرخه عمر آنها.",
      plural: "نشست ها",
      singular: "نشست",
      create: "ایجاد نشست",
      compareButton: "تحلیل نشست",
      searchPlaceholder: "جستجوی نشست بر اساس شناسه، کاربر، دستگاه یا کانال..."
    },
    auditLogs: {
      title: "لاگ های حسابرسی",
      subtitle: "حسابرسی و ردیابی متمرکز فعالیت های مصرف کننده.",
      plural: "لاگ های حسابرسی",
      singular: "رویداد حسابرسی",
      create: "ایجاد بررسی",
      compareButton: "ایجاد بررسی",
      searchPlaceholder: "جستجوی رویداد بر اساس شناسه، مصرف کننده، عامل یا موجودیت..."
    }
  },
  metrics: {
    totalConsumers: "کل مصرف کنندگان",
    activeConsumers: "مصرف کنندگان فعال",
    newThisMonth: "جدید این ماه",
    verifiedConsumers: "مصرف کنندگان تایید شده",
    loyaltyMembers: "اعضای وفاداری",
    highValueConsumers: "مصرف کنندگان ارزشمند",
    totalGroups: "کل گروه ها",
    activeGroups: "گروه های فعال",
    avgGroupSize: "میانگین اندازه گروه",
    totalSegments: "کل بخش ها",
    activeSegments: "بخش های فعال",
    consumersInSegments: "مصرف کنندگان در بخش ها",
    overlappingSegments: "بخش های همپوشان",
    totalIdentities: "کل هویت ها",
    activeIdentities: "هویت های فعال",
    verifiedIdentities: "هویت های تایید شده",
    mfaEnabled: "MFA فعال",
    totalHouseholds: "کل خانوارها",
    activeHouseholds: "خانوارهای فعال",
    totalMembers: "کل اعضا",
    avgHouseholdSize: "میانگین اندازه خانوار",
    totalProfiles: "کل پروفایل ها",
    activeProfiles: "پروفایل های فعال",
    profilesInUse: "پروفایل های در حال استفاده",
    highImpactProfiles: "پروفایل های اثرگذار",
    totalPreferences: "کل ترجیحات",
    activePreferences: "ترجیحات فعال",
    communicationPreferences: "ترجیحات ارتباطی",
    outdatedPreferences: "ترجیحات قدیمی",
    totalConsents: "کل رضایت ها",
    activeConsents: "رضایت های فعال",
    revokedConsents: "رضایت های لغو شده",
    expiredConsents: "رضایت های منقضی",
    totalPrograms: "کل برنامه ها",
    activePrograms: "برنامه های فعال",
    totalLiability: "تعهد",
    totalEntitlements: "کل امتیازها",
    activeEntitlements: "امتیازهای فعال",
    accessGrants: "اعطاهای دسترسی",
    restrictedAccess: "دسترسی محدود",
    totalMethods: "کل روش ها",
    activeMethods: "روش های فعال",
    highRiskMethods: "روش های پرریسک",
    totalDevices: "کل دستگاه ها",
    activeDevices: "دستگاه های فعال",
    trustedDevices: "دستگاه های مورد اعتماد",
    blockedDevices: "دستگاه های مسدود",
    totalSessions: "کل نشست ها",
    activeSessions: "نشست های فعال",
    webSessions: "نشست های وب",
    suspiciousSessions: "نشست های مشکوک",
    totalAuditEvents: "کل رویدادهای حسابرسی",
    todayEvents: "رویدادهای امروز",
    securityEvents: "رویدادهای امنیتی",
    highRiskEvents: "رویدادهای پرریسک"
  },
  metricDetails: {
    totalConsumers: "در همه فضاها",
    activeConsumers: "نمونه فعال محلی",
    newThisMonth: "رشد اخیر",
    verifiedConsumers: "هویت های تایید شده",
    loyaltyMembers: "اعضای ثبت شده",
    highValueConsumers: "بخش ارزشمند",
    totalGroups: "در همه فضاها",
    activeGroups: "گروه های فعال",
    avgGroupSize: "مصرف کننده در هر گروه",
    totalSegments: "در همه فضاها",
    activeSegments: "بخش های فعال",
    consumersInSegments: "مصرف کنندگان تخصیص یافته",
    overlappingSegments: "نیازمند بازبینی",
    totalIdentities: "در همه فضاها",
    activeIdentities: "هویت های فعال",
    verifiedIdentities: "هویت های تایید شده",
    mfaEnabled: "پوشش MFA",
    totalHouseholds: "در همه فضاها",
    activeHouseholds: "خانوارهای فعال",
    totalMembers: "در همه خانوارها",
    avgHouseholdSize: "عضو در هر خانوار",
    totalProfiles: "در همه فضاها",
    activeProfiles: "تعاریف فعال",
    profilesInUse: "در استفاده فعال",
    highImpactProfiles: "فیلدهای اثرگذار",
    totalPreferences: "در همه فضاها",
    activePreferences: "ترجیحات فعال",
    communicationPreferences: "تنظیمات ارتباطی",
    outdatedPreferences: "نیازمند بازبینی",
    totalConsents: "در همه فضاها",
    activeConsents: "در حال حاضر فعال",
    revokedConsents: "مجوزهای لغو شده",
    expiredConsents: "مجوزهای منقضی",
    totalPrograms: "در همه فضاها",
    activePrograms: "برنامه های فعال",
    totalLiability: "ارزش تخمینی",
    totalEntitlements: "در فضاها",
    activeEntitlements: "در حال حاضر فعال",
    accessGrants: "همه زمان",
    restrictedAccess: "امتیازهای محدود",
    totalMethods: "در فضاها",
    activeMethods: "روش های فعال",
    highRiskMethods: "نیازمند بازبینی",
    totalDevices: "در فضاها",
    activeDevices: "فعال اخیرا",
    trustedDevices: "مورد اعتماد",
    blockedDevices: "مسدود",
    totalSessions: "در فضاها",
    activeSessions: "در حال حاضر فعال",
    webSessions: "کانال وب",
    suspiciousSessions: "نشست های علامت خورده",
    totalAuditEvents: "همه زمان",
    todayEvents: "فقط امروز",
    securityEvents: "مرتبط با امنیت",
    highRiskEvents: "رویدادهای پرریسک"
  },
  filters: {
    search: "جستجو",
    all: "همه",
    moreFilters: "فیلترهای بیشتر",
    clearAll: "پاک کردن همه",
    close: "بستن فیلترهای بیشتر",
    none: "برای این تب فیلتر اضافی وجود ندارد.",
    apply: "اعمال فیلترها",
    status: "وضعیت",
    segment: "بخش",
    country: "کشور",
    channel: "کانال",
    verification: "تایید",
    loyaltyTier: "سطح وفاداری",
    groupType: "نوع گروه",
    parentGroup: "گروه والد",
    segmentType: "نوع بخش",
    category: "دسته",
    baseSegment: "بخش پایه",
    identityType: "نوع هویت",
    verificationStatus: "وضعیت تایید",
    authenticationMethod: "روش احراز هویت",
    riskLevel: "سطح ریسک",
    householdType: "نوع خانوار",
    city: "شهر",
    size: "اندازه",
    profileType: "نوع پروفایل",
    attributeGroup: "گروه ویژگی",
    preferenceType: "نوع ترجیح",
    lastUpdated: "آخرین بروزرسانی",
    consentType: "نوع رضایت",
    legalBasis: "مبنای قانونی",
    consumerSegment: "بخش مصرف کننده",
    consentScope: "دامنه رضایت",
    expirationStatus: "وضعیت انقضا",
    programType: "نوع برنامه",
    loyaltyCurrency: "واحد وفاداری",
    accessType: "نوع دسترسی",
    productScope: "دامنه محصول",
    consumerGroup: "گروه مصرف کننده",
    methodType: "نوع روش",
    mfaEnabled: "MFA فعال",
    createdBy: "ایجاد شده توسط",
    deviceType: "نوع دستگاه",
    platform: "پلتفرم",
    os: "سیستم عامل",
    trustLevel: "سطح اعتماد",
    authentication: "احراز هویت",
    dateRange: "بازه تاریخ",
    eventType: "نوع رویداد",
    consumer: "مصرف کننده",
    actor: "عامل",
    severity: "شدت"
  },
  columns: {
    title: "ستون ها",
    description: "ستون های قابل نمایش این تب را انتخاب کنید.",
    close: "بستن ستون ها",
    searchPlaceholder: "جستجوی ستون ها...",
    reset: "بازنشانی",
    apply: "اعمال",
    name: "نام",
    email: "ایمیل / تلفن",
    status: "وضعیت",
    segment: "بخش",
    country: "کشور",
    loyaltyTier: "سطح وفاداری",
    lastActive: "آخرین فعالیت",
    lifetimeValue: "ارزش عمر",
    verification: "تایید",
    code: "کد",
    groupType: "نوع گروه",
    parentGroup: "گروه والد",
    consumers: "مصرف کنندگان",
    countries: "کشورها",
    channel: "کانال",
    segmentType: "نوع بخش",
    category: "دسته",
    baseSegment: "بخش پایه",
    priority: "اولویت",
    identityType: "نوع هویت",
    primaryContact: "مخاطب اصلی",
    verificationStatus: "وضعیت تایید",
    authenticationMethod: "روش احراز",
    mfa: "MFA",
    riskLevel: "ریسک",
    householdType: "نوع خانوار",
    city: "شهر",
    size: "اندازه",
    totalSpend: "کل هزینه",
    profileType: "نوع پروفایل",
    attributeGroup: "گروه ویژگی",
    dataType: "نوع داده",
    source: "منبع",
    isPii: "PII",
    usageCount: "تعداد استفاده",
    preferenceType: "نوع ترجیح",
    consentScope: "دامنه",
    defaultValue: "مقدار پیش فرض",
    consentType: "نوع رضایت",
    consumer: "مصرف کننده",
    legalBasis: "مبنای قانونی",
    grantedAt: "زمان اعطا",
    expiresAt: "انقضا",
    programType: "نوع برنامه",
    loyaltyCurrency: "واحد وفاداری",
    tiers: "سطوح",
    activeMembers: "اعضای فعال",
    engagementScore: "امتیاز تعامل",
    accessType: "نوع دسترسی",
    consumerGroup: "گروه مصرف کننده",
    productScope: "دامنه محصول",
    grantedBy: "اعطا شده توسط",
    validFrom: "معتبر از",
    validTo: "معتبر تا",
    methodType: "نوع روش",
    mfaEnabled: "MFA فعال",
    lastUsed: "آخرین استفاده",
    createdBy: "ایجاد شده توسط",
    deviceType: "نوع دستگاه",
    platform: "پلتفرم",
    os: "سیستم عامل",
    trustLevel: "اعتماد",
    lastSeen: "آخرین مشاهده",
    device: "دستگاه",
    location: "مکان",
    ipAddress: "آدرس IP",
    authentication: "احراز هویت",
    startTime: "شروع",
    duration: "مدت",
    timestamp: "زمان",
    actor: "عامل",
    eventType: "نوع رویداد",
    entity: "موجودیت",
    action: "اقدام",
    severity: "شدت"
  },
  fields: {
    name: "نام",
    code: "کد",
    email: "ایمیل",
    phone: "تلفن",
    status: "وضعیت",
    segment: "بخش",
    country: "کشور",
    channel: "کانال",
    verification: "تایید",
    loyaltyTier: "سطح وفاداری",
    riskLevel: "سطح ریسک",
    healthScore: "امتیاز سلامت",
    lastUpdated: "آخرین بروزرسانی",
    consumers: "مصرف کنندگان",
    members: "اعضا",
    consumerCount: "تعداد مصرف کننده",
    accessGrants: "اعطاهای دسترسی",
    devices: "دستگاه ها",
    sessions: "نشست ها",
    lastActive: "آخرین فعالیت",
    auditEvents: "رویدادهای حسابرسی",
    lastChange: "آخرین تغییر",
    profiles: "پروفایل ها",
    preferences: "ترجیحات",
    consents: "رضایت ها",
    loyaltyPrograms: "برنامه های وفاداری",
    accessEntitlements: "دسترسی و امتیازها",
    auditLogs: "لاگ های حسابرسی",
    primaryContact: "مخاطب اصلی",
    consumer: "مصرف کننده",
    consumerGroup: "گروه مصرف کننده",
    groupType: "نوع گروه",
    parentGroup: "گروه والد",
    countries: "کشورها",
    category: "دسته",
    segmentType: "نوع بخش",
    baseSegment: "بخش پایه",
    identityType: "نوع هویت",
    verificationStatus: "وضعیت تایید",
    authenticationMethod: "روش احراز هویت",
    mfa: "MFA",
    householdType: "نوع خانوار",
    city: "شهر",
    size: "اندازه",
    profileType: "نوع پروفایل",
    attributeGroup: "گروه ویژگی",
    dataType: "نوع داده",
    isPii: "PII",
    preferenceType: "نوع ترجیح",
    defaultValue: "مقدار پیش فرض",
    consentType: "نوع رضایت",
    legalBasis: "مبنای قانونی",
    consentScope: "دامنه رضایت",
    expiresAt: "انقضا",
    programType: "نوع برنامه",
    loyaltyCurrency: "واحد وفاداری",
    tiers: "سطوح",
    productScope: "دامنه محصول",
    accessType: "نوع دسترسی",
    validTo: "معتبر تا",
    methodType: "نوع روش",
    mfaEnabled: "MFA فعال",
    deviceType: "نوع دستگاه",
    platform: "پلتفرم",
    os: "سیستم عامل",
    trustLevel: "سطح اعتماد",
    authentication: "احراز هویت",
    eventType: "نوع رویداد",
    actor: "عامل",
    severity: "شدت",
    reason: "دلیل"
  },
  relationships: {
    profiles: "پروفایل ها",
    preferences: "ترجیحات",
    consents: "رضایت ها",
    loyaltyPrograms: "برنامه های وفاداری",
    accessEntitlements: "دسترسی و امتیازها",
    devices: "دستگاه ها",
    auditLogs: "لاگ های حسابرسی"
  },
  status: {
    active: "فعال",
    inactive: "غیرفعال",
    pending: "در انتظار",
    verified: "تایید شده",
    unverified: "تایید نشده",
    suspended: "تعلیق شده",
    revoked: "لغو شده",
    expired: "منقضی",
    restricted: "محدود",
    blocked: "مسدود",
    trusted: "مورد اعتماد",
    untrusted: "نامطمئن",
    terminated: "خاتمه یافته",
    success: "موفق",
    failed: "ناموفق",
    draft: "پیش نویس",
    deprecated: "منسوخ",
    low: "کم",
    medium: "متوسط",
    high: "زیاد",
    critical: "بحرانی",
    good: "خوب",
    warning: "هشدار"
  },
  table: {
    showing: "نمایش {{start}} تا {{end}} از {{total}} رکورد",
    actions: "اقدامات",
    pageSize: "اندازه صفحه",
    perPage: "{{size}} / صفحه"
  },
  views: {
    listView: "نمای لیست",
    gridView: "نمای کارت"
  },
  common: {
    none: "-"
  },
  boolean: {
    yes: "بله",
    no: "خیر"
  },
  bulk: {
    selectedCount: "{{count}} انتخاب شده",
    exportSelected: "خروجی انتخاب شده",
    compareSelected: "مقایسه انتخاب شده",
    cloneSelected: "کپی انتخاب شده",
    deactivateSelected: "غیرفعال سازی انتخاب شده",
    selectAll: "انتخاب همه رکوردهای قابل نمایش",
    selectRow: "انتخاب ردیف",
    clearSelection: "پاک کردن انتخاب",
    states: {
      default: "{{count}} انتخاب شده",
      allPageSelected: "همه رکوردهای قابل نمایش انتخاب شدند",
      partialPageSelected: "{{count}} در این صفحه انتخاب شده"
    },
    errors: {
      emptySelection: "حداقل یک رکورد انتخاب کنید.",
      compareCount: "مقایسه به ۲ تا ۴ رکورد نیاز دارد.",
      processing: "عملیات گروهی در حال پردازش است."
    },
    success: {
      exportCompleted: "خروجی با موفقیت کامل شد",
      compareCompleted: "مقایسه محلی آماده شد",
      cloneCompleted: "رکوردهای انتخاب شده به صورت محلی کپی شدند",
      deactivateCompleted: "رکوردهای انتخاب شده به روز شدند"
    },
    modals: {
      export: {
        title: "خروجی رکوردهای انتخاب شده",
        description: "خروجی رکوردهای انتخاب شده مدیریت مصرف کننده.",
        selectedCount: "خروجی {{count}} رکورد انتخاب شده.",
        format: "فرمت خروجی",
        formats: {
          csv: "CSV",
          xlsx: "XLSX",
          pdf: "PDF"
        }
      },
      exportProgress: {
        title: "خروجی در حال انجام",
        description: "آماده سازی رکوردهای محلی انتخاب شده.",
        message: "لطفا تا آماده شدن خروجی صبر کنید.",
        preparing: "آماده سازی داده"
      },
      exportComplete: {
        title: "خروجی کامل شد",
        description: "خروجی نمایشی محلی آماده است.",
        fileSummary: "خلاصه فایل",
        download: "دانلود"
      },
      compare: {
        title: "مقایسه رکوردهای انتخاب شده",
        description: "مقایسه رکوردهای انتخاب شده."
      },
      clone: {
        title: "کپی رکوردهای انتخاب شده",
        description: "ایجاد کپی محلی.",
        selectedCount: "کپی {{count}} رکورد انتخاب شده.",
        prefix: "پیشوند",
        prefixPlaceholder: "کپی از"
      },
      deactivate: {
        title: "غیرفعال سازی رکوردهای انتخاب شده",
        description: "غیرفعال سازی رکوردهای محلی.",
        selectedCount: "غیرفعال سازی {{count}} رکورد انتخاب شده."
      }
    }
  },
  rowActions: {
    viewDetails: "نمایش جزئیات",
    edit: "ویرایش",
    clone: "کپی",
    exportRecord: "خروجی رکورد",
    viewAudit: "نمایش حسابرسی",
    deactivate: "غیرفعال سازی",
    addMembers: "افزودن اعضا",
    blockDevice: "مسدود کردن دستگاه",
    compare: "مقایسه",
    enableMfa: "فعال سازی MFA",
    endSession: "پایان نشست",
    exportEvents: "خروجی رویدادها",
    grantAdditional: "اعطای بیشتر",
    manageBenefits: "مدیریت مزایا",
    manageTiers: "مدیریت سطوح",
    openInvestigation: "باز کردن بررسی",
    resetCredential: "بازنشانی اعتبارنامه",
    resetPassword: "بازنشانی رمز",
    resetTrust: "بازنشانی اعتماد",
    revokeConsent: "لغو رضایت",
    viewActivity: "نمایش فعالیت",
    viewBookings: "نمایش رزروها",
    viewCampaigns: "نمایش کمپین ها",
    viewConsumer: "نمایش مصرف کننده",
    viewConsumers: "نمایش مصرف کنندگان",
    viewDevices: "نمایش دستگاه ها",
    viewFullProfile: "نمایش پروفایل کامل",
    viewIdentity: "نمایش هویت",
    viewMembers: "نمایش اعضا",
    viewPreferences: "نمایش ترجیحات",
    viewProducts: "نمایش محصولات",
    viewRules: "نمایش قوانین",
    viewSessions: "نمایش نشست ها",
    viewTransactions: "نمایش تراکنش ها",
    viewUsage: "نمایش استفاده"
  },
  drawerActions: {
    edit: "ویرایش",
    clone: "کپی",
    viewAudit: "نمایش حسابرسی",
    deactivate: "غیرفعال سازی"
  },
  drawerTabs: {
    overview: "نمای کلی",
    composition: "ترکیب",
    activity: "فعالیت",
    access: "دسترسی",
    history: "تاریخچه",
    relationships: "روابط",
    security: "امنیت",
    usage: "استفاده",
    audit: "حسابرسی",
    definition: "تعریف",
    impact: "اثر",
    tiers: "سطوح",
    benefits: "مزایا",
    earnRules: "قوانین کسب",
    burnRules: "قوانین مصرف",
    members: "اعضا",
    performance: "عملکرد",
    scope: "دامنه",
    entitlements: "امتیازها",
    restrictions: "محدودیت ها",
    context: "زمینه",
    changes: "تغییرات",
    evidence: "شواهد"
  },
  drawer: {
    close: "بستن کشو",
    previous: "قبلی",
    next: "بعدی",
    position: "رکورد انتخاب شده",
    generalInformation: "اطلاعات عمومی",
    healthRisk: "سلامت و ریسک",
    relatedIntelligence: "هوشمندی مرتبط",
    recentActivity: "فعالیت اخیر",
    relationshipMap: "نقشه روابط"
  },
  refresh: {
    default: "بازآوری",
    refreshing: "در حال بازآوری...",
    refreshed: "بازآوری شد",
    failed: "بازآوری ناموفق",
    lastUpdated: "آخرین بروزرسانی: {{time}}"
  },
  related: {
    title: "هوشمندی مرتبط",
    description: "رابطه ها و نشانه های استفاده برای رکورد انتخاب شده مدیریت مصرف کننده.",
    viewAll: "مشاهده همه"
  },
  messages: {
    filtersApplied: "فیلترها اعمال شدند.",
    filtersReset: "فیلترها پاک شدند.",
    bulkCreateReady: "جریان ایجاد گروهی باز شد.",
    refreshFailed: "بازآوری ناموفق بود. دوباره تلاش کنید.",
    refreshCompleted: "داده های مصرف کننده بازآوری شد.",
    created: "رکورد ایجاد شد.",
    edited: "رکورد به روز شد.",
    cloned: "رکورد کپی شد.",
    importPreviewReady: "رکورد پیش نمایش ورود اضافه شد.",
    exportPrepared: "خروجی آماده شد.",
    compareReady: "مقایسه آماده شد.",
    columnsUpdated: "ستون ها به روز شدند.",
    deactivated: "رکورد غیرفعال شد."
  },
  drawerPanels: {
    composition: {
      title: "ترکیب",
      description: "ترکیب، اعضا، قوانین و سلسله مراتب {{entity}}."
    },
    activity: {
      title: "فعالیت",
      description: "فعالیت ها و رویدادهای {{entity}}."
    },
    access: {
      title: "دسترسی",
      description: "دسترسی ها و محدودیت های {{entity}}."
    },
    history: {
      title: "تاریخچه",
      description: "تاریخچه چرخه عمر {{entity}}."
    },
    security: {
      title: "امنیت",
      description: "وضعیت امنیتی و ریسک {{entity}}."
    },
    usage: {
      title: "استفاده",
      description: "استفاده {{entity}} در کانال ها."
    },
    audit: {
      title: "حسابرسی",
      description: "ردیابی حسابرسی {{entity}}."
    },
    definition: {
      title: "تعریف",
      description: "تعریف و پیکربندی {{entity}}."
    },
    impact: {
      title: "اثر",
      description: "تحلیل اثر {{entity}}."
    },
    tiers: {
      title: "سطوح",
      description: "پیکربندی سطوح {{entity}}."
    },
    benefits: {
      title: "مزایا",
      description: "کاتالوگ مزایای {{entity}}."
    },
    earnRules: {
      title: "قوانین کسب",
      description: "منطق کسب {{entity}}."
    },
    burnRules: {
      title: "قوانین مصرف",
      description: "منطق مصرف {{entity}}."
    },
    members: {
      title: "اعضا",
      description: "اعضای {{entity}}."
    },
    performance: {
      title: "عملکرد",
      description: "شاخص های عملکرد {{entity}}."
    },
    scope: {
      title: "دامنه",
      description: "دامنه محصولات و کانال های {{entity}}."
    },
    entitlements: {
      title: "امتیازها",
      description: "امتیازهای اعطا شده {{entity}}."
    },
    restrictions: {
      title: "محدودیت ها",
      description: "محدودیت ها و شرایط {{entity}}."
    },
    context: {
      title: "زمینه",
      description: "زمینه رویداد {{entity}}."
    },
    changes: {
      title: "تغییرات",
      description: "تغییرات فیلدهای {{entity}}."
    },
    evidence: {
      title: "شواهد",
      description: "شواهد و داده های {{entity}}."
    }
  },
  charts: {
    title: "بینش ها",
    empty: "داده نمودار موجود نیست",
    consumersByStatus: {
      title: "مصرف کنندگان بر اساس وضعیت",
      description: "تقسیم وضعیت مصرف کنندگان."
    },
    consumersBySegment: {
      title: "مصرف کنندگان بر اساس بخش",
      description: "توزیع بخش های برتر."
    },
    loyaltyDistribution: {
      title: "توزیع وفاداری",
      description: "ترکیب سطح وفاداری."
    },
    groupsByType: {
      title: "گروه ها بر اساس نوع",
      description: "تقسیم نوع گروه."
    },
    groupsByCountry: {
      title: "گروه ها بر اساس کشور",
      description: "کشورهای برتر."
    },
    segmentsByType: {
      title: "بخش ها بر اساس نوع",
      description: "ترکیب راهبرد بخش."
    },
    overlappingSegments: {
      title: "بخش های همپوشان",
      description: "شدت همپوشانی."
    },
    identitiesByType: {
      title: "هویت ها بر اساس نوع",
      description: "تقسیم نوع هویت."
    },
    authenticationMethods: {
      title: "روش های احراز هویت",
      description: "ترکیب روش اصلی."
    },
    householdsByType: {
      title: "خانوارها بر اساس نوع",
      description: "ترکیب نوع خانوار."
    },
    householdsBySize: {
      title: "خانوارها بر اساس اندازه",
      description: "باندهای تعداد عضو."
    },
    typeDistribution: {
      title: "توزیع نوع",
      description: "توزیع نوع تعریف."
    },
    topCategories: {
      title: "دسته های برتر",
      description: "دسته های برتر بر اساس استفاده."
    },
    consentsByType: {
      title: "رضایت ها بر اساس نوع",
      description: "ترکیب دسته رضایت."
    },
    revocationTrend: {
      title: "روند لغو",
      description: "لغوها در زمان."
    },
    programsByType: {
      title: "برنامه ها بر اساس نوع",
      description: "تقسیم نوع برنامه."
    },
    activeMembersTrend: {
      title: "روند اعضای فعال",
      description: "رشد اعضا در زمان."
    },
    entitlementsByType: {
      title: "امتیازها بر اساس نوع",
      description: "توزیع نوع دسترسی."
    },
    restrictedAccessTrend: {
      title: "روند دسترسی محدود",
      description: "روند امتیازهای محدود."
    },
    methodsByType: {
      title: "روش ها بر اساس نوع",
      description: "ترکیب روش های احراز هویت."
    },
    mfaAdoptionTrend: {
      title: "روند پذیرش MFA",
      description: "پذیرش MFA در زمان."
    },
    devicesByType: {
      title: "دستگاه ها بر اساس نوع",
      description: "توزیع نوع دستگاه."
    },
    deviceRiskDistribution: {
      title: "توزیع ریسک دستگاه",
      description: "سطوح ریسک دستگاه."
    },
    sessionsOverTime: {
      title: "نشست ها در زمان",
      description: "روند حجم نشست."
    },
    sessionsByChannel: {
      title: "نشست ها بر اساس کانال",
      description: "توزیع کانال."
    },
    eventsByType: {
      title: "رویدادها بر اساس نوع",
      description: "ترکیب نوع رویداد حسابرسی."
    },
    eventsBySeverity: {
      title: "رویدادها بر اساس شدت",
      description: "توزیع شدت."
    },
    highRiskEventsTrend: {
      title: "روند رویدادهای پرریسک",
      description: "روند رویدادهای پرریسک."
    }
  },
  chartItems: {
    active: "فعال",
    inactive: "غیرفعال",
    suspended: "تعلیق شده",
    pending: "در انتظار",
    premiumTravelers: "مسافران ممتاز",
    leisureTravelers: "مسافران تفریحی",
    businessTravelers: "مسافران کاری",
    familyTravelers: "مسافران خانوادگی",
    platinum: "پلاتین",
    gold: "طلا",
    silver: "نقره",
    member: "عضو",
    dynamic: "پویا",
    ruleBased: "قاعده محور",
    manual: "دستی",
    import: "ورودی",
    unitedStates: "ایالات متحده",
    unitedKingdom: "بریتانیا",
    uae: "امارات",
    france: "فرانسه",
    behavioral: "رفتاری",
    lifecycle: "چرخه عمر",
    affluence: "ارزش",
    intent: "نیت",
    lowOverlap: "همپوشانی کم",
    mediumOverlap: "همپوشانی متوسط",
    highOverlap: "همپوشانی زیاد",
    email: "ایمیل",
    phone: "تلفن",
    socialLogin: "ورود اجتماعی",
    username: "نام کاربری",
    passwordOtp: "رمز + OTP",
    smsOtp: "SMS OTP",
    emailOtp: "Email OTP",
    biometric: "بیومتریک",
    family: "خانواده",
    nonFamily: "غیرخانواده",
    shared: "مشترک",
    oneMember: "۱ عضو",
    twoMembers: "۲ عضو",
    threeMembers: "۳ عضو",
    fivePlusMembers: "۵+ عضو",
    communication: "ارتباطات",
    privacy: "حریم خصوصی",
    experience: "تجربه",
    other: "سایر",
    mobileApp: "اپ موبایل",
    web: "وب",
    callCenter: "مرکز تماس",
    marketing: "بازاریابی",
    analytics: "تحلیل",
    jun: "ژوئن",
    jul: "ژوئیه",
    aug: "اوت",
    sep: "سپتامبر",
    oct: "اکتبر",
    may: "مه",
    dec: "دسامبر",
    jan: "ژانویه",
    points: "امتیاز",
    tier: "سطح",
    miles: "مایل",
    paidSubscription: "اشتراک پولی",
    productAccess: "دسترسی محصول",
    loyaltyBenefit: "مزیت وفاداری",
    membershipAccess: "دسترسی عضویت",
    premiumAccess: "دسترسی ممتاز",
    feb: "فوریه",
    mar: "مارس",
    apr: "آوریل",
    password: "رمز",
    authenticatorApp: "برنامه احراز",
    otp: "OTP",
    mobilePhone: "موبایل",
    laptop: "لپ تاپ",
    desktop: "دسکتاپ",
    tablet: "تبلت",
    low: "کم",
    medium: "متوسط",
    high: "زیاد",
    critical: "بحرانی",
    may6: "۶ مه",
    may7: "۷ مه",
    may8: "۸ مه",
    may9: "۹ مه",
    may12: "۱۲ مه",
    authentication: "احراز هویت",
    authorization: "مجوزدهی",
    profile: "پروفایل",
    security: "امنیت"
  },
  modals: {
    create: "ایجاد",
    saveChanges: "ذخیره تغییرات",
    clone: "کپی",
    import: "ورود",
    export: "خروجی",
    compare: "مقایسه",
    deactivate: "غیرفعال سازی",
    cancel: "لغو",
    createDescription: "ایجاد {{entity}} محلی با طرح تایید شده.",
    editTitle: "ویرایش {{entity}}",
    editDescription: "بروزرسانی فیلدهای {{entity}} انتخاب شده.",
    cloneTitle: "کپی {{entity}}",
    cloneDescription: "ایجاد رکورد کپی محلی.",
    cloneSummary: "کپی {{entity}} {{name}} به عنوان پیش نویس محلی.",
    importTitle: "ورود {{entity}}",
    importDescription: "پیش نمایش و اعتبارسنجی داده محلی.",
    importPreview: "پیش نمایش ورود",
    exportTitle: "خروجی {{entity}}",
    exportDescription: "آماده سازی خروجی دمو محلی.",
    exportSummary: "خروجی {{count}} {{entity}} از نمای محدود فعلی.",
    compareTitle: "مقایسه {{entity}}",
    compareDescription: "مقایسه رکوردهای محلی انتخاب شده.",
    compareSelected: "رکوردهای انتخاب شده",
    deactivateTitle: "غیرفعال سازی {{entity}}",
    deactivateDescription: "غیرفعال سازی رکورد انتخاب شده.",
    deactivateWarning: "آیا می خواهید این {{entity}} را غیرفعال کنید؟",
    fileFormat: "فرمت فایل",
    previewRows: "ردیف های پیش نمایش",
    validateOnly: "فقط اعتبارسنجی",
    updateExisting: "بروزرسانی موجود",
    fields: {
      selectValue: "انتخاب مقدار"
    }
  },
  compare: {
    field: "فیلد",
    changeType: "نوع تغییر",
    states: {
      same: "بدون تغییر",
      added: "افزوده",
      removed: "حذف شده",
      changed: "تغییر کرده"
    }
  },
  validation: {
    requiredFields: "فیلدهای الزامی را کامل کنید.",
    required: "این فیلد الزامی است.",
    invalidOption: "یک گزینه تایید شده انتخاب کنید.",
    uniqueCode: "کد باید در این تب یکتا باشد.",
    reasonRequired: "دلیل برای غیرفعال سازی الزامی است."
  }
} as const;
