import * as React from "react";

// Lightweight client-only auth scaffold. Designed so a real backend (Clerk, Supabase,
// Firebase, etc) can be plugged in later by swapping the implementations of
// `signUp`, `login`, and `logout` without changing consumer call-sites.

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface StoredAccount extends UserProfile {
  // NOTE: Mock-only password store. NOT a real credential. Will be replaced when
  // we plug in a real auth provider.
  passwordHash: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isHydrated: boolean;
  signUp: (input: { name: string; email: string; password: string }) => { ok: boolean; error?: string };
  login: (input: { email: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

const ACCOUNTS_KEY = "opendoorai-accounts";
const SESSION_KEY = "opendoorai-session";

function hash(input: string): string {
  // Simple non-cryptographic hash. Mock-only — DO NOT rely on for real security.
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return `m_${h}`;
}

function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Synchronous hydration so we don't flash the login screen for an authed user.
  const [user, setUser] = React.useState<UserProfile | null>(loadSession);
  const [isHydrated] = React.useState(true);

  const signUp: AuthContextType["signUp"] = ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim() || !cleanEmail || !password) {
      return { ok: false, error: "Please fill in your name, email, and password." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    const accounts = loadAccounts();
    if (accounts.some((a) => a.email === cleanEmail)) {
      return { ok: false, error: "An account with that email already exists. Try logging in." };
    }
    const account: StoredAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      passwordHash: hash(password),
    };
    saveAccounts([...accounts, account]);
    const { passwordHash, ...profile } = account;
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setUser(profile);
    return { ok: true };
  };

  const login: AuthContextType["login"] = ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = loadAccounts();
    const account = accounts.find((a) => a.email === cleanEmail);
    if (!account || account.passwordHash !== hash(password)) {
      return { ok: false, error: "Email or password didn't match. Give it another try." };
    }
    const { passwordHash, ...profile } = account;
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setUser(profile);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isHydrated, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
