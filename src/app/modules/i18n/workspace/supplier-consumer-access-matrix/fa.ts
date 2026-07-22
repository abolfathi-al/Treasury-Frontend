export const supplierConsumerAccessMatrixWorkspaceFa = {
  title: "فضای کاری دسترسی تامین کننده و مصرف کننده",
  navTitle: "فضای کاری دسترسی",
  breadcrumb: "فضای کاری دسترسی تامین کننده و مصرف کننده",
  helperText: "دسترسی داده بین تامین کننده ها و مصرف کننده ها را مدیریت و تحلیل کنید.",
  workspace: {
    title: "فضای کاری دسترسی تامین کننده و مصرف کننده",
    breadcrumb: "فضای کاری دسترسی",
    helperText: "دسترسی داده بین تامین کننده ها و مصرف کننده ها را مدیریت و تحلیل کنید. دسترسی نهایی با سیاست تامین کننده، ترجیح مصرف کننده، دامنه و بافت نقش تعیین می شود."
  },
  actions: {
    accessPolicies: "سیاست های دسترسی",
    export: "خروجی",
    exportReport: "خروجی گزارش",
    runAccessEvaluation: "اجرای ارزیابی دسترسی"
  },
  tabs: {
    overview: "نمای کلی",
    supplierView: "نمای تامین کننده",
    consumerView: "نمای مصرف کننده",
    relationshipWorkspace: "فضای کاری رابطه"
  },
  summary: {
    totalSuppliers: "کل تامین کننده ها",
    totalSuppliersDetail: "تامین کننده های نمایشی محلی",
    totalConsumers: "کل مصرف کننده ها",
    totalConsumersDetail: "مصرف کننده های نمایشی محلی",
    allowed: "مجاز",
    blocked: "مسدود",
    notConfigured: "پیکربندی نشده",
    totalAllowed: "کل مجاز",
    totalBlocked: "کل مسدود",
    pendingReview: "در انتظار بررسی",
    lastEvaluation: "آخرین ارزیابی"
  },
  filters: {
    searchLabel: "جستجو",
    searchPlaceholder: "جستجوی تامین کننده یا مصرف کننده...",
    supplier: "تامین کننده",
    allSuppliers: "همه تامین کننده ها",
    consumer: "مصرف کننده",
    allConsumers: "همه مصرف کننده ها",
    status: "وضعیت",
    allStatuses: "همه وضعیت ها"
  },
  overview: {
    title: "ماتریس نمای کلی دسترسی",
    subtitle: "خانه های ماتریس رابطه تامین کننده و مصرف کننده را انتخاب می کنند. تصمیم ها در فضای کاری رابطه بروزرسانی می شوند."
  },
  table: {
    supplierConsumer: "تامین کننده ها \\ مصرف کننده ها",
    supplier: "تامین کننده",
    consumer: "مصرف کننده",
    summary: "خلاصه",
    totalByConsumer: "کل (مجاز / مسدود / در انتظار / پیکربندی نشده)"
  },
  status: {
    allowed: "مجاز",
    blocked: "مسدود",
    pending: "در انتظار",
    pendingReview: "در انتظار بررسی",
    notConfigured: "پیکربندی نشده"
  },
  supplierPolicy: {
    title: "۴. سیاست نمایش تامین کننده"
  },
  consumerPreference: {
    title: "۵. ترجیح تامین کننده مصرف کننده"
  },
  preference: {
    enabled: "فعال",
    disabled: "غیرفعال",
    pending: "در انتظار",
    notConfigured: "پیکربندی نشده"
  },
  finalDecision: {
    title: "تصمیم نهایی دسترسی به داده",
    centerLabel: "کل رابطه ها",
    explanationTitle: "تصمیم نهایی از این موارد محاسبه می شود:",
    explanation: "سیاست نمایش تامین کننده + ترجیح تامین کننده مصرف کننده + دامنه موثر مصرف کننده + بافت نقش"
  },
  logic: {
    title: "۳. منطق تصمیم دسترسی",
    supplierVisibilityPolicy: "سیاست نمایش تامین کننده",
    supplierVisibilityPolicyDetail: "تامین کننده دسترسی مصرف کننده را مجاز یا مسدود می کند.",
    consumerSupplierPreference: "ترجیح تامین کننده مصرف کننده",
    consumerSupplierPreferenceDetail: "مصرف کننده تامین کننده را فعال یا غیرفعال می کند.",
    consumerEffectiveScope: "دامنه موثر مصرف کننده",
    consumerEffectiveScopeDetail: "دامنه مشخص می کند کدام داده تامین کننده قابل دسترسی است.",
    actorContext: "بافت نقش",
    actorContextDetail: "عضویت، نقش و بافت نقش فعال.",
    finalDecision: "تصمیم نهایی دسترسی به داده",
    finalDecisionDetail: "اجازه یا مسدودسازی در مرزهای دامنه."
  },
  distribution: {
    title: "توزیع وضعیت دسترسی",
    total: "کل"
  },
  recentChanges: {
    title: "تغییرات اخیر دسترسی",
    time: "زمان",
    supplier: "تامین کننده",
    consumer: "مصرف کننده",
    changeType: "نوع تغییر",
    previous: "قبلی",
    new: "جدید",
    changedBy: "تغییر داده شده توسط",
    reason: "دلیل"
  },
  changeTypes: {
    allowed: "مجاز",
    blocked: "مسدود",
    pending: "در انتظار",
    reset: "بازنشانی به پیش فرض"
  },
  auditReasons: {
    initialConfiguration: "پیکربندی اولیه",
    supplierRestriction: "محدودیت تامین کننده",
    approvedBySupplier: "تایید شده توسط تامین کننده",
    needsVerification: "نیازمند تایید",
    contractExpired: "قرارداد منقضی شده",
    demoDecisionSaved: "تصمیم نمایشی ذخیره شد"
  },
  decision: {
    breakdownTitle: "تفکیک تصمیم",
    supplierVisibilityPolicy: "سیاست نمایش تامین کننده",
    consumerSupplierPreference: "ترجیح تامین کننده مصرف کننده",
    consumerEffectiveScope: "دامنه موثر مصرف کننده",
    actorContext: "بافت نقش",
    allowed: "مجاز",
    blocked: "مسدود",
    defaultOpen: "باز پیش فرض",
    enabled: "فعال",
    disabled: "غیرفعال",
    notConfigured: "پیکربندی نشده",
    valid: "معتبر",
    invalid: "نامعتبر",
    outsideScope: "خارج از دامنه",
    validAgencyUser: "معتبر (کاربر آژانس)",
    visibilityPolicyDetail: "سیاست نمایش",
    consumerPreferenceDetail: "ترجیح تامین کننده",
    scopeDetail: "اعتبار دامنه",
    actorContextDetail: "کاربر آژانس",
    reasons: {
      allowedByDefaultOpenSupply: "به دلیل عرضه باز پیش فرض مجاز است.",
      blockedBySupplierPolicy: "به دلیل سیاست تامین کننده مسدود شده است.",
      disabledByConsumerPreference: "به دلیل ترجیح مصرف کننده غیرفعال شده است.",
      outsideConsumerEffectiveScope: "خارج از دامنه موثر مصرف کننده است.",
      actorContextMismatch: "بافت نقش منطبق نیست.",
      pendingReview: "پیش از تایید دسترسی نهایی در انتظار بررسی است.",
      notConfigured: "تصمیم صریحی برای این رابطه پیکربندی نشده است."
    }
  },
  relationship: {
    panelTitle: "فضای کاری رابطه",
    panelSubtitle: "مدیریت دسترسی تامین کننده و مصرف کننده انتخاب شده.",
    focusTitle: "فضای کاری رابطه",
    focusSubtitle: "از پنل کناری برای بررسی شواهد تصمیم و بروزرسانی رابطه انتخاب شده استفاده کنید.",
    workspaceNoteTitle: "مدیریت رابطه",
    workspaceNote: "ماتریس فقط سطح انتخاب نمای کلی است. تصمیم های رابطه فقط از فرم این فضای کاری تغییر می کنند.",
    selectedRelationship: "رابطه انتخاب شده",
    selectRelationship: "انتخاب رابطه",
    selectedRelationshipHint: "برای رابطه انتخاب شده",
    decisionSourceTitle: "منبع تصمیم",
    currentFinalDecision: "تصمیم نهایی فعلی",
    decisionSource: "منبع تصمیم",
    lastEvaluated: "آخرین ارزیابی",
    evaluatedBy: "ارزیابی شده توسط",
    by: "توسط",
    updateDecision: "بروزرسانی تصمیم",
    decision: "تصمیم",
    allow: "اجازه دادن",
    block: "مسدود کردن",
    pendingReview: "در انتظار بررسی",
    resetToDefault: "بازنشانی به پیش فرض",
    reason: "دلیل (اختیاری)",
    reasonPlaceholder: "دلیل این تصمیم را وارد کنید...",
    effectiveFrom: "موثر از",
    effectiveTo: "موثر تا (اختیاری)",
    reviewRequired: "نیازمند بررسی",
    saveDecision: "ذخیره تصمیم",
    cancel: "لغو",
    demoAction: "اقدام نمایشی انتخاب شد:",
    decisionSaved: "تصمیم به صورت محلی ذخیره شد",
    decisionCanceled: "تغییرات تصمیم لغو شد",
    openedSimulator: "شبیه ساز دسترسی باز شد",
    openedGrants: "اعطاهای مرتبط باز شد",
    viewedFullHistory: "تاریخچه کامل مشاهده شد",
    panelClosed: "اقدام بستن پنل رابطه انتخاب شد",
    auditHistory: "ممیزی و تاریخچه",
    viewFullHistory: "مشاهده تاریخچه کامل",
    relatedActions: "اقدام های مرتبط",
    openInAccessSimulator: "باز کردن در شبیه ساز دسترسی",
    viewRelatedGrants: "مشاهده اعطاهای مرتبط",
    sources: {
      policyPreference: "سیاست + ترجیح",
      supplierPolicy: "سیاست تامین کننده",
      consumerPreference: "ترجیح مصرف کننده",
      manualOverride: "بازنویسی دستی",
      defaultOpen: "باز پیش فرض",
      effectiveScope: "دامنه موثر",
      actorContext: "بافت نقش"
    }
  },
  reviewQueue: {
    title: "صف بررسی های در انتظار",
    pendingAge: "رابطه نمایشی در انتظار",
    viewAllPending: "مشاهده همه موارد در انتظار"
  },
  supplierView: {
    title: "نمای تامین کننده",
    subtitle: "اسکفولد فضای کاری تامین کننده محور برای جریان مدیریت بعدی.",
    selectSupplier: "انتخاب تامین کننده",
    allowSelected: "مجاز کردن انتخاب شده ها",
    blockSelected: "مسدود کردن انتخاب شده ها",
    sendSelectedToReview: "ارسال انتخاب شده ها برای بررسی",
    allowedConsumers: "مصرف کننده های مجاز",
    blockedConsumers: "مصرف کننده های مسدود",
    pendingConsumers: "مصرف کننده های در انتظار",
    notConfiguredConsumers: "مصرف کننده های پیکربندی نشده",
    emptyGroup: "رابطه ای در این گروه وجود ندارد."
  },
  consumerView: {
    title: "نمای مصرف کننده",
    subtitle: "اسکفولد فضای کاری مصرف کننده محور برای جریان مدیریت بعدی.",
    selectConsumer: "انتخاب مصرف کننده",
    enableSelected: "فعال کردن انتخاب شده ها",
    disableSelected: "غیرفعال کردن انتخاب شده ها",
    sendSelectedToReview: "ارسال انتخاب شده ها برای بررسی",
    enabledSuppliers: "تامین کننده های فعال",
    disabledSuppliers: "تامین کننده های غیرفعال",
    pendingSuppliers: "تامین کننده های در انتظار",
    notConfiguredSuppliers: "تامین کننده های پیکربندی نشده",
    emptyGroup: "رابطه ای در این گروه وجود ندارد."
  },
  health: {
    title: "سلامت دسترسی",
    healthyLabel: "سالم",
    critical: "بحرانی",
    warning: "هشدار",
    healthy: "سالم"
  },
  quickActions: {
    title: "اقدام های سریع",
    addAccessPolicy: "افزودن سیاست دسترسی",
    addAccessPolicyDetail: "پیکربندی نمایش تامین کننده",
    consumerPreferences: "ترجیحات مصرف کننده",
    consumerPreferencesDetail: "مدیریت انتخاب های مصرف کننده",
    bulkUpdate: "بروزرسانی گروهی",
    bulkUpdateDetail: "بروزرسانی چند رابطه",
    pendingReviews: "بررسی های در انتظار",
    pendingReviewsDetail: "بررسی درخواست های در انتظار",
    accessSimulator: "شبیه ساز دسترسی",
    accessSimulatorDetail: "شبیه سازی تصمیم های دسترسی",
    exportMatrix: "خروجی ماتریس",
    exportMatrixDetail: "خروجی کامل ماتریس دسترسی"
  }
} as const;
