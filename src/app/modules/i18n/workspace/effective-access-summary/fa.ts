export const effectiveAccessSummaryWorkspaceFa = {
  title: "خلاصه دسترسی موثر",
  permissionsByCategory: "مجوزها بر اساس دسته",
  dataScopeOverview: "نمای کلی دامنه داده",
  total: "کل",
  scopeType: "نوع دامنه",
  coverage: "پوشش",
  summary: {
    workspaceId: "شناسه فضای کاری",
    effectiveSince: "موثر از",
    accessSource: "منبع دسترسی"
  },
  metrics: {
    totalPermissions: "کل مجوزها",
    roles: "نقش ها",
    dataScopes: "دامنه های داده",
    accessibleSuppliers: "تامین کنندگان قابل دسترسی",
    countries: "کشورها",
    cities: "شهرها",
    catalogs: "کاتالوگ ها"
  },
  roles: {
    title: "نقش ها",
    role: "نقش",
    type: "نوع",
    source: "منبع"
  },
  roleTypes: {
    primary: "اصلی",
    functional: "عملکردی",
    readOnly: "فقط خواندنی"
  },
  sources: {
    direct: "مستقیم",
    inherited: "ارث بری",
    directInherited: "مستقیم + ارث بری"
  },
  scopeTypes: {
    country: "کشور",
    city: "شهر",
    productCategory: "دسته محصول",
    supplier: "تامین کننده",
    contentLanguage: "زبان محتوا"
  },
  accessLevels: {
    full: "دسترسی کامل",
    limited: "دسترسی محدود"
  },
  accessibleSuppliers: {
    title: "تامین کنندگان قابل دسترسی ({{count}})",
    supplier: "تامین کننده",
    type: "نوع",
    accessLevel: "سطح دسترسی"
  },
  inheritance: {
    title: "ارث بری دسترسی",
    inherited: "ارث بری",
    directPermissions: "مجوزهای مستقیم",
    inheritedPermissions: "مجوزهای ارث بری",
    deniedRestricted: "رد شده / محدود"
  },
  deniedLimited: {
    title: "موارد دسترسی رد شده / محدود"
  },
  reasons: {
    notInScope: "خارج از دامنه",
    roleRestriction: "محدودیت نقش",
    insufficientRole: "نقش ناکافی",
    limitExceeded: "حد مجاز رد شد"
  },
  restrictionTypes: {
    denied: "رد شده",
    limited: "محدود"
  },
  recentChanges: {
    title: "تغییرات اخیر دسترسی",
    change: "تغییر",
    resource: "منبع",
    changedBy: "تغییر توسط"
  },
  changes: {
    permissionGranted: "مجوز اعطا شد",
    roleAssigned: "نقش اختصاص یافت",
    scopeUpdated: "دامنه به روز شد",
    permissionRevoked: "مجوز لغو شد",
    roleRemoved: "نقش حذف شد"
  },
  evidence: {
    title: "مستندات دسترسی",
    policySnapshot: "تصویر سیاست",
    roleAssignment: "اختصاص نقش",
    scopeDefinition: "تعریف دامنه",
    permissionEvaluation: "ارزیابی مجوز"
  },
  about: {
    title: "درباره این خلاصه",
    description: "این صفحه دسترسی موثر شما را در فضای کاری فعلی بر اساس نقش ها، دامنه ها و سیاست های سیستم نشان می دهد.",
    accessNote: "دسترسی می تواند مستقیم اعطا شود یا از نقش ها و سازمان ها به ارث برسد. برای درخواست یا تغییر دسترسی با مدیر سیستم تماس بگیرید.",
    securityNotice: "اطلاعیه امنیتی",
    securityNoticeDetail: "همیشه مطمئن شوید حداقل دسترسی لازم برای انجام وظایف خود را دارید."
  },
  actions: {
    viewAllPermissions: "مشاهده همه مجوزها",
    viewAllRoles: "مشاهده همه نقش ها",
    viewAllSuppliers: "مشاهده همه تامین کنندگان",
    viewAllRestrictions: "مشاهده همه محدودیت ها",
    viewAllEvidence: "مشاهده همه مستندات",
    learnMoreAccessControl: "بیشتر درباره کنترل دسترسی بدانید"
  }
} as const;
