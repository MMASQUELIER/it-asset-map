import {
  compactNoticeClassName,
  errorNoticeClassName,
  infoNoticeClassName,
  joinClassNames,
  noticeMessageTextClassName,
  noticeTitleTextClassName,
  regularNoticeClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

interface FeedbackNoticeProps {
  className?: string;
  message: string;
  size?: "compact" | "regular";
  title?: string;
  tone?: "error" | "info";
}

export function FeedbackNotice({
  className,
  message,
  size = "regular",
  title,
  tone = "info",
}: FeedbackNoticeProps) {
  return (
    <div
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={joinClassNames(
        tone === "error" ? errorNoticeClassName : infoNoticeClassName,
        size === "compact" ? compactNoticeClassName : regularNoticeClassName,
        className,
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {title !== undefined && title.length > 0
        ? <p className={noticeTitleTextClassName}>{title}</p>
        : null}
      <p className={noticeMessageTextClassName}>{message}</p>
    </div>
  );
}
