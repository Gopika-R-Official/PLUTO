import { TogetherView } from "@/features/together/TogetherView";
import { Suspense } from "react";

export default function TogetherPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading Together…</p>}>
      <TogetherView />
    </Suspense>
  );
}
