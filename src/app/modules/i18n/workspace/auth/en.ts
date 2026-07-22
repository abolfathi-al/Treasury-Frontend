export const authWorkspaceEn = {
  general: {
    submitButton: "Submit",
    backButton: "Back",
    privacy: "Privacy",
    legal: "Legal",
    contact: "Contact",
    alreadyHaveAnAccount: "Already have an Account?"
  },
  login: {
    title: "Login Account",
    desc: "Sign in to your admin workspace",
    fiscalYearTitle: "Chose Fiscal Year",
    button: "Sign In"
  },
  logout: {
    title: "logout works!",
    desc: "Signing out of your admin workspace"
  },
  forgot: {
    title: "Forgotten Password?",
    desc: "Enter your email to reset your password",
    success: "Your account has been successfully reset."
  },
  register: {
    title: "Sign Up",
    desc: "Create your admin workspace account",
    error: "The registration details are incorrect"
  },
  input: {
    email: "Email",
    fullname: "Fullname",
    password: "Password",
    confirmPassword: "Confirm Password",
    username: "Username",
    fiscalYear: "Fiscal year",
    companyDesc: "{{name}} - Code {{code}}",
    agree: "I Accept the <a routerLink=\"/\" target=\"_blank\" class=\"ms-1 link-primary\">Terms</a>"
  }
} as const;
