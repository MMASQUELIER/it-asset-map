export function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

export const surfacePanelClassName = joinClassNames(
  "rounded-[22px] border border-schneider-900/8 bg-white/92",
  "shadow-[0_12px_32px_rgba(16,38,26,0.05)]",
);

export const mapCardClassName = joinClassNames(
  "relative isolate overflow-hidden rounded-[28px] border border-schneider-900/8",
  "bg-[#f5f7f5]",
  "shadow-[0_24px_56px_rgba(16,38,26,0.08)]",
);

export const executivePanelClassName = joinClassNames(
  surfacePanelClassName,
  "bg-schneider-950 text-white",
);

export const metricRailClassName = joinClassNames(
  surfacePanelClassName,
  "bg-schneider-50/80",
);

export const floatingPanelClassName = joinClassNames(
  surfacePanelClassName,
  "absolute right-3 top-3 z-[800] w-[min(28rem,calc(100%-1.5rem))] p-4",
  "md:right-4 md:top-4 md:w-[28rem] md:p-5",
);

export const scrollableFloatingPanelClassName = joinClassNames(
  floatingPanelClassName,
  "max-h-[calc(100%-1.5rem)] overflow-y-auto md:max-h-[calc(100%-2.5rem)]",
);

export const eyebrowTextClassName =
  "m-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-schneider-900/72";

export const panelTitleTextClassName =
  "m-0 text-[1.05rem] font-semibold tracking-[-0.02em] text-schneider-950";

export const panelDescriptionTextClassName =
  "m-0 text-sm leading-6 text-schneider-800/72";

export const closeButtonClassName = joinClassNames(
  "inline-flex min-h-10 items-center justify-center rounded-[14px] border px-4",
  "border-schneider-950/10 bg-white text-[0.88rem] font-medium text-schneider-900",
  "transition hover:border-schneider-700/20 hover:bg-schneider-50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/30",
);

export const fieldGroupClassName = "grid gap-2.5";

export const fieldLabelTextClassName =
  "text-[0.76rem] font-bold uppercase tracking-[0.12em] text-schneider-800/70";

export const textInputClassName = joinClassNames(
  "w-full rounded-[14px] border border-schneider-900/10 bg-white px-4 py-3",
  "text-[0.95rem] font-medium text-schneider-950",
  "shadow-[inset_0_1px_2px_rgba(16,38,26,0.03)]",
  "placeholder:text-schneider-900/38",
  "focus:border-schneider-500/45 focus:outline-none focus:ring-4 focus:ring-schneider-500/10",
);

export const detailsGridClassName = joinClassNames(
  "grid gap-3 rounded-[18px] border border-schneider-900/8 bg-schneider-50/78 p-4",
  "sm:grid-cols-2",
);

export const detailLabelTextClassName =
  "text-[0.68rem] font-black uppercase tracking-[0.14em] text-schneider-800/65";

export const panelActionRowClassName = "flex flex-col gap-3 sm:flex-row";

export const primaryButtonClassName = joinClassNames(
  "inline-flex min-h-11 items-center justify-center rounded-[14px] px-5",
  "border border-schneider-800 bg-schneider-800 text-[0.92rem] font-semibold text-white",
  "transition hover:bg-schneider-700 disabled:cursor-not-allowed disabled:opacity-45",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/35",
);

export const secondaryButtonClassName = joinClassNames(
  "inline-flex min-h-11 items-center justify-center rounded-[14px] border px-5",
  "border-schneider-950/10 bg-white text-[0.92rem] font-medium text-schneider-900 transition",
  "hover:border-schneider-700/20 hover:bg-schneider-50",
  "disabled:cursor-not-allowed disabled:opacity-45",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/25",
);

export const infoBadgeClassName = joinClassNames(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-[0.76rem] font-medium",
  "border-schneider-900/8 bg-white text-schneider-900",
);

export const noticeBaseClassName = joinClassNames(
  "grid gap-1.5 border",
  "shadow-[0_8px_18px_rgba(16,38,26,0.04)]",
);

export const regularNoticeClassName = "rounded-[18px] px-4 py-3.5";

export const compactNoticeClassName = "rounded-[16px] px-3 py-2.5";

export const infoNoticeClassName = joinClassNames(
  noticeBaseClassName,
  "border-schneider-900/8 bg-white/96 text-schneider-900",
);

export const errorNoticeClassName = joinClassNames(
  noticeBaseClassName,
  "border-rose-300/55 bg-rose-50/95 text-schneider-950",
);

export const noticeTitleTextClassName =
  "m-0 text-[0.72rem] font-black uppercase tracking-[0.14em]";

export const noticeMessageTextClassName =
  "m-0 text-sm font-medium leading-6";
