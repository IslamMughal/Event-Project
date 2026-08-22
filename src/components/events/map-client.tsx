'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Event } from '@/types'

// Vivid Category Marker Palette mapping
const categoryColors: Record<string, string> = {
  music: '#A855F7',  // Vibrant Purple
  tech: '#06B6D4',   // Electric Cyan
  sports: '#F43F5E', // Radiant Rose
  art: '#EC4899',    // Hot Pink
  food: '#F59E0B',   // Amber Gold
  health: '#10B981', // Emerald Green
}

const getCategoryColor = (categorySlug?: string) => {
  if (!categorySlug) return '#7C3AED' // Electric Purple default
  const lower = categorySlug.toLowerCase()
  for (const [key, color] of Object.entries(categoryColors)) {
    if (lower.includes(key)) return color
  }
  return '#7C3AED'
}

// Create custom SVG Leaflet icon function
const createCustomPin = (color: string, isHovered: boolean) => {
  const pinColor = isHovered ? '#F59E0B' : color // Sunset Gold #F59E0B on hover
  const size = isHovered ? 40 : 32
  
  const svgHtml = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0px 6px 10px rgba(124, 58, 237, 0.4));
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="${pinColor}" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="9" r="3.5" fill="#FFFFFF"/>
      </svg>
    </div>
  `

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

interface MapClientProps {
  events: Event[]
  center?: [number, number]
  zoom?: number
  hoveredEventId?: string | null
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center)
  }, [center, map])
  return null
}

const MapClient = ({ events, center = [30.3753, 69.3451], zoom = 6, hoveredEventId }: MapClientProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      {events.map((event) => {
        const lat = event.coordinatesLat ?? event.coordinates?.lat
        const lng = event.coordinatesLng ?? event.coordinates?.lng
        if (lat == null || lng == null) return null
        
        const isHovered = hoveredEventId === String(event.id)
        const catColor = getCategoryColor(event.category?.slug)
        const pinIcon = createCustomPin(catColor, isHovered)
        
        return (
          <Marker 
            key={event.id} 
            position={[lat, lng]}
            icon={pinIcon}
            zIndexOffset={isHovered ? 1000 : 0}
          >
            <Popup className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-1.5 space-y-1">
                {event.category && (
                  <span 
                    className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md text-white inline-block mb-1 shadow-sm"
                    style={{ backgroundColor: catColor }}
                  >
                    {event.category.name}
                  </span>
                )}
                <h3 className="font-extrabold text-sm leading-tight text-slate-900">{event.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{event.venueAddress || event.venue_address}</p>
                <p className="text-xs font-black text-rose-500 pt-1">{event.time} • {event.date}</p>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default MapClient
