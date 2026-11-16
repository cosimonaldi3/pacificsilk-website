// Client portal copy: sign-in, account creation, password reset, approval gate.

export const portalAuth = {
  signIn: {
    heading: "Sign in",
    intro: "Access your China operations portal.",
    submit: "Sign in",
    forgot: "Forgot password?",
    switchPrompt: "New to PSC?",
    switchLink: "Request access",
  },
  signUp: {
    heading: "Request access",
    intro: "Create an account. We review every request before the portal opens.",
    submit: "Create account",
    switchPrompt: "Already have an account?",
    switchLink: "Sign in",
    sent: "Check your email. Confirm your address, then sign in. We'll review your access and let you know when the portal is open.",
  },
  forgot: {
    heading: "Reset password",
    intro: "Enter your email. We'll send you a link to set a new password.",
    submit: "Send reset link",
    back: "Back to sign in",
    sent: "If that email has an account, a reset link is on its way.",
  },
  reset: {
    heading: "Set a new password",
    intro: "Choose a password of at least 8 characters.",
    submit: "Save password",
    done: "Password saved. Taking you to the portal.",
  },
  fields: {
    email: "Email",
    password: "Password",
    newPassword: "New password",
  },
  errors: {
    generic: "Something went wrong. Try again.",
    notConfigured: "Sign-in is not available right now.",
    shortPassword: "Use at least 8 characters.",
    linkExpired: "That link has expired or was already used. Request a new one.",
  },
  pending: {
    heading: "We're reviewing your access.",
    body: "Your account is set up. A PSC team member will open your portal shortly and email you when it's ready.",
    contact: "Questions in the meantime?",
    contactLink: "Contact us",
  },
  signOut: "Sign out",
};

export type PortalAuthContent = typeof portalAuth;
