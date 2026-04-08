interface PcCatalogIssuesProps {
  issues: string[];
}

export function PcCatalogIssues({ issues }: PcCatalogIssuesProps) {
  const missingFieldsLabel = `${issues.length} champ${
    issues.length > 1 ? "s" : ""
  } important${issues.length > 1 ? "s" : ""} a renseigner.`;

  return (
    <section className="grid gap-2 rounded-[24px] border border-amber-300/60 bg-amber-50/90 p-4 text-sm text-amber-950">
      <div className="grid gap-1">
        <strong className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-amber-800">
          Catalogue incomplet
        </strong>
        <p className="m-0 leading-6 text-amber-900/85">
          {missingFieldsLabel}
        </p>
      </div>

      <ul className="m-0 grid gap-1.5 pl-5 leading-6">
        {issues.map((issue) => <li key={issue}>{issue}</li>)}
      </ul>
    </section>
  );
}
