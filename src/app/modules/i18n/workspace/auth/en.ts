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
    title: "Sign in to Treasury",
    desc: "Use your password, then complete TOTP when the server requires it.",
    secureSession: "Secure cookie session",
    button: "Continue",
    verifyTotp: "Verify and sign in",
    totpTitle: "TOTP verification required",
    totpExpires: "This challenge expires at {{value}}.",
    passwordHint: "Use the full password issued for this account (15–128 characters).",
    recover: "Recover password",
    error: "The sign-in proof was not accepted. Check the details and try again."
  },
  logout: {
    title: "logout works!",
    desc: "Signing out of your admin workspace"
  },
  forgot: {
    title: "Recover your password",
    desc: "Use your saved recovery code and current TOTP. Recovery never signs you in.",
    submit: "Replace password",
    error: "The recovery proof was not accepted.",
    success: "Password replaced",
    replacementWarning: "Save this replacement recovery code now. It is shown only in this response and is not stored in the browser.",
    returnToLogin: "Return to sign in"
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
    newPassword: "New password",
    login: "Login",
    recoveryCode: "Saved recovery code",
    totpCode: "Six-digit TOTP code",
    confirmPassword: "Confirm Password",
    username: "Username",
    fiscalYear: "Fiscal year",
    companyDesc: "{{name}} - Code {{code}}",
    agree: "I Accept the <a routerLink=\"/\" target=\"_blank\" class=\"ms-1 link-primary\">Terms</a>"
  }
} as const;
