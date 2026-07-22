export const supplierVisibilityWorkspaceFa = {
  title: "مدیریت سیاست تامین کننده",
  navTitle: "نمایش تامین کنندگان",
  breadcrumb: "مدیریت سیاست تامین کننده",
  helperText: "نحوه نمایش داده، موجودی، کاتالوگ ها و سرویس های خود به مصرف کنندگان را به صورت پیش فرض مدیریت کنید. محدودیت ها، استثناها و قوانین نمایش را تعریف کنید.",
  summary: {
    defaultVisibility: "نمایش پیش فرض",
    defaultVisibilityDetail: "به صورت پیش فرض باز برای همه",
    restrictedConsumers: "مصرف کنندگان محدود",
    restrictedConsumersDetail: "۱۲٪ از کل مصرف کنندگان",
    hiddenResources: "منابع پنهان",
    hiddenResourcesDetail: "در همه منابع",
    activePolicyVersion: "نسخه فعال سیاست",
    activePolicyVersionDetail: "منتشر شده در ۲۰ مه ۲۰۲۴",
    exceptions: "استثناها",
    exceptionsDetail: "استثناهای زمان دار"
  },
  actions: {
    accessWorkspace: "فضای کاری دسترسی",
    policySimulator: "شبیه ساز سیاست",
    export: "خروجی",
    createPolicy: "ایجاد سیاست",
    demoAction: "اقدام نمایشی انتخاب شد:"
  },
  tabs: {
    overview: "نمای کلی سیاست",
    restrictedConsumers: "مصرف کنندگان محدود",
    hiddenResources: "منابع پنهان",
    policyRules: "قوانین سیاست",
    policyVersions: "نسخه های سیاست",
    changeHistory: "تاریخچه تغییرات"
  },
  status: {
    visible: "قابل مشاهده",
    restricted: "محدود",
    hidden: "پنهان"
  },
  default: {
    open: "باز"
  },
  defaultPolicy: {
    title: "سیاست نمایش پیش فرض",
    defaultPolicy: "سیاست پیش فرض",
    openToAll: "باز برای همه مصرف کنندگان",
    openBadge: "باز",
    whatMeans: "این یعنی چه",
    meaning: "داده، موجودی، کاتالوگ ها و سرویس های شما برای همه مصرف کنندگان قابل مشاهده است مگر اینکه به صورت صریح محدود شود.",
    howWorks: "نحوه کار نمایش پیش فرض"
  },
  resourceTypes: {
    title: "نمایش بر اساس نوع منبع",
    centerLabel: "منابع پنهان",
    catalogs: "کاتالوگ ها",
    services: "سرویس ها",
    countries: "کشورها",
    cities: "شهرها",
    channels: "کانال ها"
  },
  restrictedConsumers: {
    title: "مصرف کنندگان محدود ({{count}})",
    searchPlaceholder: "جستجوی مصرف کنندگان...",
    addRestricted: "افزودن محدودیت",
    consumer: "مصرف کننده",
    type: "نوع",
    reason: "دلیل",
    restrictedScope: "دامنه محدودیت",
    effectiveFrom: "موثر از",
    effectiveTo: "موثر تا",
    actions: "عملیات",
    viewAll: "مشاهده همه مصرف کنندگان محدود ({{count}})"
  },
  hiddenResources: {
    title: "منابع پنهان ({{count}})",
    allTypes: "همه انواع",
    searchPlaceholder: "جستجوی منابع...",
    hideResource: "پنهان کردن منبع",
    resource: "منبع",
    type: "نوع",
    scope: "دامنه",
    reason: "دلیل",
    status: "وضعیت",
    actions: "عملیات",
    viewAll: "مشاهده همه منابع پنهان ({{count}})"
  },
  policyRules: {
    title: "قوانین سیاست",
    active: "فعال",
    defaultOpen: {
      title: "نمایش باز پیش فرض",
      detail: "همه داده های تامین کننده برای مصرف کنندگان قابل مشاهده است مگر اینکه محدودیت، قانون منبع پنهان یا استثنا اعمال شود."
    },
    consumerRestriction: {
      title: "محدودیت مصرف کننده",
      detail: "سیاست تامین کننده می تواند مصرف کنندگان انتخابی را از مشاهده داده تامین کننده یا دامنه های سیاست محدود کند."
    },
    resourceHiding: {
      title: "قوانین منابع پنهان",
      detail: "کاتالوگ ها، سرویس ها، کشورها، شهرها و کانال ها می توانند از نمایش مصرف کننده پنهان شوند."
    },
    exceptionWindow: {
      title: "بازه های استثنای سیاست",
      detail: "استثناهای موقت می توانند قوانین نمایش تامین کننده را برای یک بازه زمانی محدود بازنویسی کنند."
    }
  },
  versions: {
    title: "نسخه های سیاست",
    current: "فعلی",
    previous: "قبلی",
    viewAll: "مشاهده همه نسخه ها"
  },
  changeHistory: {
    title: "تغییرات اخیر سیاست",
    time: "زمان",
    changeType: "نوع تغییر",
    target: "هدف",
    details: "جزئیات",
    changedBy: "تغییر داده شده توسط",
    version: "نسخه",
    viewAll: "مشاهده همه تغییرات"
  },
  changeTypes: {
    restrictedConsumerAdded: "مصرف کننده محدود افزوده شد",
    resourceHidden: "منبع پنهان شد",
    policyExceptionCreated: "استثنای سیاست ایجاد شد",
    restrictedConsumerRemoved: "مصرف کننده محدود حذف شد",
    policyVersionPublished: "نسخه سیاست منتشر شد"
  },
  policyScope: {
    title: "دامنه سیاست",
    appliesTo: "اعمال می شود به",
    appliesToValue: "همه داده ها، موجودی، کاتالوگ ها، سرویس ها",
    geography: "جغرافیا",
    geographyValue: "همه کشورها، همه شهرها",
    channels: "کانال ها",
    channelsValue: "همه کانال ها",
    products: "محصولات",
    seatBased: "مبتنی بر صندلی",
    stayBased: "مبتنی بر اقامت",
    slotBased: "مبتنی بر اسلات",
    ticketBased: "مبتنی بر بلیت",
    packageBased: "مبتنی بر بسته",
    lastEvaluated: "آخرین ارزیابی",
    by: "توسط"
  },
  quickActions: {
    title: "اقدام های سریع",
    addRestrictedConsumer: "افزودن مصرف کننده محدود",
    hideResource: "پنهان کردن منبع",
    createPolicyException: "ایجاد استثنای سیاست",
    openAccessWorkspace: "باز کردن در فضای کاری دسترسی",
    runPolicySimulator: "اجرای شبیه ساز سیاست"
  },
  about: {
    title: "درباره سیاست تامین کننده",
    description: "این سیاست نمایش داده های شما به مصرف کنندگان را کنترل می کند.",
    accessWorkspaceNote: "تصمیم های نهایی دسترسی در فضای کاری دسترسی با سیاست تامین کننده، ترجیح مصرف کننده، دامنه موثر و بافت نقش محاسبه می شوند.",
    learnMore: "اطلاعات بیشتر درباره تصمیم دسترسی"
  },
  rowActions: {
    viewPolicy: "مشاهده سیاست",
    editPolicy: "ویرایش سیاست",
    viewAudit: "مشاهده ممیزی"
  }
} as const;
