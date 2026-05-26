import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER: [number, number] = [33.5, 36.3];
const DEFAULT_ZOOM = 12;

type MapPickerProps = {
  latitude?: number | null;
  longitude?: number | null;
  onChange: (lat: number, lng: number) => void;
  className?: string;
  height?: number;
  hintText?: string;
  loadingText?: string;
};

export default function MapPicker({
  latitude,
  longitude,
  onChange,
  className = '',
  height = 280,
  hintText = 'Click on the map to set your restaurant location.',
  loadingText = 'Loading map...',
}: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const el = containerRef.current;
    const hasCoords = latitude != null && longitude != null && !Number.isNaN(latitude) && !Number.isNaN(longitude);
    const center: [number, number] = hasCoords ? [Number(latitude), Number(longitude)] : DEFAULT_CENTER;
    let map: L.Map | null = null;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const rafId = requestAnimationFrame(() => {
      if (!el.isConnected) return;
      map = L.map(el).setView(center, DEFAULT_ZOOM);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      let marker: L.Marker | null = null;
      if (hasCoords) {
        marker = L.marker(center, { icon }).addTo(map);
        markerRef.current = marker;
      }
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (marker) marker.setLatLng([lat, lng]);
        else {
          marker = L.marker([lat, lng], { icon }).addTo(map!);
          markerRef.current = marker;
        }
        onChangeRef.current(lat, lng);
      });
      mapRef.current = map;
      [0, 100, 300, 500].forEach((delay) => timeouts.push(setTimeout(() => map?.invalidateSize(), delay)));
    });

    const onResize = () => mapRef.current?.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId);
      timeouts.forEach(clearTimeout);
      window.removeEventListener('resize', onResize);
      if (map) map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;
    const hasCoords = latitude != null && longitude != null && !Number.isNaN(latitude) && !Number.isNaN(longitude);
    if (hasCoords) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else {
        const icon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
        markerRef.current = L.marker([lat, lng], { icon }).addTo(mapRef.current);
      }
      mapRef.current.invalidateSize();
    }
  }, [mounted, latitude, longitude]);

  if (!mounted) {
    return (
      <div className={`rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-500 ${className}`} style={{ minHeight: height, height: `${height}px` }}>
        {loadingText}
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-xs text-slate-500 mb-2">{hintText}</p>
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 w-full" style={{ height: `${height}px`, minHeight: 224 }} />
    </div>
  );
}
