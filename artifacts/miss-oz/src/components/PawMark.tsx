export default function PawMark({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="17" cy="22" rx="7.5" ry="6.5" fill="currentColor" />
      <ellipse cx="7" cy="14" rx="3.2" ry="4.2" fill="currentColor" transform="rotate(-18 7 14)" />
      <ellipse cx="13.5" cy="9.5" rx="3.2" ry="4.2" fill="currentColor" transform="rotate(-6 13.5 9.5)" />
      <ellipse cx="20.5" cy="9.5" rx="3.2" ry="4.2" fill="currentColor" transform="rotate(6 20.5 9.5)" />
      <ellipse cx="27" cy="14" rx="3.2" ry="4.2" fill="currentColor" transform="rotate(18 27 14)" />
    </svg>
  );
}
