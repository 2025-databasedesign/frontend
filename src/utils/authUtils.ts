export function isTokenValid() {
  const token = localStorage.getItem("access_token");
  const expiresAt = localStorage.getItem("expires_at");

  if (!token || !expiresAt) return false;

  const now = Math.floor(Date.now() / 1000);
  const isValid = now < Number(expiresAt);

  return isValid;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("schedule-storage");
  localStorage.removeItem("payment-storage");
  //consider later after connect with api
  // localStorage.removeItem("history-storage");
}
