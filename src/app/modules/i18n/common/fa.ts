export const commonFa = {
  actions: {
    back: "بازگشت",
    continue: "ادامه",
    cancel: "انصراف",
    submit: "تایید",
    search: "جستجو",
    searchPlaceholder: "جستجو...",
    saveChanges: "ذخیره تغییرات",
    create: "ایجاد",
    filter: "فیلتر",
    viewAll: "مشاهده همه",
    update: "بروزرسانی",
    subscribe: "ثبت‌ نام",
    submitRequest: "ثبت درخواست",
    upgrade: "اپگرید",
    okGotIt: "باشه، فهمیدم.",
    noReturn: "خیر , منصرف شدم",
    confirmDelete: "بله، حذف کنید!",
    refresh: "بازآوری",
    export: "خروجی",
    delete: "حذف",
    edit: "ویرایش",
    view: "مشاهده",
    close: "بستن"
  },
  filters: {
    all: "همه",
    active: "فعال",
    inactive: "غیرفعال",
    status: "وضعیت",
    dateRange: "بازه تاریخ",
    sortBy: "مرتب‌سازی بر اساس",
    filterBy: "فیلتر بر اساس"
  },
  columns: {
    name: "نام",
    status: "وضعیت",
    createdAt: "ایجاد شده در",
    updatedAt: "به روزرسانی شده در",
    actions: "اقدام ها"
  },
  states: {
    loading: "در حال بارگذاری...",
    loadingDateRange: "بارگذاری دامنه تاریخ...",
    empty: "داده ای برای نمایش وجود ندارد",
    error: "خطا",
    success: "موفق",
    wait: "لطفا صبر کنید."
  },
  date: {
    today: "امروز",
    week: "هفته",
    day: "روز",
    from: "از",
    to: "به",
    until: "تا"
  },
  countdown: {
    expired: "منقضی شده",
    daysShort: "{{days}} روز",
    hoursShort: "{{hours}} ساعت",
    minutesShort: "{{minutes}} دقیقه",
    secondsShort: "{{seconds}} ثانیه",
    daysHours: "{{days}} روز {{hours}} ساعت",
    hoursMinutes: "{{hours}} ساعت {{minutes}} دقیقه",
    minutesSeconds: "{{minutes}} دقیقه {{seconds}} ثانیه",
    seconds: "{{seconds}} ثانیه",
    oneDay: "۱ روز",
    days: "{{days}} روز",
    oneHour: "۱ ساعت",
    hours: "{{hours}} ساعت",
    oneMinute: "۱ دقیقه",
    minutes: "{{minutes}} دقیقه",
    oneSecond: "۱ ثانیه",
    separator: "، "
  },
  timeAgo: {
    aFewSeconds: "چند ثانیه پیش",
    aMinute: "یک دقیقه پیش",
    minutes: "{{minutes}} دقیقه پیش",
    anHour: "یک ساعت پیش",
    hours: "{{hours}} ساعت پیش",
    aDay: "یک روز پیش",
    days: "{{days}} روز پیش",
    aMonth: "یک ماه پیش",
    months: "{{months}} ماه پیش",
    aYear: "یک سال پیش",
    years: "{{years}} سال پیش"
  },
  timeLater: {
    aFewSeconds: "تا چند ثانیه دیگر",
    aMinute: "تا یک دقیقه دیگر",
    minutes: "تا {{minutes}} دقیقه دیگر",
    anHour: "تا یک ساعت دیگر",
    hours: "تا {{hours}} ساعت دیگر",
    aDay: "تا یک روز دیگر",
    days: "تا {{days}} روز دیگر",
    aMonth: "تا یک ماه دیگر",
    months: "تا {{months}} ماه دیگر",
    aYear: "تا یک سال دیگر",
    years: "تا {{years}} سال دیگر"
  },
  labels: {
    progress: "پیشرفت",
    team: "تیم",
    impactLevel: "سطح تأثیر",
    quickTools: "ابزارهای سریع",
    quickLinks: "لینک‌های سریع",
    admin: "مدیر سیستم"
  },
  select: {
    notFound: "هیچ موردی یافت نشد",
    loading: "در حال بارگیری...",
    typeToSearch: "برای جستجو تایپ کنید",
    addTag: "مورد را اضافه کنید",
    clearAll: "پاک کردن همه"
  },
  formControls: {
    email: {
      label: "ایمیل",
      placeholder: "ایمیل خود را وارد کنید"
    },
    newsletter: {
      label: "عضویت در خبرنامه",
      placeholder: "ایمیل شما"
    },
    phone: {
      label: "شماره تلفن",
      placeholder: "شماره تلفن خود را وارد کنید"
    },
    yourPhoneNumber: {
      label: "شماره تماس شما",
      placeholder: "شماره تلفن خود را وارد کنید"
    },
    cityRecommendedHotels: {
      label: "هتل های پیشنهادی شهر",
      placeholder: "شناسه شهر را وارد کنید"
    }
  }
} as const;
