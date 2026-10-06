type GhostMarkProps = {
  size?: number;
  className?: string;
};

export function GhostMark({ size = 64, className = "" }: GhostMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M40 8c-15.5 0-26 12.4-26 28.2 0 11.2 3.2 20.4 6.2 27.1 1.8 4.1 6.8 3.4 8.1-.9l2.4-8.1c.5-1.6 2.7-1.6 3.2 0l3.4 10.2c.7 2.1 3.6 2.2 4.4.1l3.4-8.8c.5-1.4 2.5-1.4 3 0l3.5 8.8c.8 2.1 3.7 2 4.4-.1l3.4-10.2c.5-1.6 2.7-1.6 3.2 0l2.4 8.1c1.3 4.3 6.3 5 8.1.9 3-6.7 6.2-15.9 6.2-27.1C66 20.4 55.5 8 40 8Z"
        fill="url(#ghostFill)"
      />
      <circle cx="31.5" cy="34" r="4.2" fill="#1b1228" />
      <circle cx="48.5" cy="34" r="4.2" fill="#1b1228" />
      <circle cx="33" cy="32.6" r="1.3" fill="#fff" />
      <circle cx="50" cy="32.6" r="1.3" fill="#fff" />
      <path
        d="M33 46c2.2 3.4 11.8 3.4 14 0"
        stroke="#1b1228"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="ghostFill" x1="18" y1="10" x2="62" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7F2FF" />
          <stop offset="1" stopColor="#C9B6FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
