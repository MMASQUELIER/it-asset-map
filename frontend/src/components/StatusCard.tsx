interface StatusCardProps {
  title: string;
  message: string;
  isError?: boolean;
}

export default function StatusCard({ title, message, isError = false }: StatusCardProps) {
  return (
    <div className={`status-card ${isError ? "status-card--error" : ""}`.trim()}>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
}
