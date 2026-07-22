export const membershipDirectoryWorkspaceFa = {
  title: "فهرست عضویت ها",
  description: "عضویت ها، دعوت ها، نقش ها، سازمان ها و فعالیت های اخیر دسترسی را بررسی کنید.",
  summary: {
    totalMembers: "کل اعضا",
    totalMembersDetail: "+۱۲ در این ماه",
    activeMembers: "اعضای فعال",
    activeMembersDetail: "۸۵٪ از کل",
    pendingInvitations: "دعوت های در انتظار",
    pendingInvitationsDetail: "۶٪ از کل",
    inactiveSuspended: "غیرفعال / تعلیق شده",
    inactiveSuspendedDetail: "۹٪ از کل",
    organizations: "سازمان ها",
    organizationsDetail: "در همه فضاهای کاری",
    roles: "نقش ها",
    rolesDetail: "با برچسب حرفه ای"
  },
  filters: {
    searchLabel: "جستجو",
    searchPlaceholder: "جستجوی اعضا، سازمان ها یا ایمیل...",
    organization: "سازمان",
    activeOrganization: "سازمان فعال",
    allOrganizations: "همه سازمان ها",
    role: "نقش",
    allRoles: "همه نقش ها",
    status: "وضعیت",
    allStatuses: "همه وضعیت ها",
    workspace: "فضای کاری",
    allWorkspaces: "همه فضاهای کاری",
    moreFilters: "فیلترهای بیشتر",
    export: "خروجی"
  },
  table: {
    title: "همه عضویت ها ({{count}})",
    actor: "نقش فعال",
    organization: "سازمان",
    role: "نقش",
    workspace: "فضای کاری",
    status: "وضعیت",
    source: "منبع",
    effectiveSince: "موثر از",
    lastActivity: "آخرین فعالیت",
    actions: "عملیات",
    showing: "نمایش ۱ تا ۱۰ از {{count}} نتیجه",
    pageSize: "۱۰ / صفحه",
    pageUnit: "صفحه"
  },
  status: {
    active: "فعال",
    pending: "در انتظار",
    inactive: "غیرفعال",
    suspended: "تعلیق شده",
    revoked: "خاتمه یافته"
  },
  states: {
    loading: "در حال بارگذاری عضویت ها...",
    empty: "هیچ عضوی با فیلترهای فعلی پیدا نشد.",
    error: "فهرست عضویت ها بارگذاری نشد.",
    detailError: "جزئیات عضویت بارگذاری نشد.",
    lifecycleError: "عملیات چرخه عمر عضویت انجام نشد.",
    selectMembership: "یک عضویت را برای مشاهده زمینه مستاجر و سازمان انتخاب کنید."
  },
  details: {
    title: "زمینه عضویت",
    membershipId: "شناسه عضویت",
    organization: "سازمان",
    context: "زمینه مستاجر",
    status: "وضعیت چرخه عمر"
  },
  lifecycle: {
    title: "عملیات چرخه عمر",
    activate: "فعال سازی",
    suspend: "تعلیق",
    terminate: "خاتمه",
    restore: "بازیابی"
  },
  roles: {
    title: "عضویت ها بر اساس نقش",
    others: "سایر"
  },
  invitations: {
    title: "دعوت های اخیر"
  },
  activity: {
    title: "فعالیت اخیر",
    roleUpdated: "نقش Sara Ahmadi از Sales Agent به Pricing Manager تغییر کرد",
    invitationSent: "دعوت جدید برای Sina Moradi با نقش Pricing Manager ارسال شد",
    supplierReportsGranted: "دسترسی Hossein Karimi به گزارش های مالی تامین کننده اعطا شد",
    membershipAdded: "Negar Akbari به فضای کاری Atlas Travel Agency اضافه شد",
    localTimezone: "همه زمان ها بر اساس منطقه زمانی محلی شما نمایش داده می شوند."
  },
  actions: {
    viewAllRoles: "مشاهده همه نقش ها"
  }
} as const;
