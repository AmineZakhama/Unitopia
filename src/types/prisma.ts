export type LocationType = 
  | 'CLASSROOM'
  | 'LAB'
  | 'LIBRARY'
  | 'OFFICE'
  | 'CAFETERIA'
  | 'SPORTS_FACILITY'
  | 'STUDY_ROOM'
  | 'AUDITORIUM'
  | 'OTHER';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  latitude: number;
  longitude: number;
  building: string;
  floor: number;
  roomNumber: string;
  capacity: number | null;
  description: string | null;
  features: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
