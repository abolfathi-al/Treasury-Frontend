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
    title: "ورود به خزانه‌داری",
    desc: "رمز عبور را وارد کنید و در صورت درخواست سرور، کد TOTP را تکمیل کنید.",
    secureSession: "نشست امن مبتنی بر کوکی",
    button: "ادامه",
    verifyTotp: "تأیید و ورود",
    totpTitle: "تأیید TOTP لازم است",
    totpExpires: "این چالش در {{value}} منقضی می‌شود.",
    passwordHint: "رمز کامل این حساب را وارد کنید (۱۵ تا ۱۲۸ نویسه).",
    recover: "بازیابی رمز عبور",
    error: "مدرک ورود پذیرفته نشد. اطلاعات را بررسی و دوباره تلاش کنید."
  },
  logout: {
    title: "خروج کار می کند!",
    desc: "خروج از فضای کاری مدیریتی"
  },
  forgot: {
    title: "بازیابی رمز عبور",
    desc: "از کد بازیابی ذخیره‌شده و TOTP فعلی استفاده کنید. بازیابی شما را وارد سامانه نمی‌کند.",
    submit: "جایگزینی رمز عبور",
    error: "مدرک بازیابی پذیرفته نشد.",
    success: "رمز عبور جایگزین شد",
    replacementWarning: "این کد بازیابی جایگزین را همین حالا ذخیره کنید. کد فقط در این پاسخ نمایش داده می‌شود و در مرورگر ذخیره نمی‌شود.",
    returnToLogin: "بازگشت به ورود"
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
    newPassword: "رمز عبور جدید",
    login: "شناسه ورود",
    recoveryCode: "کد بازیابی ذخیره‌شده",
    totpCode: "کد شش‌رقمی TOTP",
    confirmPassword: "تأیید رمز عبور",
    username: "نام کاربری",
    fiscalYear: "سال مالی",
    companyDesc: "{{name}} - کد {{code}}",
    agree: "من<a routerLink=\"/\" target=\"_blank\" class=\"ms-1 link-primary\"> قوانین و مقررات </a> را قبول می‌کنم."
  }
} as const;
