const revoked = new Map<string, number>();

function sweep(now: number) {
  for (const [token, exp] of revoked) {
    if (exp <= now) revoked.delete(token);
  }
}

export const tokenBlacklist = {
  revoke(token: string, expSeconds: number) {
    sweep(Date.now());
    revoked.set(token, expSeconds * 1000);
  },
  isRevoked(token: string): boolean {
    const exp = revoked.get(token);
    if (!exp) return false;
    if (exp <= Date.now()) {
      revoked.delete(token);
      return false;
    }
    return true;
  },
};
