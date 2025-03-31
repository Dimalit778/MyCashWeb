import { isPlatformMobile } from "./platform";

class TokenStorage {
  constructor() {
    this.isMobile = isPlatformMobile();
  }
  setTokens(accessToken, refreshToken) {
    if (this.isMobile) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }
  getTokens() {
    if (this.isMobile) {
      return {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };
    }
    return null;
  }

  clearTokens() {
    if (this.isMobile) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }
}

export const tokenStorage = new TokenStorage();
