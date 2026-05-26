import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Marker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  boxCount: number;
}

interface PartnerMapInnerProps {
  markers: Marker[];
  center?: { lat: number; lng: number };
  token: string;
  onMarkerClick?: (id: string) => void;
}

export default function PartnerMapInner({
  markers,
  center = { lat: 43.238949, lng: 76.889709 },
  token,
  onMarkerClick,
}: PartnerMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [center.lng, center.lat],
      zoom: 11,
    });

    mapRef.current = map;

    markers.forEach((m) => {
      const size = Math.min(24, 12 + m.boxCount * 2);
      const el = document.createElement("div");
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = "50%";
      el.style.background = "var(--qayta-earth)";
      el.style.cursor = "pointer";

      const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(
        `<strong>${m.label}</strong><br/>${m.boxCount} active boxes`,
      );

      const marker = new mapboxgl.Marker(el)
        .setLngLat([m.lng, m.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener("click", () => onMarkerClick?.(m.id));
      void marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [markers, center, token, onMarkerClick]);

  return <div ref={containerRef} className="rescue-map" style={{ width: "100%", height: "100%" }} />;
}

