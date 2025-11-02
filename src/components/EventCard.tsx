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
    <div className="bg-gray-900/95 text-white p-4 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        aria-label="Close"
      >
        ×
      </button>

      {/* Title */}
      <h2 className="text-xl font-bold mb-2 pr-6">{event.title}</h2>

      {/* Image */}
      <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Paragraphs – scrollable */}
      <div className="max-h-48 overflow-y-auto mb-2 text-sm text-gray-300 space-y-2">
        {event.paragraph1 && <p>{event.paragraph1}</p>}
        {event.paragraph2 && <p>{event.paragraph2}</p>}
        {event.paragraph3 && <p>{event.paragraph3}</p>}
      </div>
    </div>
  );
}