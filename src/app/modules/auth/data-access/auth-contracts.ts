export interface LoginRequest {
  readonly login: string;
  readonly password: string;
  readonly deviceLabel?: string;
}

export interface LoginChallenge {
  readonly outcome: 'TOTP_REQUIRED';
  readonly challengeId: string;
  readonly expiresAt: string;
}

export interface TotpProof {
  readonly challengeId: string;
  readonly code: string;
}

export type SessionAssurance = 'PASSWORD' | 'PASSWORD_TOTP';

export interface SessionView {
  readonly sessionId: string;
  readonly authenticatedAt: string;
  readonly idleExpiresAt: string;
  readonly absoluteExpiresAt: string;
  readonly assurance: SessionAssurance;
  readonly userId: string;
  readonly userDisplayName: string;
  readonly effectivePermissions: readonly string[];
}

export interface SessionEstablished {
  readonly outcome: 'SESSION_ESTABLISHED';
  readonly session: SessionView;
}

export interface StepUpVerified {
  readonly outcome: 'STEP_UP_VERIFIED';
  readonly proofId: string;
  readonly expiresAt: string;
}

export interface PasswordRecoveryRequest {
  readonly login: string;
  readonly newPassword: string;
  readonly recoveryCode: string;
  readonly totpCode: string;
}

export interface PasswordRecoveryCompleted {
  readonly outcome: 'PASSWORD_RESET';
  readonly replacementRecoveryCode: string;
}

export interface TreasuryProblem {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly code: string;
  readonly requestId: string;
  readonly retryable: boolean;
  readonly detail?: string;
  readonly fieldErrors?: readonly {
    readonly path: string;
    readonly message: string;
  }[];
}

export type LoginResponse = LoginChallenge | SessionEstablished;
export type TotpResponse = SessionEstablished | StepUpVerified;
