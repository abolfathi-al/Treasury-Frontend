export const accessSimulatorWorkspaceFa = {
  title: "شبیه ساز دسترسی",
  navTitle: "شبیه ساز دسترسی",
  breadcrumb: "شبیه ساز دسترسی",
  helperText: "شبیه سازی کنید که اعطا، تغییر مجوز یا بروزرسانی تفویض چگونه بر دسترسی موثر، قیمت گذاری و نمایش اثر می گذارد.",
  actions: {
    loadSimulation: "بارگذاری شبیه سازی",
    saveSimulation: "ذخیره شبیه سازی",
    runSimulation: "اجرای شبیه سازی",
    advancedOptions: "گزینه های پیشرفته",
    viewPermissionDiff: "مشاهده تفاوت مجوزها",
    viewPricingRules: "مشاهده همه قوانین قیمت گذاری",
    viewVisibilityRules: "مشاهده همه قوانین نمایش",
    nextActions: "اقدام های بعدی",
    applyGrant: "اعمال این اعطا",
    shareSimulation: "اشتراک گذاری شبیه سازی",
    exportReport: "خروجی گزارش (PDF)"
  },
  timeline: {
    title: "۱۱. خط زمانی شبیه سازی",
    currentState: "وضعیت فعلی",
    currentStateDetail: "امروز ۱۰:۱۵",
    grantApplied: "اعطا اعمال شد",
    grantAppliedDetail: "+ دسترسی خواندن کاتالوگ",
    effectiveRecalculated: "دسترسی موثر دوباره محاسبه شد",
    effectiveRecalculatedDetail: "محاسبه مجدد موتور",
    visibilityUpdated: "نمایش بروزرسانی شد",
    visibilityUpdatedDetail: "ارزیابی قوانین",
    pricingAnalyzed: "اثر قیمت گذاری تحلیل شد",
    pricingAnalyzedDetail: "قوانین و مجوزها",
    finalReady: "نتیجه نهایی آماده است",
    finalReadyDetail: "شبیه سازی کامل شد"
  },
  inputs: {
    title: "۱. ورودی های شبیه سازی",
    membership: "کاربر / عضویت",
    actorType: "نوع نقش",
    grantTemplate: "قالب اعطا",
    permissions: "مجوزها",
    scope: "دامنه",
    delegationBoundary: "مرز تفویض"
  },
  comparison: {
    title: "۲. مقایسه دسترسی",
    before: "قبل",
    after: "بعد (شبیه سازی شده)",
    diff: "تفاوت",
    currentAccess: "دسترسی موثر (قبل)",
    simulatedAccess: "دسترسی موثر (بعد - شبیه سازی شده)",
    accessDifference: "تفاوت دسترسی",
    netPermissions: "خالص +۴ مجوز",
    netChange: "تغییر خالص"
  },
  impact: {
    title: "۳. خلاصه اثر",
    permissionsAdded: "مجوزهای افزوده شده",
    permissionsRemoved: "مجوزهای حذف شده",
    resourcesAffected: "منابع متاثر",
    suppliersAffected: "تامین کنندگان متاثر",
    riskLevel: "سطح ریسک",
    overview: "نمای کلی اثر",
    riskFactors: "عامل های ریسک",
    overviewGrant: "این شبیه سازی دسترسی READ به کاتالوگ های Hotelbeds را اعطا می کند.",
    overviewRules: "۲ تامین کننده، ۳ کاتالوگ و ۱۴ قانون قیمت گذاری متاثر خواهند شد.",
    overviewVisibility: "هیچ قانون نمایشی کاهش داده نمی شود.",
    overviewRisk: "سطح ریسک به دلیل اثر قیمت گذاری و حساسیت داده متوسط است.",
    accessChangeConfidence: "اطمینان تغییر دسترسی",
    pricingRulesImpacted: "قوانین قیمت گذاری متاثر",
    crossSupplierAccess: "دسترسی بین تامین کنندگان",
    sensitiveDataAccess: "دسترسی به داده حساس"
  },
  permissions: {
    title: "۴. تغییرات مجوز",
    added: "افزوده شده (۵)",
    removed: "حذف شده (۱)",
    unchanged: "بدون تغییر",
    permission: "مجوز",
    scope: "دامنه",
    reason: "دلیل تغییر"
  },
  resources: {
    title: "۵. منابع متاثر",
    suppliers: "تامین کنندگان",
    countries: "کشورها",
    cities: "شهرها",
    catalogs: "کاتالوگ ها",
    services: "خدمات",
    channels: "کانال ها",
    resource: "منبع",
    before: "قبل",
    after: "بعد",
    change: "تغییر"
  },
  memberships: {
    title: "عضویت های متاثر",
    membership: "عضویت",
    impactType: "نوع اثر",
    change: "تغییر"
  },
  pricing: {
    title: "۶. قوانین قیمت گذاری متاثر",
    ruleName: "نام قانون",
    ruleType: "نوع قانون",
    change: "تغییر"
  },
  visibility: {
    title: "۷. قوانین نمایش متاثر",
    reduced: "۰ کاهش یافته",
    ruleName: "نام قانون",
    appliesTo: "اعمال روی",
    change: "تغییر"
  },
  inheritance: {
    title: "۸. تغییرات ارث بری",
    newInherited: "ارث بری جدید (۲)",
    inheritanceLost: "ارث بری از دست رفته (۰)",
    changedPath: "مسیر تغییر کرده (۱)",
    resource: "منبع",
    changeType: "نوع تغییر",
    from: "از",
    to: "به",
    reason: "دلیل",
    newlyInherited: "ارث بری جدید",
    lost: "از دست رفته",
    pathChanged: "مسیر تغییر کرد"
  },
  result: {
    completed: "شبیه سازی با موفقیت کامل شد",
    completedDetail: "شبیه سازی با سیاست ها و قوانین فعلی محاسبه شده است.",
    simulationId: "شناسه شبیه سازی",
    runBy: "اجرا توسط",
    runAt: "زمان اجرا",
    duration: "مدت زمان"
  },
  labels: {
    total: "کل",
    permissions: "مجوزها",
    rules: "قوانین",
    allowed: "مجاز",
    inherited: "ارث بری",
    explicit: "صریح",
    denied: "رد شده"
  },
  changes: {
    added: "افزوده شده",
    removed: "حذف شده",
    unchanged: "بدون تغییر",
    increased: "افزایش یافته",
    noChange: "بدون تغییر",
    changed: "تغییر کرده"
  },
  impactTypes: {
    added: "افزوده شده",
    removed: "حذف شده",
    changed: "تغییر کرده",
    inherited: "ارث بری"
  },
  reasons: {
    grantApplied: "اعطا اعمال شد",
    scopeMatched: "دامنه منطبق شد",
    permissionIncluded: "مجوز شامل شده",
    readOnlyTemplate: "قالب فقط خواندن",
    alreadyEffective: "قبلا موثر بوده",
    newParentGrant: "اعطای جدید در سطح والد",
    scopeBoundaryUpdated: "مرز دامنه بروزرسانی شد"
  }
} as const;
