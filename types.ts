export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
  VENDOR = 'vendor',
}

export enum AccessLevel {
  READ_WRITE = 'read-write',
  READ_ONLY = 'read-only',
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  access: AccessLevel;
  avatar: string;
}

export enum ProjectStatus {
  ON_TRACK = 'On Track',
  AT_RISK = 'At Risk',
  OFF_TRACK = 'Off Track',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string; // ISO string
  description: string;
  completed: boolean;
  lastModifiedByUserId?: string;
  lastModifiedAt?: string; // ISO string
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  status: ProjectStatus;
  completionPercentage: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  idealProgress: { date: string; value: number }[];
  actualProgress: { date: string; value: number }[];
  timeline: TimelineEvent[];
  mediaAssets: MediaAsset[];
  teamMemberIds: string[];
}