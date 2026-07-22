export const authWorkspaceFa = {
  general: {
    submitButton: "ثبت",
    backButton: "بازگشت",
    privacy: "حریم خصوصی",
    legal: "قوانین",
    contact: "تماس با ما",
    alreadyHaveAnAccount: "آیا حساب اپلیکیشن دارید؟"
  },
  login: {
    title: "ورود به حساب کاربری",
    desc: "برای ورود به فضای کاری مدیریتی وارد شوید",
    fiscalYearTitle: "انتخاب سال مالی",
    button: "ورود"
  },
  logout: {
    title: "خروج کار می کند!",
    desc: "خروج از فضای کاری مدیریتی"
  },
  forgot: {
    title: "فراموشی رمز عبور",
    desc: "ایمیل خود را وارد کنید تا رمز عبور خود را بازنشانی کنید",
    success: "حساب کاربری شما با موفقیت بازنشانی شد."
  },
  register: {
    title: "ثبت نام",
    desc: "حساب فضای کاری مدیریتی خود را ایجاد کنید",
    error: "جزئیات ثبت نام صحیح نیست"
  },
  input: {
    email: "ایمیل",
    fullname: "نام کامل",
    password: "رمز عبور",
    confirmPassword: "تأیید رمز عبور",
    username: "نام کاربری",
    fiscalYear: "سال مالی",
    companyDesc: "{{name}} - کد {{code}}",
    agree: "من<a routerLink=\"/\" target=\"_blank\" class=\"ms-1 link-primary\"> قوانین و مقررات </a> را قبول می‌کنم."
  }
} as const;
