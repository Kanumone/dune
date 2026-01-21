export type LocationCategory = 'music' | 'weird' | 'party' | 'cozy';
export type Popularity = 'small' | 'medium' | 'large';

export interface Location {
  id: number;
  coords: [number, number]; // [lat, lng]
  title: string;
  district: string;
  size: string;
  description: string;
  badges: string[];
  time: string;
  peak: string;
  categories: LocationCategory[];
  popularity: Popularity;
}
