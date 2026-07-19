"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { validateCouponAction } from "@/lib/coupons/actions";

/**
 * Verification status for a referral code.
 * - idle:      No verification attempted yet (or code was cleared/edited).
 * - verifying: API request in flight.
 * - valid:     Code has been verified and is valid.
 * - invalid:   Code has been verified and is invalid.
 */
type VerificationStatus = "idle" | "verifying" | "valid" | "invalid";

interface UseReferralVerificationReturn {
  /** Current sanitized referral code value. */
  referralCode: string;
  /** Whether a verification request is in flight. */
  isVerifying: boolean;
  /** Current verification status. */
  verificationStatus: VerificationStatus;
  /** Error message from the last failed verification, or null. */
  verificationError: string | null;
  /**
   * Call on every input change. Sanitizes to uppercase alphanumeric,
   * resets verification if code changed, starts a 3-second debounce timer.
   */
  handleChange: (rawValue: string) => void;
  /**
   * Call on input blur. Cancels pending debounce and immediately verifies
   * if the current value is non-empty and has not already been verified.
   */
  handleBlur: () => void;
  /**
   * Call before form submission. Returns true if the code is empty or
   * verified valid. Returns false if verification fails. If the code
   * needs verification, it runs it inline and awaits the result.
   */
  verifyIfNeeded: () => Promise<boolean>;
  /**
   * Resets all verification state. Call after successful form submission.
   */
  reset: () => void;
}

const DEBOUNCE_DELAY_MS = 3000;

/**
 * Custom hook that encapsulates all referral code verification logic.
 *
 * Verification is triggered by three events only:
 * 1. Debounce — 3 seconds after the user stops typing.
 * 2. Blur — when the input loses focus (cancels debounce).
 * 3. Submit — when the form is submitted and the code hasn't been verified yet.
 *
 * Results are cached: once a code is verified, it won't be re-verified unless
 * the user edits it. Race conditions are handled via an incrementing request
 * counter — only the latest request's result updates state.
 */
export function useReferralVerification(): UseReferralVerificationReturn {
  const [referralCode, setReferralCode] = useState("");
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  // The code that was last successfully/unsuccessfully verified.
  const lastVerifiedCodeRef = useRef<string>("");
  // Debounce timer handle.
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Incrementing counter to handle race conditions: only the latest request
  // is allowed to update state.
  const requestCounterRef = useRef(0);

  // ── Cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ── Internal verify function ──────────────────────────────────────────
  const verify = useCallback(async (code: string): Promise<boolean> => {
    // Guard: don't verify empty or too-short codes.
    if (!code || code.length < 3) {
      setVerificationStatus("invalid");
      setVerificationError("Referral code must have a minimum of 3 characters");
      lastVerifiedCodeRef.current = code;
      return false;
    }

    // Guard: already verified this exact code.
    if (
      code === lastVerifiedCodeRef.current &&
      (verificationStatus === "valid" || verificationStatus === "invalid")
    ) {
      return verificationStatus === "valid";
    }

    const thisRequest = ++requestCounterRef.current;
    setVerificationStatus("verifying");
    setVerificationError(null);

    try {
      const res = await validateCouponAction(code);

      // Race condition guard: only the latest request may update state.
      if (thisRequest !== requestCounterRef.current) {
        return false;
      }

      if (res.success) {
        setVerificationStatus("valid");
        setVerificationError(null);
        lastVerifiedCodeRef.current = code;
        return true;
      } else {
        const errorMsg = res.error || "Invalid referral code.";
        setVerificationStatus("invalid");
        setVerificationError(errorMsg);
        lastVerifiedCodeRef.current = code;
        return false;
      }
    } catch {
      // Race condition guard.
      if (thisRequest !== requestCounterRef.current) {
        return false;
      }

      setVerificationStatus("invalid");
      setVerificationError(
        "Unable to verify referral code. Please try again."
      );
      // Don't cache network errors — allow retry.
      lastVerifiedCodeRef.current = "";
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── handleChange ──────────────────────────────────────────────────────
  const handleChange = useCallback(
    (rawValue: string) => {
      // Sanitize: uppercase alphanumeric only.
      const sanitized = rawValue
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .trim();
      setReferralCode(sanitized);

      // Cancel any pending debounce timer.
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // If cleared, reset everything.
      if (sanitized.length === 0) {
        setVerificationStatus("idle");
        setVerificationError(null);
        lastVerifiedCodeRef.current = "";
        return;
      }

      // If the code changed from the last verified code, reset status.
      if (sanitized !== lastVerifiedCodeRef.current) {
        setVerificationStatus("idle");
        setVerificationError(null);
      }

      // Start debounce timer (3 seconds of inactivity triggers verification).
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        // Only verify if the code hasn't already been verified.
        if (sanitized !== lastVerifiedCodeRef.current) {
          verify(sanitized);
        }
      }, DEBOUNCE_DELAY_MS);
    },
    [verify]
  );

  // ── handleBlur ────────────────────────────────────────────────────────
  const handleBlur = useCallback(() => {
    // Cancel pending debounce — we'll verify immediately instead.
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Verify if non-empty and not already verified for this value.
    if (referralCode.length > 0 && referralCode !== lastVerifiedCodeRef.current) {
      verify(referralCode);
    }
  }, [referralCode, verify]);

  // ── verifyIfNeeded (for submit flow) ──────────────────────────────────
  const verifyIfNeeded = useCallback(async (): Promise<boolean> => {
    // Cancel pending debounce.
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Empty code → skip verification entirely.
    if (!referralCode || referralCode.trim().length === 0) {
      return true;
    }

    // Already verified this exact code → return cached result.
    if (referralCode === lastVerifiedCodeRef.current) {
      return verificationStatus === "valid";
    }

    // Code needs verification — run it inline.
    return await verify(referralCode);
  }, [referralCode, verificationStatus, verify]);

  // ── reset ─────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setReferralCode("");
    setVerificationStatus("idle");
    setVerificationError(null);
    lastVerifiedCodeRef.current = "";
    requestCounterRef.current = 0;
  }, []);

  return {
    referralCode,
    isVerifying: verificationStatus === "verifying",
    verificationStatus,
    verificationError,
    handleChange,
    handleBlur,
    verifyIfNeeded,
    reset,
  };
}
