import { LoadingSpinner } from "@/components/shared/loading-spinner";

export function QuizLoadingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md">
      <LoadingSpinner label={message} />
    </div>
  );
}