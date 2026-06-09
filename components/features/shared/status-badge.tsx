import { cn } from '@/lib/utils';

type StatusType = 'Present' | 'Absent' | 'Late' | 'Recovering' | 'Cleared' | 'Under Treatment';

const statusStyles: Record<string, string> = {
  Present: 'bg-emerald-500/10 text-emerald-500',
  Absent: 'bg-rose-500/10 text-rose-500',
  Late: 'bg-amber-500/10 text-amber-500',
  Recovering: 'bg-amber-500/10 text-amber-500',
  Cleared: 'bg-emerald-500/10 text-emerald-500',
  'Under Treatment': 'bg-rose-500/10 text-rose-500',
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status] ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {status}
    </span>
  );
}
