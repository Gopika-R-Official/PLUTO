export function ProvenanceNote({
  provenance,
  message,
}: {
  provenance: "live" | "mock";
  message?: string;
}) {
  return (
    <p className="text-xs tracking-wide text-muted">
      {provenance === "live" ? "Live source" : "Sample content"}
      {message ? ` · ${message}` : ""}
    </p>
  );
}
