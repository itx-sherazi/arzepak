"use client";

import { MapPin } from "lucide-react";
import type { ProjectDetail } from "@/types/project";
import { isTrustedMapsUrl } from "./locationUtils";

type Props = {
  project: ProjectDetail;
  mapRevealed: boolean;
  onRevealMap: () => void;
};

export default function LocationMapPanel({ project, mapRevealed, onRevealMap }: Props) {
  const mapUrl = project.mapUrl?.trim();
  const bgImg = project.images?.[0];
  const isEmbed = Boolean(mapUrl && isTrustedMapsUrl(mapUrl) && /\/maps\/embed/i.test(mapUrl));

  if (isEmbed && mapUrl) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-slate-200/80 min-h-[280px] sm:min-h-[320px]">
        {!mapRevealed ? (
          <>
            {bgImg && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 scale-105"
                style={{ backgroundImage: `url(${bgImg})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100/90 via-slate-200/40 to-slate-300/60" />
            <button
              type="button"
              onClick={onRevealMap}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 cursor-pointer"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-7 max-w-md text-center">
                <MapPin className="w-11 h-11 text-green-600 mx-auto mb-3" strokeWidth={2} />
                <span className="block font-bold text-gray-900 text-lg leading-snug">Tap to view society map</span>
                <span className="block text-sm text-gray-500 mt-2 leading-relaxed">
                  Find the location of this project on an interactive map
                </span>
              </div>
            </button>
          </>
        ) : (
          <iframe
            title="Project location map"
            src={mapUrl}
            className="w-full min-h-[320px] sm:min-h-[400px] border-0 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  const linkHref =
    mapUrl && isTrustedMapsUrl(mapUrl)
      ? mapUrl
      : project.latitude != null && project.longitude != null
        ? `https://www.google.com/maps?q=${project.latitude},${project.longitude}`
        : null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-slate-200/80 min-h-[280px] sm:min-h-[320px]">
      {bgImg && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 scale-105"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100/85 via-slate-200/50 to-emerald-900/10" />
      {linkHref ? (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-7 max-w-md text-center">
            <MapPin className="w-11 h-11 text-green-600 mx-auto mb-3" strokeWidth={2} />
            <span className="block font-bold text-gray-900 text-lg leading-snug">Tap to open in Google Maps</span>
            <span className="block text-sm text-gray-500 mt-2 leading-relaxed">
              View the exact location and explore the area
            </span>
          </div>
        </a>
      ) : (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-7 max-w-md text-center">
            <MapPin className="w-11 h-11 text-gray-300 mx-auto mb-3" strokeWidth={2} />
            <span className="block font-bold text-gray-800 text-lg">Map link not added</span>
            <span className="block text-sm text-gray-500 mt-2">
              Add an embed or Maps link from the admin dashboard to show the map here.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
