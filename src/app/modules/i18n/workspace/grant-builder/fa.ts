export const grantBuilderWorkspaceFa = {
  title: "سازنده اعطا و فضای کاری تفویض",
  navTitle: "سازنده اعطا",
  breadcrumb: "سازنده اعطا",
  helperText: "اعطاها را طراحی، پیکربندی و بررسی کنید. مجوزها را انتخاب کنید، دامنه سلسله مراتبی را تعیین کنید، مرزهای تفویض را تنظیم کنید و دسترسی موثر را پیش نمایش بگیرید.",
  steps: {
    configureGrant: "پیکربندی اعطا",
    selectScope: "انتخاب دامنه",
    delegationInheritance: "تفویض و ارث بری",
    impactAnalysis: "تحلیل اثر",
    reviewApply: "بررسی و اعمال"
  },
  actions: {
    previewAsActor: "پیش نمایش به عنوان نقش",
    reviewApply: "بررسی و اعمال"
  },
  review: {
    title: "بررسی و اعمال",
    demoOnly: "تایید فقط نمایشی است. هیچ اعطایی ذخیره یا enforce نمی شود.",
    confirmDemo: "تایید بررسی نمایشی"
  },
  summary: {
    grantName: "نام اعطا",
    grantType: "نوع اعطا",
    createdBy: "ایجاد توسط",
    workspace: "فضای کاری",
    status: "وضعیت",
    lastSaved: "آخرین ذخیره",
    description: "توضیحات"
  },
  roleSource: {
    title: "۱. منبع نقش / مجوز",
    roleTemplate: "قالب نقش",
    customPermissions: "مجوزهای سفارشی",
    catalogViewer: "مشاهده گر کاتالوگ (خواندن)",
    catalogViewerDetail: "دسترسی خواندن به داده های کاتالوگ و قیمت گذاری را فراهم می کند.",
    viewRoleDetails: "مشاهده جزئیات نقش"
  },
  permissions: {
    title: "۲. مجوزها ({{count}})",
    selected: "{{count}} انتخاب شده",
    selectedCount: "مجوزهای انتخاب شده",
    searchPlaceholder: "جستجوی مجوزها...",
    catalogView: "کاتالوگ: مشاهده آیتم ها",
    pricingView: "قیمت گذاری: مشاهده قیمت ها",
    availabilityView: "موجودی: مشاهده موجودی",
    supplierView: "تامین کننده: مشاهده اطلاعات تامین کننده",
    catalogExport: "کاتالوگ: خروجی داده",
    pricingUpdate: "قیمت گذاری: بروزرسانی قیمت ها",
    addCustom: "افزودن مجوز سفارشی"
  },
  attributes: {
    title: "ویژگی های اعطا",
    accessType: "نوع دسترسی",
    dataSensitivity: "حساسیت داده",
    sessionPolicy: "سیاست نشست",
    mfaRequired: "نیازمند MFA",
    active: "فعال"
  },
  scope: {
    title: "۳. انتخاب دامنه (سلسله مراتبی)",
    viewMode: "حالت نمایش دامنه",
    treeView: "نمای درختی",
    pathView: "نمای مسیر",
    searchPlaceholder: "جستجوی دامنه...",
    resetScope: "بازنشانی دامنه",
    selectedScope: "دامنه انتخاب شده",
    change: "تغییر",
    scopeType: "نوع دامنه",
    scopeLevel: "سطح دامنه",
    children: "فرزندان",
    inheritance: "ارث بری",
    path: "مسیر",
    summary: "خلاصه دامنه",
    suppliers: "تامین کنندگان",
    catalog: "کاتالوگ",
    supplier: "تامین کننده",
    resource: "منبع",
    childResources: "منابع فرزند",
    fromParent: "از والد"
  },
  delegation: {
    title: "۴. مرز تفویض",
    noDelegation: "بدون تفویض",
    noDelegationDetail: "این اعطا قابل تفویض نیست.",
    workspaceBoundary: "مرز فضای کاری",
    workspaceBoundaryDetail: "در این فضای کاری قابل تفویض است.",
    scopeBoundary: "مرز دامنه",
    scopeBoundaryDetail: "در دامنه انتخاب شده قابل تفویض است.",
    customBoundary: "مرز سفارشی",
    customBoundaryDetail: "قوانین تفویض سفارشی تعریف کنید.",
    maxDepth: "حداکثر عمق تفویض",
    zeroDepth: "۰ (بدون تفویض)",
    allowFurther: "اجازه تفویض بیشتر",
    infoNone: "این اعطا قابل تفویض نخواهد بود. فقط مدیران می توانند این دسترسی را اعطا یا لغو کنند.",
    infoWorkspace: "تفویض به عضویت های داخل فضای کاری فعلی محدود است.",
    infoScope: "تفویض به دامنه انتخاب شده و منابع فرزند موثر آن محدود است.",
    infoCustom: "تفویض سفارشی قبل از enforce شدن به اعتبارسنجی سیاست در بک اند نیاز دارد."
  },
  impact: {
    title: "۵. تحلیل اثر",
    usersImpacted: "کاربران متاثر",
    newAccess: "دسترسی جدید",
    resources: "منابع",
    riskLevel: "سطح ریسک",
    accessIncrease: "افزایش دسترسی",
    accessCategory: "دسته دسترسی"
  },
  preview: {
    title: "پیش نمایش دسترسی موثر",
    subtitle: "ببینید این اعطا چه چیزی را فعال می کند.",
    viewFull: "مشاهده پیش نمایش کامل"
  },
  inheritance: {
    title: "وضعیت ارث بری",
    inheritedParent: "اعطا از گره والد به ارث رسیده است.",
    effectiveHere: "مجوزهای موثر در اینجا اعمال می شوند."
  },
  legend: {
    inherited: "ارث بری",
    inheritedDetail: "مجوزهای ارث بری از والد",
    overridden: "بازنویسی شده",
    overriddenDetail: "مجوزهای بازنویسی شده در این دامنه",
    explicit: "صریح",
    explicitDetail: "صراحتا در این دامنه اعطا شده",
    denied: "رد شده",
    deniedDetail: "صراحتا در این دامنه رد شده"
  },
  values: {
    read: "خواندن",
    internal: "داخلی",
    standard: "استاندارد",
    yes: "بله",
    no: "خیر",
    low: "پایین",
    readAccess: "دسترسی خواندن",
    resourceAccess: "دسترسی منبع",
    allowed: "مجاز"
  }
} as const;
