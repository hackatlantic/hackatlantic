import type { CSSProperties } from "react";

export type Layout = "desktop" | "mobile";

export interface ParticipantResponse {
  id: string;
  label: string;
  question: string;
  answer: string;
  author: string;
  rotation: string;
  desktopFrame: CSSProperties;
  mobileFrame: CSSProperties;
}

export interface PhotoStoryContent {
  photosOnRight: boolean;
  photos: { src: string; alt: string }[];
  responses: ParticipantResponse[];
}

export interface ProjectContent {
  award: string;
  name: string;
  members: string[];
  href: string;
}

export interface JudgeContent {
  name: string;
  roles: string[];
  image: string | null;
  crop: CSSProperties;
  initials: string | null;
}

export interface SponsorContent {
  name: string;
  image: string;
  crop: CSSProperties;
  desktopSize: CSSProperties;
  mobileSize: CSSProperties;
}

export interface RecapContent {
  hero: { image: string; logo: string; title: string; description: string; cta: string };
  statistics: { value: string; label: string }[];
  stories: PhotoStoryContent[];
  awards: { title: string; projects: ProjectContent[] }[];
  judges: JudgeContent[];
  sponsors: { title: string; desktopColumns: number; logos: SponsorContent[] }[];
}
