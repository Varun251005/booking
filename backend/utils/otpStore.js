const otpStore = new Map();

const OTP_TTL_MS = 5 * 60 * 1000;

export const saveOTP = (email, otp) => {
  otpStore.set(email, {
    otp: String(otp),
    expiresAt: Date.now() + OTP_TTL_MS,
  });
};

export const verifyOTP = (email, otp) => {
  const record = otpStore.get(email);

  if (!record) return false;

  if (record.expiresAt < Date.now()) {
    otpStore.delete(email);
    return false;
  }

  const isValid = record.otp === String(otp);

  if (isValid) {
    otpStore.delete(email);
  }

  return isValid;
};
