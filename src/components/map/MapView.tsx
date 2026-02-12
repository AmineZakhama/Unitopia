'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, LocationType } from '@/types/prisma';

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  locations: (Location & { averageRating?: number, totalReviews?: number })[];
  selectedLocation: string | null;
  onLocationSelect: (id: string) => void;
}

// Config for icons (copied from source or defined here)
export const locationTypeConfig: Record<LocationType, { label: string; color: string; icon: string }> = {
  CLASSROOM: { label: 'Classroom', color: '#0ea5e9', icon: '🏫' },
  LAB: { label: 'Laboratory', color: '#8b5cf6', icon: '🔬' },
  LIBRARY: { label: 'Library', color: '#f59e0b', icon: '📚' },
  OFFICE: { label: 'Office', color: '#64748b', icon: '💼' },
  CAFETERIA: { label: 'Cafeteria', color: '#ef4444', icon: '☕' },
  SPORTS_FACILITY: { label: 'Sports', color: '#22c55e', icon: '⚽' },
  STUDY_ROOM: { label: 'Study Room', color: '#ec4899', icon: '📖' },
  AUDITORIUM: { label: 'Auditorium', color: '#6366f1', icon: '🎭' },
  OTHER: { label: 'Other', color: '#94a3b8', icon: '📍' },
};

// Component to handle map updates
function MapController({ selectedLocation, locations }: { selectedLocation: string | null; locations: (Location & { averageRating?: number, totalReviews?: number })[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedLocation) {
      const location = locations.find(l => l.id === selectedLocation);
      if (location) {
        map.flyTo([location.latitude, location.longitude], 18, {
          duration: 1.5
        });
      }
    }
  }, [selectedLocation, locations, map]);
  
  return null;
}

export default function MapView({ locations, selectedLocation, onLocationSelect }: MapViewProps) {
  // Calculate center point from all locations or default
  const centerPoint: [number, number] = locations.length > 0 
    ? [locations[0].latitude, locations[0].longitude] 
    : [51.5074, -0.1278]; // Default (London) or change to campus
  
  // Create custom icons for different location types
  const createCustomIcon = (type: LocationType, isSelected: boolean) => {
    const config = locationTypeConfig[type] || locationTypeConfig.OTHER;
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-center;
        ">
          <div style="
            width: ${isSelected ? '40px' : '32px'};
            height: ${isSelected ? '40px' : '32px'};
            background-color: ${config.color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '20px' : '16px'};
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            border: 3px solid white;
            transition: all 0.3s ease;
            ${isSelected ? 'transform: scale(1.2);' : ''}
          ">
            ${config.icon}
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  return (
    <MapContainer
      center={centerPoint}
      zoom={15}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController selectedLocation={selectedLocation} locations={locations} />
      
      {locations.map((location) => {
        const isSelected = selectedLocation === location.id;
        const config = locationTypeConfig[location.type] || locationTypeConfig.OTHER;
        
        return (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={createCustomIcon(location.type, isSelected)}
            eventHandlers={{
              click: () => onLocationSelect(location.id),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-2xl">{config.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base">{location.name}</h3>
                    <p className="text-xs text-gray-600">{location.building}</p>
                  </div>
                </div>
                
                <div className="space-y-1 mb-2">
                  <p className="text-xs text-gray-700">
                    <strong>Room:</strong> {location.roomNumber} • Floor {location.floor}
                  </p>
                  {location.capacity && (
                    <p className="text-xs text-gray-700">
                      <strong>Capacity:</strong> {location.capacity} people
                    </p>
                  )}
                  {location.averageRating !== undefined && (
                     <div className="flex items-center gap-1 text-xs">
                        <span className="text-orange-500 font-medium">{location.averageRating?.toFixed(1) || 'N/A'} ⭐</span>
                        <span className="text-gray-500">({location.totalReviews || 0} reviews)</span>
                      </div>
                  )}
                </div>
                
                <div className="mb-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      location.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {location.isAvailable ? '🟢 Available' : '🔴 Occupied'}
                    </span>
                 </div>
                
                <p className="text-xs text-gray-600 mb-2">{location.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {location.features.slice(0, 3).map((feature: string, idx: number) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
