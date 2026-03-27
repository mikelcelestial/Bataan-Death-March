
export enum AppTab {
  MAP = 'MAP',
  STRATEGY = 'STRATEGY',
  CREW = 'CREW',
  STUDIO = 'STUDIO',
  HISTORY = 'HISTORY'
}

export enum RaceType {
  BDM102 = 'BDM102',
  BDM160 = 'BDM160'
}

export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}

export interface RouteMarker {
  km: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface RaceMilestone {
  km: number;
  title: string;
  action: string;
  type: 'nutrition' | 'gear' | 'hydration' | 'mental';
}

export interface CrewInstruction {
  km: number;
  driverTask: string;
  pacerTask: string;
  foodPrep: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: 'gear' | 'food' | 'medical';
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  model: string;
}
