"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { clients } from "@/data/mock";

export default function WorldMap() {
  const ref = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    if (!ref.current || map.current) return;

    const m = L.map(ref.current, {
      center: [25, 10],
      zoom: 1.6,
      minZoom: 1.5,
      maxZoom: 6,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
      scrollWheelZoom: false,
    });

    L.tileLayer(
      isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(m);

    L.control.zoom({ position: "bottomright" }).addTo(m);

    clients.forEach((client) => {
      const intensity = Math.min(client.mrr / 22000, 1);
      const size = 8 + intensity * 16;

      const html = `
        <div style="position:relative;width:${size}px;height:${size}px;">
          <div style="position:absolute;inset:0;border-radius:9999px;background:radial-gradient(circle, rgba(96,134,255,0.6) 0%, rgba(139,92,246,0.4) 60%, transparent 100%);animation:pulse 2.6s infinite;"></div>
          <div style="position:absolute;inset:25%;border-radius:9999px;background:linear-gradient(135deg,#6086ff,#8b5cf6);box-shadow:0 0 12px rgba(96,134,255,0.6);"></div>
        </div>
        <style>@keyframes pulse{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2);opacity:0}}</style>
      `;

      const popupText = isDark
        ? { name: "#f8fafc", sub: "#94a3b8", mrr: "#8ba6ff" }
        : { name: "#0f172a", sub: "#64748b", mrr: "#3a60ff" };

      L.marker([client.location.lat, client.location.lng], {
        icon: L.divIcon({
          html,
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        }),
      })
        .bindPopup(
          `<div style="font-family:Inter,system-ui,sans-serif;color:${popupText.name};padding:2px 4px;">
            <div style="font-weight:700;font-size:13px;">${client.company}</div>
            <div style="font-size:11px;color:${popupText.sub};margin-top:2px;">${client.location.city}, ${client.location.country}</div>
            <div style="font-size:11px;color:${popupText.mrr};font-weight:600;margin-top:4px;">$${client.mrr.toLocaleString()} MRR</div>
          </div>`,
          { closeButton: false }
        )
        .addTo(m);
    });

    map.current = m;

    return () => {
      m.remove();
      map.current = null;
    };
  }, [isDark]);

  const bg = isDark ? "#0a0e1a" : "#e8ecf3";
  const popupBg = isDark ? "rgba(18, 22, 36, 0.92)" : "rgba(255, 255, 255, 0.95)";
  const popupBorder = isDark
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(15, 23, 42, 0.1)";
  const ctrlBg = isDark ? "rgba(20, 24, 38, 0.85)" : "rgba(255, 255, 255, 0.9)";
  const ctrlText = isDark ? "#ffffff" : "#0f172a";
  const ctrlHover = isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(15, 23, 42, 0.06)";

  return (
    <div className="relative h-full w-full">
      <div
        ref={ref}
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{ background: bg }}
      />
      <style jsx global>{`
        .leaflet-container {
          background: ${bg};
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          background: ${popupBg};
          border-radius: 10px;
          padding: 8px 4px;
          border: 1px solid ${popupBorder};
          backdrop-filter: blur(12px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, ${isDark ? 0.6 : 0.18});
        }
        .leaflet-popup-tip {
          background: ${popupBg};
          border: 1px solid ${popupBorder};
        }
        .leaflet-control-zoom {
          border: 1px solid ${popupBorder} !important;
          background: ${ctrlBg} !important;
          backdrop-filter: blur(12px);
          border-radius: 10px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: transparent !important;
          color: ${ctrlText} !important;
          border: none !important;
        }
        .leaflet-control-zoom a:hover {
          background: ${ctrlHover} !important;
        }
      `}</style>
    </div>
  );
}
