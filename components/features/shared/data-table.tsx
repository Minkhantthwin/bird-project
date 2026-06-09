import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  emptyMessage = 'No data found.',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card/40 p-12 text-center backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={String(row[keyField])}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                {columns.map((col, i) => {
                  const value =
                    typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as ReactNode);
                  return (
                    <td key={i} className={cn('px-4 py-3', col.className)}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
