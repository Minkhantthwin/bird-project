import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'animate-fade-up rounded-3xl border border-border bg-card/60 p-5 backdrop-blur-xl',
        'hover:scale-[1.03] hover:shadow-md transition-all duration-300 ease-out',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className="mt-2 font-heading text-2xl font-bold">{value}</p>
      {trend && (
        <p
          className={cn(
            'mt-1 text-xs font-medium',
            trend.positive ? 'text-emerald-500' : 'text-rose-500',
          )}
        >
          {trend.positive ? '↑' : '↓'} {trend.value}
        </p>
      )}
    </div>
  );
}
