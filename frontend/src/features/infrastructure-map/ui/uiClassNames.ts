export function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

export const surfacePanelClassName = joinClassNames(
  "rounded-[28px] border border-schneider-900/8",
  "bg-[linear-gradient(180deg,rgba(236,242,238,0.96),rgba(227,234,229,0.96))]",
  "shadow-[0_24px_52px_rgba(16,38,26,0.08)]",
);

export const mapCardClassName = joinClassNames(
  "relative isolate overflow-hidden rounded-[34px] border border-schneider-900/8",
  "bg-[linear-gradient(180deg,rgba(239,244,240,0.98),rgba(224,231,226,0.98))]",
  "shadow-[0_36px_84px_rgba(16,38,26,0.1)]",
);

export const executivePanelClassName = joinClassNames(
  "rounded-[30px] border border-white/10",
  "bg-[linear-gradient(145deg,#0b1f15,#123326_48%,#1b4b34)] text-white",
  "shadow-[0_34px_72px_rgba(11,28,20,0.24)]",
);

export const metricRailClassName = joinClassNames(
  "rounded-[30px] border border-schneider-900/8",
  "bg-[linear-gradient(180deg,rgba(223,230,225,0.92),rgba(213,221,216,0.94))]",
  "shadow-[0_18px_40px_rgba(16,38,26,0.08)]",
);

export const floatingPanelClassName = joinClassNames(
  surfacePanelClassName,
  "absolute right-3 top-3 z-[800] w-[min(26rem,calc(100%-1.5rem))] p-5",
  "md:right-5 md:top-5 md:w-[26rem]",
);

export const scrollableFloatingPanelClassName = joinClassNames(
  floatingPanelClassName,
  "max-h-[calc(100%-1.5rem)] overflow-y-auto md:max-h-[calc(100%-2.5rem)]",
);

export const eyebrowTextClassName =
  "m-0 text-[0.72rem] font-black uppercase tracking-[0.18em] text-schneider-700";

export const panelTitleTextClassName =
  "m-0 text-[1.08rem] font-black tracking-[-0.01em] text-schneider-950";

export const panelDescriptionTextClassName =
  "m-0 text-sm leading-6 text-schneider-800/75";

export const closeButtonClassName = joinClassNames(
  "inline-flex min-h-10 items-center justify-center rounded-[18px] border px-4",
  "border-schneider-950/10 bg-schneider-50/88 text-[0.9rem] font-bold text-schneider-900",
  "shadow-[0_10px_20px_rgba(16,38,26,0.05)] transition",
  "hover:-translate-y-0.5 hover:border-schneider-700/20 hover:bg-schneider-100/90",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/30",
);

export const fieldGroupClassName = "grid gap-2.5";

export const fieldLabelTextClassName =
  "text-[0.76rem] font-bold uppercase tracking-[0.12em] text-schneider-800/70";

export const textInputClassName = joinClassNames(
  "w-full rounded-[18px] border border-schneider-900/10 bg-[#f2f6f2] px-4 py-3",
  "text-[0.95rem] font-medium text-schneider-950",
  "shadow-[inset_0_1px_2px_rgba(16,38,26,0.04)]",
  "placeholder:text-schneider-700/45",
  "focus:border-schneider-500/50 focus:outline-none focus:ring-4 focus:ring-schneider-500/12",
);

export const detailsGridClassName = joinClassNames(
  "grid gap-3 rounded-[24px] border border-schneider-900/8 bg-schneider-100/62 p-4",
  "sm:grid-cols-2",
);

export const detailLabelTextClassName =
  "text-[0.68rem] font-black uppercase tracking-[0.14em] text-schneider-800/65";

export const panelActionRowClassName = "flex flex-col gap-3 sm:flex-row";

export const primaryButtonClassName = joinClassNames(
  "inline-flex min-h-11 items-center justify-center rounded-[18px] px-5",
  "border border-schneider-700/10 bg-schneider-700 text-[0.92rem] font-black text-white",
  "shadow-[0_14px_26px_rgba(15,122,70,0.18)] transition",
  "hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/35",
);

export const secondaryButtonClassName = joinClassNames(
  "inline-flex min-h-11 items-center justify-center rounded-[18px] border px-5",
  "border-schneider-950/10 bg-schneider-50/82 text-[0.92rem] font-bold text-schneider-900 transition",
  "shadow-[0_10px_18px_rgba(16,38,26,0.04)]",
  "hover:-translate-y-0.5 hover:border-schneider-700/20 hover:bg-schneider-100/80",
  "disabled:cursor-not-allowed disabled:opacity-45",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/25",
);

export const infoBadgeClassName = joinClassNames(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-[0.78rem] font-bold",
  "border-schneider-900/8 bg-schneider-100/76 text-schneider-900",
);
