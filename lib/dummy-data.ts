import type {
  Role,
  User,
  ArtistRecord,
  Attendance,
  Injury,
  Post,
  Comment,
  Reaction,
} from '@/lib/types';

// ═══════════════════════════════════════════════════════════
// Roles
// ═══════════════════════════════════════════════════════════
const roles: Role[] = [
  {
    id: 'role-00000000-0000-0000-0000-000000000001',
    name: 'Admin',
    description: 'Full access to all club management features and settings.',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-00000000-0000-0000-0000-000000000002',
    name: 'Instructor',
    description: 'Can manage classes, attendance, and student progress.',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-00000000-0000-0000-0000-000000000003',
    name: 'Member',
    description: 'Standard club member with access to social features.',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// Users
// ═══════════════════════════════════════════════════════════
const users: User[] = [
  {
    id: 'user-00000000-0000-0000-0000-000000000001',
    role_id: roles[0]!.id,
    email: 'sakura.tanaka@attandance.com',
    password_hash: '$2b$10$dummy_hash_001',
    full_name: 'Sakura Tanaka',
    created_at: '2024-06-01T08:00:00Z',
  },
  {
    id: 'user-00000000-0000-0000-0000-000000000002',
    role_id: roles[1]!.id,
    email: 'kai.yamamoto@attandance.com',
    password_hash: '$2b$10$dummy_hash_002',
    full_name: 'Kai Yamamoto',
    created_at: '2024-06-15T10:30:00Z',
  },
  {
    id: 'user-00000000-0000-0000-0000-000000000003',
    role_id: roles[1]!.id,
    email: 'luna.park@attandance.com',
    password_hash: '$2b$10$dummy_hash_003',
    full_name: 'Luna Park',
    created_at: '2024-07-01T09:15:00Z',
  },
  {
    id: 'user-00000000-0000-0000-0000-000000000004',
    role_id: roles[2]!.id,
    email: 'riko.sato@attandance.com',
    password_hash: '$2b$10$dummy_hash_004',
    full_name: 'Riko Sato',
    created_at: '2024-08-10T14:00:00Z',
  },
  {
    id: 'user-00000000-0000-0000-0000-000000000005',
    role_id: roles[2]!.id,
    email: 'jihoon.kim@attandance.com',
    password_hash: '$2b$10$dummy_hash_005',
    full_name: 'Jihoon Kim',
    created_at: '2024-08-12T11:00:00Z',
  },
  {
    id: 'user-00000000-0000-0000-0000-000000000006',
    role_id: roles[2]!.id,
    email: 'aria.nguyen@attandance.com',
    password_hash: '$2b$10$dummy_hash_006',
    full_name: 'Aria Nguyen',
    created_at: '2024-09-01T13:45:00Z',
  },
  {
    id: 'user-00000000-0000-0000-0000-000000000007',
    role_id: roles[2]!.id,
    email: 'marco.rossi@attandance.com',
    password_hash: '$2b$10$dummy_hash_007',
    full_name: 'Marco Rossi',
    created_at: '2024-09-15T10:00:00Z',
  },
  {
    id: 'user-00000000-0000-0000-0000-000000000008',
    role_id: roles[2]!.id,
    email: 'zara.williams@attandance.com',
    password_hash: '$2b$10$dummy_hash_008',
    full_name: 'Zara Williams',
    created_at: '2024-10-01T16:30:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// Artist Records
// ═══════════════════════════════════════════════════════════
const artistRecords: ArtistRecord[] = [
  {
    id: 'artist-00000000-0000-0000-0000-000000000001',
    user_id: users[0]!.id,
    stage_name: 'Sakura Blossom',
    specialty: 'Contemporary',
    join_date: '2024-06-01',
    created_at: '2024-06-01T08:00:00Z',
  },
  {
    id: 'artist-00000000-0000-0000-0000-000000000002',
    user_id: users[1]!.id,
    stage_name: 'K-Flow',
    specialty: 'Hip-Hop',
    join_date: '2024-06-15',
    created_at: '2024-06-15T10:30:00Z',
  },
  {
    id: 'artist-00000000-0000-0000-0000-000000000003',
    user_id: users[2]!.id,
    stage_name: 'Luna Eclipse',
    specialty: 'Ballet / Jazz Fusion',
    join_date: '2024-07-01',
    created_at: '2024-07-01T09:15:00Z',
  },
  {
    id: 'artist-00000000-0000-0000-0000-000000000004',
    user_id: users[3]!.id,
    stage_name: 'Riko Beat',
    specialty: 'Street / Breaking',
    join_date: '2024-08-10',
    created_at: '2024-08-10T14:00:00Z',
  },
  {
    id: 'artist-00000000-0000-0000-0000-000000000005',
    user_id: users[4]!.id,
    stage_name: 'J-Shadow',
    specialty: 'Popping & Locking',
    join_date: '2024-08-12',
    created_at: '2024-08-12T11:00:00Z',
  },
  {
    id: 'artist-00000000-0000-0000-0000-000000000006',
    user_id: users[5]!.id,
    stage_name: 'Aria Motion',
    specialty: 'Modern / Lyrical',
    join_date: '2024-09-01',
    created_at: '2024-09-01T13:45:00Z',
  },
  {
    id: 'artist-00000000-0000-0000-0000-000000000007',
    user_id: users[6]!.id,
    stage_name: 'M-Roc',
    specialty: 'Latin / Salsa',
    join_date: '2024-09-15',
    created_at: '2024-09-15T10:00:00Z',
  },
  {
    id: 'artist-00000000-0000-0000-0000-000000000008',
    user_id: users[7]!.id,
    stage_name: 'Zara Flame',
    specialty: 'Afrobeat / Dancehall',
    join_date: '2024-10-01',
    created_at: '2024-10-01T16:30:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// Attendance
// ═══════════════════════════════════════════════════════════
const attendanceRecords: Attendance[] = [
  // --- Sakura (artist-001) ---
  {
    id: 'att-00000000-0000-0000-0000-000000000001',
    artist_record_id: artistRecords[0]!.id,
    session_date: '2025-06-02T10:00:00Z',
    status: 'Present',
    notes: 'Full routine run-through. Excellent form.',
  },
  {
    id: 'att-00000000-0000-0000-0000-000000000002',
    artist_record_id: artistRecords[0]!.id,
    session_date: '2025-06-03T10:00:00Z',
    status: 'Present',
    notes: null,
  },
  {
    id: 'att-00000000-0000-0000-0000-000000000003',
    artist_record_id: artistRecords[0]!.id,
    session_date: '2025-06-05T10:00:00Z',
    status: 'Late',
    notes: 'Arrived 15 min late — traffic.',
  },
  // --- Kai (artist-002) ---
  {
    id: 'att-00000000-0000-0000-0000-000000000004',
    artist_record_id: artistRecords[1]!.id,
    session_date: '2025-06-02T10:00:00Z',
    status: 'Present',
    notes: 'Nailed the freestyle section.',
  },
  {
    id: 'att-00000000-0000-0000-0000-000000000005',
    artist_record_id: artistRecords[1]!.id,
    session_date: '2025-06-03T10:00:00Z',
    status: 'Absent',
    notes: 'Informed sick via email.',
  },
  // --- Luna (artist-003) ---
  {
    id: 'att-00000000-0000-0000-0000-000000000006',
    artist_record_id: artistRecords[2]!.id,
    session_date: '2025-06-02T10:00:00Z',
    status: 'Present',
    notes: null,
  },
  {
    id: 'att-00000000-0000-0000-0000-000000000007',
    artist_record_id: artistRecords[2]!.id,
    session_date: '2025-06-03T10:00:00Z',
    status: 'Present',
    notes: 'Working on new jazz choreography.',
  },
  // --- Riko (artist-004) ---
  {
    id: 'att-00000000-0000-0000-0000-000000000008',
    artist_record_id: artistRecords[3]!.id,
    session_date: '2025-06-02T10:00:00Z',
    status: 'Present',
    notes: 'Great energy in break battles.',
  },
  // --- Jihoon (artist-005) ---
  {
    id: 'att-00000000-0000-0000-0000-000000000009',
    artist_record_id: artistRecords[4]!.id,
    session_date: '2025-06-02T10:00:00Z',
    status: 'Present',
    notes: null,
  },
  {
    id: 'att-00000000-0000-0000-0000-00000000000a',
    artist_record_id: artistRecords[4]!.id,
    session_date: '2025-06-03T10:00:00Z',
    status: 'Present',
    notes: 'Popping drills — sharp improvement.',
  },
  // --- Aria (artist-006) ---
  {
    id: 'att-00000000-0000-0000-0000-00000000000b',
    artist_record_id: artistRecords[5]!.id,
    session_date: '2025-06-02T10:00:00Z',
    status: 'Late',
    notes: 'Missed warm-up; joined after 10 min.',
  },
  // --- Marco (artist-007) ---
  {
    id: 'att-00000000-0000-0000-0000-00000000000c',
    artist_record_id: artistRecords[6]!.id,
    session_date: '2025-06-02T10:00:00Z',
    status: 'Present',
    notes: 'Partner salsa — smooth transitions.',
  },
  {
    id: 'att-00000000-0000-0000-0000-00000000000d',
    artist_record_id: artistRecords[6]!.id,
    session_date: '2025-06-05T10:00:00Z',
    status: 'Absent',
    notes: null,
  },
  // --- Zara (artist-008) ---
  {
    id: 'att-00000000-0000-0000-0000-00000000000e',
    artist_record_id: artistRecords[7]!.id,
    session_date: '2025-06-02T10:00:00Z',
    status: 'Present',
    notes: 'Afrobeat energy is contagious!',
  },
];

// ═══════════════════════════════════════════════════════════
// Injuries
// ═══════════════════════════════════════════════════════════
const injuries: Injury[] = [
  {
    id: 'inj-00000000-0000-0000-0000-000000000001',
    artist_record_id: artistRecords[3]!.id, // Riko
    incident_date: '2025-05-20',
    severity: 'Moderate',
    description: 'Ankle sprain during a floor spin. Iced and wrapped on site.',
    status: 'Recovering',
  },
  {
    id: 'inj-00000000-0000-0000-0000-000000000002',
    artist_record_id: artistRecords[1]!.id, // Kai
    incident_date: '2025-05-15',
    severity: 'Minor',
    description: 'Neck stiffness after an extended headspin session. Recommended rest.',
    status: 'Cleared',
  },
  {
    id: 'inj-00000000-0000-0000-0000-000000000003',
    artist_record_id: artistRecords[5]!.id, // Aria
    incident_date: '2025-06-01',
    severity: 'Minor',
    description: 'Shin splints from over-practicing lyrical jumps.',
    status: 'Under Treatment',
  },
];

// ═══════════════════════════════════════════════════════════
// Posts
// ═══════════════════════════════════════════════════════════
const posts: Post[] = [
  {
    id: 'post-00000000-0000-0000-0000-000000000001',
    user_id: users[1]!.id,
    title: '🔥 Hip-Hop Workshop Recap',
    body: 'Massive thanks to everyone who showed up for the Saturday workshop! The energy in the room was unreal. We broke down popping fundamentals and ended with an epic cipher. Video dropping soon — stay tuned! 🎥\n\n#attanDANCE #HipHop #Workshop',
    created_at: '2025-06-07T14:00:00Z',
  },
  {
    id: 'post-00000000-0000-0000-0000-000000000002',
    user_id: users[2]!.id,
    title: 'New Jazz Fusion Routine 🌙',
    body: 'Been experimenting with blending classical ballet lines with modern jazz isolations. The result feels like liquid moonlight. Can\'t wait to showcase this at the upcoming recital. Who\'s excited? 💫',
    created_at: '2025-06-06T18:30:00Z',
  },
  {
    id: 'post-00000000-0000-0000-0000-000000000003',
    user_id: users[0]!.id,
    title: '📢 Important: Schedule Change Next Week',
    body: 'Attention all members! Monday and Wednesday classes will swap time slots next week due to the venue renovation. Check the updated calendar on the bulletin board. Reach out if you have any conflicts.',
    created_at: '2025-06-08T09:00:00Z',
  },
  {
    id: 'post-00000000-0000-0000-0000-000000000004',
    user_id: users[4]!.id,
    title: 'Popping Practice — 100 Day Challenge',
    body: 'Day 47 of my 100-day popping challenge and the control is finally starting to click. Here\'s a clip from tonight\'s session. Consistency > intensity. Trust the process. ✨',
    created_at: '2025-06-05T22:15:00Z',
  },
  {
    id: 'post-00000000-0000-0000-0000-000000000005',
    user_id: users[7]!.id,
    title: 'Afrobeat Fridays are BACK 🥁',
    body: 'Starting this Friday we\'re bringing back the Afrobeat open sessions! All levels welcome. Come through, bring your energy, and let\'s move together. 7 PM at Studio B. Spread the word! 🔊',
    created_at: '2025-06-04T12:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// Comments
// ═══════════════════════════════════════════════════════════
const comments: Comment[] = [
  {
    id: 'cmt-00000000-0000-0000-0000-000000000001',
    post_id: posts[0]!.id,
    user_id: users[3]!.id,
    content: 'The cipher at the end was straight fire! Can\'t wait for the video drop. 🔥',
    created_at: '2025-06-07T15:30:00Z',
  },
  {
    id: 'cmt-00000000-0000-0000-0000-000000000002',
    post_id: posts[0]!.id,
    user_id: users[5]!.id,
    content: 'Kai, your popping tutorial was so clear. I finally got the wave right!',
    created_at: '2025-06-07T16:45:00Z',
  },
  {
    id: 'cmt-00000000-0000-0000-0000-000000000003',
    post_id: posts[1]!.id,
    user_id: users[6]!.id,
    content: 'Liquid moonlight is the perfect description. Your artistry is unmatched, Luna.',
    created_at: '2025-06-06T20:00:00Z',
  },
  {
    id: 'cmt-00000000-0000-0000-0000-000000000004',
    post_id: posts[1]!.id,
    user_id: users[0]!.id,
    content: 'This deserves a solo spotlight at the recital. Let\'s make it happen!',
    created_at: '2025-06-06T21:10:00Z',
  },
  {
    id: 'cmt-00000000-0000-0000-0000-000000000005',
    post_id: posts[2]!.id,
    user_id: users[4]!.id,
    content: 'Thanks for the heads-up, Sakura! Calendar updated. ✅',
    created_at: '2025-06-08T09:30:00Z',
  },
  {
    id: 'cmt-00000000-0000-0000-0000-000000000006',
    post_id: posts[4]!.id,
    user_id: users[3]!.id,
    content: 'YES! I\'ve been waiting for this. Bringing my crew Friday! 💃',
    created_at: '2025-06-04T13:20:00Z',
  },
  {
    id: 'cmt-00000000-0000-0000-0000-000000000007',
    post_id: posts[4]!.id,
    user_id: users[1]!.id,
    content: 'Studio B is gonna be lit. Let\'s go! 🚀',
    created_at: '2025-06-04T14:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// Reactions
// ═══════════════════════════════════════════════════════════
const reactions: Reaction[] = [
  // Post 1 reactions
  { id: 'rxn-00000000-0000-0000-0000-000000000001', post_id: posts[0]!.id, user_id: users[3]!.id, reaction_type: 'Fire', created_at: '2025-06-07T15:30:00Z' },
  { id: 'rxn-00000000-0000-0000-0000-000000000002', post_id: posts[0]!.id, user_id: users[5]!.id, reaction_type: 'Like', created_at: '2025-06-07T16:45:00Z' },
  { id: 'rxn-00000000-0000-0000-0000-000000000003', post_id: posts[0]!.id, user_id: users[4]!.id, reaction_type: 'Fire', created_at: '2025-06-07T17:00:00Z' },
  { id: 'rxn-00000000-0000-0000-0000-000000000004', post_id: posts[0]!.id, user_id: users[7]!.id, reaction_type: 'Celebrate', created_at: '2025-06-07T18:15:00Z' },
  // Post 2 reactions
  { id: 'rxn-00000000-0000-0000-0000-000000000005', post_id: posts[1]!.id, user_id: users[6]!.id, reaction_type: 'Love', created_at: '2025-06-06T20:00:00Z' },
  { id: 'rxn-00000000-0000-0000-0000-000000000006', post_id: posts[1]!.id, user_id: users[0]!.id, reaction_type: 'Like', created_at: '2025-06-06T21:10:00Z' },
  { id: 'rxn-00000000-0000-0000-0000-000000000007', post_id: posts[1]!.id, user_id: users[3]!.id, reaction_type: 'Love', created_at: '2025-06-06T22:00:00Z' },
  // Post 3 reactions
  { id: 'rxn-00000000-0000-0000-0000-000000000008', post_id: posts[2]!.id, user_id: users[4]!.id, reaction_type: 'Like', created_at: '2025-06-08T09:30:00Z' },
  { id: 'rxn-00000000-0000-0000-0000-000000000009', post_id: posts[2]!.id, user_id: users[1]!.id, reaction_type: 'Insightful', created_at: '2025-06-08T10:00:00Z' },
  // Post 4 reactions
  { id: 'rxn-00000000-0000-0000-0000-00000000000a', post_id: posts[3]!.id, user_id: users[5]!.id, reaction_type: 'Fire', created_at: '2025-06-05T22:30:00Z' },
  { id: 'rxn-00000000-0000-0000-0000-00000000000b', post_id: posts[3]!.id, user_id: users[2]!.id, reaction_type: 'Like', created_at: '2025-06-05T23:00:00Z' },
  // Post 5 reactions
  { id: 'rxn-00000000-0000-0000-0000-00000000000c', post_id: posts[4]!.id, user_id: users[3]!.id, reaction_type: 'Celebrate', created_at: '2025-06-04T13:20:00Z' },
  { id: 'rxn-00000000-0000-0000-0000-00000000000d', post_id: posts[4]!.id, user_id: users[1]!.id, reaction_type: 'Fire', created_at: '2025-06-04T14:00:00Z' },
];

// ═══════════════════════════════════════════════════════════
// Exports
// ═══════════════════════════════════════════════════════════

/** All dummy data in one place. Useful for seeding or resetting state. */
export const dummyData = {
  roles,
  users,
  artistRecords,
  attendanceRecords,
  injuries,
  posts,
  comments,
  reactions,
} as const;
