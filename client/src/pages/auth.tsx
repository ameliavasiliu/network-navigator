import * as React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

function HatMark({ size = 56 }: { size?: number }) {
  // Mini Happy Hat mark for the auth screens — keeps brand identity consistent.
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <ellipse cx="32" cy="42" rx="27" ry="5.5" fill="#C75450" opacity="0.18" />
      <path d="M10 42 Q14 36 20 38 Q26 44 32 44 Q38 44 44 38 Q50 36 54 42 Q42 50 32 50 Q22 50 10 42 Z" fill="#E63946" />
      <path d="M14 41 Q20 39 26 41" stroke="#fff" strokeWidth="1.2" fill="none" />
      <path d="M38 41 Q44 39 50 41" stroke="#fff" strokeWidth="1.2" fill="none" />
      <path d="M16 36 Q16 18 32 18 Q48 18 48 36 Q40 32 32 32 Q24 32 16 36 Z" fill="#1F3A78" />
      <circle cx="24" cy="26" r="0.9" fill="#fff" />
      <circle cx="32" cy="22" r="0.9" fill="#fff" />
      <circle cx="40" cy="26" r="0.9" fill="#fff" />
      <circle cx="28" cy="30" r="0.9" fill="#fff" />
      <circle cx="36" cy="30" r="0.9" fill="#fff" />
    </svg>
  );
}

function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center px-4 py-10" data-testid="screen-auth">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <HatMark />
          <div className="mt-3 text-xl font-bold text-text-primary">OpenDoorAI</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-text-secondary">Career momentum coach</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-5">
            <div className="text-lg font-semibold text-text-primary" data-testid="text-auth-title">{title}</div>
            <div className="mt-1 text-sm text-text-secondary">{subtitle}</div>
          </div>
          {children}
        </div>
        <div className="mt-4 text-center text-sm text-text-secondary">{footer}</div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, testId, autoComplete }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; testId: string; autoComplete?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-text-secondary mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        data-testid={testId}
      />
    </label>
  );
}

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  if (user) {
    const to = (location.state as any)?.from || "/";
    return <Navigate to={to} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = login({ email, password });
    if (!result.ok) setError(result.error || "Login failed.");
    else navigate((location.state as any)?.from || "/", { replace: true });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Howdy! Log in and we'll pick right back up where ya left off."
      footer={
        <>
          New here?{" "}
          <button onClick={() => navigate("/signup")} className="font-medium text-primary-dark underline" data-testid="link-go-signup">
            Create an account
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3" data-testid="form-login">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" testId="input-login-email" autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} testId="input-login-password" autoComplete="current-password" />
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800" data-testid="text-login-error">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full bg-primary rounded-full" data-testid="button-login-submit">
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}

export function SignupPage() {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = signUp({ name, email, password });
    if (!result.ok) setError(result.error || "Sign up failed.");
    else navigate("/", { replace: true });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Takes about 30 seconds. We'll save your roadmaps, contacts, and progress."
      footer={
        <>
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="font-medium text-primary-dark underline" data-testid="link-go-login">
            Log in
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3" data-testid="form-signup">
        <Field label="Your name" value={name} onChange={setName} placeholder="Jane Doe" testId="input-signup-name" autoComplete="name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" testId="input-signup-email" autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" testId="input-signup-password" autoComplete="new-password" />
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800" data-testid="text-signup-error">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full bg-primary rounded-full" data-testid="button-signup-submit">
          Create account
        </Button>
        <div className="text-[11px] text-text-secondary text-center pt-1">
          By signing up you agree this is a demo and your data is stored locally in your browser.
        </div>
      </form>
    </AuthShell>
  );
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
