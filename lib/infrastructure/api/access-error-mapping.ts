import type { LoginErrorCode } from "@/lib/domain/auth/login.vo";
import type { RegisterErrorCode } from "@/lib/domain/auth/register.vo";
import type { OtpVerifyErrorCode } from "@/lib/domain/otp/otp.vo";
import type { DocumentVerdict } from "@/lib/domain/identity/document.vo";

export function toRegisterErrorCode(
  status: number,
  backendMessage: string,
): RegisterErrorCode {
  if (status === 409) return "DUPLICATE";
  if (status === 422 && backendMessage === "TermsRequired")
    return "TERMS_REQUIRED";
  if (
    (status === 400 || status === 422) &&
    /password|secret/i.test(backendMessage)
  )
    return "INVALID_PASSWORD";
  if (status === 400 || status === 422) return "INVALID_EMAIL";
  return "UNAVAILABLE";
}

export function toLoginErrorCode(
  status: number,
  backendMessage: string,
): LoginErrorCode {
  if (status === 0) return "NETWORK_UNREACHABLE";
  if (status === 401 || status === 404) return "INVALID_CREDENTIALS";
  if (status === 423 && backendMessage === "Suspended") return "SUSPENDED";
  if (status === 423) return "LOCKED";
  if (status === 409 && backendMessage === "PreviousSession")
    return "PREVIOUS_SESSION";
  if (status === 409 && backendMessage === "access suspended")
    return "SUSPENDED";
  if (status === 409 && backendMessage === "proof not held")
    return "OUTSIDE_NOT_LINKED";
  return "UNAVAILABLE";
}

export function toOtpVerifyErrorCode(
  status: number,
  backendMessage: string,
): OtpVerifyErrorCode {
  if (status === 410) return "EXPIRED";
  if (status === 423) return "LOCKED";
  if (status === 409 && backendMessage === "challenge already answered")
    return "INVALIDATED";
  // 409 con intentos restantes: código erróneo pero el desafío sigue OPEN.
  if (status === 409) return "MISMATCH";
  if (status === 422) return "MISMATCH";
  return "UNAVAILABLE";
}

export function toDocumentVerdict(status: string): DocumentVerdict {
  switch (status.toUpperCase()) {
    case "MATCH":
      return "MATCH";
    case "UNDER_REVIEW":
      return "UNDER_REVIEW";
    case "MISMATCH":
      return "MISMATCH";
    case "EXPIRED_DOCUMENT":
      return "EXPIRED_DOCUMENT";
    case "UNREADABLE_BLURRY":
      return "UNREADABLE_BLURRY";
    case "UNREADABLE_GLARE":
      return "UNREADABLE_GLARE";
    case "UNREADABLE_CROPPED":
      return "UNREADABLE_CROPPED";
    case "UNREADABLE_WRONG_TYPE":
      return "UNREADABLE_WRONG_TYPE";
    default:
      return "UNDER_REVIEW";
  }
}
