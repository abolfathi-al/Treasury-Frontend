export const accessRequestsWorkspaceFa = {
  title: "درخواست های دسترسی",
  navTitle: "درخواست های دسترسی",
  breadcrumb: "درخواست های دسترسی",
  helperText: "درخواست های دسترسی این فضای کاری را مشاهده، بررسی و مدیریت کنید.",
  summary: {
    totalRequests: "کل درخواست ها",
    totalRequestsDetail: "در فضای کاری",
    pending: "در انتظار",
    pendingDetail: "۳۰٪ از کل",
    approved: "تایید شده",
    approvedDetail: "۵۶٪ از کل",
    denied: "رد شده",
    deniedDetail: "۸٪ از کل",
    awaitingMyAction: "در انتظار اقدام من",
    awaitingMyActionDetail: "۱۴٪ از کل",
    averageResponseTime: "میانگین زمان پاسخ",
    averageResponseTimeDetail: "۰.۶ روز سریع تر"
  },
  filters: {
    searchLabel: "جستجو",
    searchPlaceholder: "جستجوی درخواست ها، نقش ها یا منابع...",
    status: "وضعیت",
    allStatuses: "همه وضعیت ها",
    requestedBy: "درخواست دهنده",
    allActors: "همه نقش ها",
    resourceType: "نوع منبع",
    allTypes: "همه نوع ها",
    priority: "اولویت",
    allPriorities: "همه اولویت ها",
    moreFilters: "فیلترهای بیشتر",
    export: "خروجی"
  },
  table: {
    title: "درخواست های دسترسی ({{count}})",
    requestId: "شناسه درخواست",
    requestedBy: "درخواست دهنده",
    resource: "منبع",
    accessType: "نوع دسترسی",
    scope: "دامنه",
    priority: "اولویت",
    status: "وضعیت",
    requestedOn: "زمان درخواست",
    actions: "عملیات",
    showing: "نمایش ۱ تا ۸ از {{count}} نتیجه",
    pageSize: "۱۰ / صفحه"
  },
  status: {
    pending: "در انتظار",
    approved: "تایید شده",
    denied: "رد شده",
    cancelled: "لغو شده"
  },
  priority: {
    title: "درخواست ها بر اساس اولویت",
    high: "بالا",
    medium: "متوسط",
    low: "پایین",
    countSummary: "{{count}} ({{percent}}٪)"
  },
  accessTypes: {
    read: "خواندن",
    write: "نوشتن",
    execute: "اجرا",
    roleAccess: "دسترسی نقش",
    resourceAccess: "دسترسی منبع",
    dataAccess: "دسترسی داده",
    systemAccess: "دسترسی سیستمی"
  },
  statusChart: {
    title: "درخواست ها بر اساس وضعیت"
  },
  pendingActions: {
    title: "اقدام های در انتظار من",
    saraHotelbeds: "Sara Ahmadi درخواست دسترسی خواندن به کاتالوگ Hotelbeds را ثبت کرد",
    mohammadPricing: "Mohammad Rezaei درخواست دسترسی نوشتن به قیمت گذاری Atlas را ثبت کرد",
    elhamTiqets: "Elham Mohammadi درخواست دسترسی اجرا به API Tiqets را ثبت کرد"
  },
  reviewPreview: {
    title: "پیش نمایش بررسی",
    description: "{{actor}} درخواست دسترسی {{accessType}} به {{resource}} را ثبت کرده است ({{requestId}}).",
    demoOnly: "فقط نمایشی است. عملیات تایید و رد عمدا متصل نشده اند."
  },
  insights: {
    title: "بینش درخواست ها",
    topResourceType: "نوع منبع برتر",
    mostActiveActor: "فعال ترین نقش",
    busiestDay: "شلوغ ترین روز"
  },
  lifecycle: {
    title: "چرخه عمر درخواست",
    requested: "درخواست شد",
    requestedDetail: "نقش درخواست را ثبت می کند",
    review: "بررسی",
    reviewDetail: "بررسی مدیر",
    decision: "تصمیم",
    decisionDetail: "تایید یا رد",
    applied: "اعمال شد",
    appliedDetail: "دسترسی به روز شد"
  },
  activity: {
    title: "فعالیت اخیر درخواست ها",
    saraApproved: "درخواست Sara Ahmadi برای کاتالوگ Hotelbeds تایید شد",
    mohammadPending: "درخواست Mohammad Rezaei برای قیمت گذاری Atlas در انتظار بررسی شما است",
    arashDenied: "درخواست Arash Bahmani برای نرخ های RateHawk رد شد",
    byline: "توسط {{by}} · {{date}}"
  },
  actions: {
    viewDetails: "مشاهده جزئیات",
    review: "بررسی"
  }
} as const;
