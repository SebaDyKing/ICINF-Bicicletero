import { BarChart3 } from 'lucide-react';

export default function AnimatedBarChart({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" x2="18" y1="20" y2="10" className="animate-bar" style={{ animationDelay: '0s' }} />
      <line x1="12" x2="12" y1="20" y2="4" className="animate-bar" style={{ animationDelay: '0.2s' }} />
      <line x1="6" x2="6" y1="20" y2="14" className="animate-bar" style={{ animationDelay: '0.4s' }} />
    </svg>
  );
}
