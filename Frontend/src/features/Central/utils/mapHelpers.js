import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";



const DEFAULT_CENTER = [-33.4489, -70.6693];

export function MapUpdater({ position }) {
  const map = useMap();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      map.setView(position || DEFAULT_CENTER, position ? 16 : 13);
      return;
    }
    const target = position || DEFAULT_CENTER;
    const zoom = position ? 16 : 13;
    map.flyTo(target, zoom, { duration: 1.5 });
  }, [position, map]);

  return null;
}

export function MapFix() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export function MapClickEvents({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}