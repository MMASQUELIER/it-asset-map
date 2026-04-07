import {
  mapCardClassName,
  surfacePanelClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { FeedbackNotice } from "@/features/infrastructure-map/ui/FeedbackNotice";

interface InfrastructureMapStatusProps {
  message: string;
  title: string;
  tone?: "error" | "info";
}

export function InfrastructureMapStatus({
  message,
  title,
  tone = "info",
}: InfrastructureMapStatusProps) {
  return (
    <section className={`${mapCardClassName} grid min-h-[420px] place-items-center p-4 sm:p-5 lg:p-6`}>
      <div className={`${surfacePanelClassName} max-w-[30rem] p-5 sm:p-6`}>
        <FeedbackNotice
          message={message}
          title={title}
          tone={tone}
        />
      </div>
    </section>
  );
}
