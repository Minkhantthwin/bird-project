import { dummyData } from '@/lib/dummy-data';
import { StatCard } from '@/components/features/shared/stat-card';

interface ProfileCardProps {
  userId: string;
}

export function ProfileCard({ userId }: ProfileCardProps) {
  const user = dummyData.users.find((u) => u.id === userId);
  if (!user) return null;

  const artistRecord = dummyData.artistRecords.find((a) => a.user_id === user.id);
  const role = dummyData.roles.find((r) => r.id === user.role_id);
  const userAttendance = dummyData.attendanceRecords.filter((a) => {
    const artist = dummyData.artistRecords.find((ar) => ar.id === a.artist_record_id);
    return artist?.user_id === user.id;
  });
  const presentCount = userAttendance.filter((a) => a.status === 'Present').length;
  const attendanceRate =
    userAttendance.length > 0
      ? Math.round((presentCount / userAttendance.length) * 100)
      : 0;
  const userPosts = dummyData.posts.filter((p) => p.user_id === user.id).length;

  return (
    <div className="space-y-6">
      {/* Avatar + Info */}
      <div className="flex items-center gap-4 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
          {user.full_name.charAt(0)}
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">{user.full_name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {role?.name ?? 'Member'}
            </span>
            <span className="text-xs text-muted-foreground">
              Joined{' '}
              {new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Artist Record */}
      {artistRecord && (
        <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Artist Record
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Stage Name</p>
              <p className="font-medium">{artistRecord.stage_name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Specialty</p>
              <p className="font-medium">{artistRecord.specialty ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Join Date</p>
              <p className="font-medium">
                {new Date(artistRecord.join_date).toLocaleDateString('en-US', {
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
        <StatCard label="Sessions Attended" value={userAttendance.length} icon="📋" />
        <StatCard label="Posts Created" value={userPosts} icon="📝" />
        <StatCard
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          icon="✅"
          trend={
            attendanceRate >= 80
              ? { value: 'Solid', positive: true }
              : { value: 'Low', positive: false }
          }
        />
      </div>
    </div>
  );
}
