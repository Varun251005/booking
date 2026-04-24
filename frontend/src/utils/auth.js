export const getTokenFromStorage = () => localStorage.getItem("token") || "";

const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
};

export const getRoleFromToken = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return "";

    const payloadText = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadText);
    return payload?.role || "";
  } catch {
    return "";
  }
};

export const getStoredUserRole = () => {
  const token = getTokenFromStorage();
  const roleFromToken = token ? getRoleFromToken(token) : "";
  if (roleFromToken) return roleFromToken;

  return localStorage.getItem("userRole") || localStorage.getItem("role") || "";
};

export const isAdminAuthenticated = () => {
  const token = getTokenFromStorage();
  if (!token) return false;

  return getStoredUserRole() === "admin";
};
