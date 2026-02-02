import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card" data-testid="screen-not-found">
      <div className="flex items-center gap-2" data-testid="row-not-found-header">
        <AlertCircle className="h-5 w-5 text-text-secondary" />
        <h1 className="text-lg font-semibold" data-testid="text-not-found-title">
          Page not found
        </h1>
      </div>
      <p className="mt-2 text-sm text-text-secondary" data-testid="text-not-found-body">
        The page you’re looking for doesn’t exist.
      </p>
    </div>
  );
}
