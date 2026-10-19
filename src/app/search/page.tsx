import { SearchView } from "@/features/search/SearchView";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Searching…</p>}>
      <SearchView />
    </Suspense>
  );
}
