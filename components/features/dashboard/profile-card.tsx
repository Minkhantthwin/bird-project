import { StatCard } from '@/components/features/shared/stat-card';
import { getUserProfileData } from '@/lib/data-service';

interface ProfileCardProps {
  userId: string;
}

export async function ProfileCard({ userId }: ProfileCardProps) {
  const data = await getUserProfileData(userId);

  const roleBadge: Record<string, string> = {
    Admin: 'bg-rose-500/10 text-rose-500',
    Instructor: 'bg-sky-500/10 text-sky-500',
    Member: 'bg-emerald-500/10 text-emerald-500',
  };

  return (
    <div className="space-y-6">
      {/* Avatar + Info */}
      <div className="flex items-center gap-4 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
          {data.full_name.charAt(0)}
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">{data.full_name}</h1>
          <p className="text-sm text-muted-foreground">{data.email}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className={`
              rounded-full px-2 py-0.5 text-xs font-medium
              ${roleBadge[data.role_name] ?? 'bg-muted text-muted-foreground'}
            `}>
              {data.role_name}
            </span>
            <span className="text-xs text-muted-foreground">
              Joined{' '}
              {new Date(data.created_at).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Artist Record */}
      {data.artistRecord && (
        <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Artist Record
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Stage Name</p>
              <p className="font-medium">{data.artistRecord.stage_name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Specialty</p>
              <p className="font-medium">{data.artistRecord.specialty ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Join Date</p>
              <p className="font-medium">
                {new Date(data.artistRecord.join_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sessions Attended" value={data.attendanceCount} icon="📋" />
        <StatCard label="Posts Created" value={data.postCount} icon="📝" />
        <StatCard
          label="Attendance Rate"
          value={`${data.attendanceRate}%`}
          icon="✅"
          trend={
            data.attendanceRate >= 80
              ? { value: 'Solid', positive: true }
              : { value: 'Low', positive: false }
          }
        />
      </div>
    </div>
  );
}
