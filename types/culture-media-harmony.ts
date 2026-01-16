/**
 * CULTURE & MEDIA HARMONY MODULE
 * TypeScript Type Definitions
 */

export type UUID = string;
export type ISODate = string;
export type URL = string;

export type MediaType = 'video' | 'audio' | 'article' | 'podcast' | 'photo-essay';
export type ContentVisibility = 'public' | 'unlisted' | 'private';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface MediaItem {
  id: UUID;
  type: MediaType;
  title: string;
  description: string;
  contentUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  categories: string[];
  authorId: UUID;
  publishedAt?: ISODate;
  moderationStatus: ModerationStatus;
  ethicsScore: number;
  views: number;
  likes: number;
  visibility: ContentVisibility;
}

export interface TalentProfile {
  id: UUID;
  userId: UUID;
  displayName: string;
  bio?: string;
  avatar?: URL;
  skills: string[];
  verified: boolean;
  availableForWork: boolean;
  projectCount: number;
}

export interface CulturalEvent {
  id: UUID;
  title: string;
  description: string;
  category: string;
  startTime: ISODate;
  endTime: ISODate;
  type: 'online' | 'offline' | 'hybrid';
  capacity?: number;
  attendees: number;
  moderationStatus: ModerationStatus;
}

export interface CultureMetrics {
  media: {
    totalItems: number;
    totalViews: number;
    avgEthicsScore: number;
  };
  talents: {
    totalProfiles: number;
    verified: number;
    activeProjects: number;
  };
  events: {
    totalEvents: number;
    upcoming: number;
    totalAttendees: number;
  };
  engagement: {
    activeUsers: number;
    newUsers: number;
  };
  ethics: {
    avgScore: number;
    approvalRate: number;
  };
}
