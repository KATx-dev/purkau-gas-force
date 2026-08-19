// src/components/shared/loading-spinner.tsx
export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/25 border-t-white" />
      {label ? <p className="text-sm text-white/80">{label}</p> : null}
    </div>
  );
}