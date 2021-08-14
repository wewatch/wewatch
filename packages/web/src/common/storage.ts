const tokenKey = "token";

class Storage {
  private readonly prefix: string;

  constructor(localStoragePrefix: string) {
    this.prefix = localStoragePrefix;
  }

  getItem = (key: string): string | null =>
    localStorage.getItem(`${this.prefix}:${key}`);

  setItem = (key: string, value: string): void =>
    localStorage.setItem(`${this.prefix}:${key}`, value);

  removeItem = (key: string): void =>
    localStorage.removeItem(`${this.prefix}:${key}`);

  getToken = (): string | null => this.getItem(tokenKey);

  setToken = (token: string): void => this.setItem(tokenKey, token);

  removeToken = (): void => this.removeItem(tokenKey);
}

export default new Storage(process.env.NEXT_PUBLIC_LOCAL_STORAGE_PREFIX ?? "");
