export const Duration = ({
  className,
  seconds,
  isCountdown,
}: {
  className?: string;
  seconds: number;
  isCountdown?: boolean;
}) => (
  <time dateTime={`P${Math.round(seconds)}S`} className={className}>
    {format(seconds, isCountdown)}
  </time>
);

function format(seconds: number, isCountdown?: boolean) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${isCountdown ? "-" : ""}${hh}:${pad(mm)}:${ss}`;
  }
  return `${isCountdown ? "-" : ""}${mm}:${ss}`;
}

function pad(string: string | number) {
  return `0${string}`.slice(-2);
}
