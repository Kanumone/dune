export type LocationCategory = 'music' | 'weird' | 'party' | 'cozy';
export type Popularity = 'small' | 'medium' | 'large';

export interface Location {
  id: number;
  coords: [number, number]; // [lat, lng]
  title: string;
  size: string;
  description: string;
  badges: string[];
  categories: LocationCategory[];
  popularity: Popularity;
  clicks: number;
}
