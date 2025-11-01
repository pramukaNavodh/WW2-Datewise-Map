"use client";

import Image from "next/image";
import { WW2Event } from "@/data/Events";

interface EventCardProps {
  event: WW2Event;
  onClose: () => void;
}

export default function EventCard({ event, onClose }: EventCardProps) {
  if (!event) return null;

  return (
    <div className="absolute top-6 right-6 z-50 bg-gray-900/95 text-white p-4 rounded-2xl shadow-xl w-80 border border-gray-700 backdrop-blur-md">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-xl font-bold mb-2">{event.title}</h2>

      {/* Image */}
      <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Paragraphs */}
      <div className="max-h-48 overflow-y-auto mb-4">
        <p className="text-sm text-gray-300 mb-2 mt-2">{event.paragraph1}</p>
        <p className="text-sm text-gray-300 mb-2 mt-2">{event.paragraph2}</p>
        <p className="text-sm text-gray-300 mb-2 mt-2">{event.paragraph3}</p>
      </div>
    </div>
  );
}
