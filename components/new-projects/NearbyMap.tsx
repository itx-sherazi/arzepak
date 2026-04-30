"use client";
import { useEffect, useRef } from "react";

interface Props { lat: number; lng: number; address?: string; }

export default function SimpleMap({ lat, lng, address }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    /* Load Leaflet CSS */
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L;
      if (!L || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false })
        .setView([lat, lng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      /* Green teardrop pin */
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:28px;height:36px;
          background:#16a34a;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid #fff;
          box-shadow:0 3px 10px rgba(0,0,0,.35);
        "></div>`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(address || "Project Location", { offset: [0, -30] })
        .openPopup();

      mapRef.current = map;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).L) { init(); }
    else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = init;
      document.head.appendChild(script);
    }

    return () => { mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-gray-200" />;
}
