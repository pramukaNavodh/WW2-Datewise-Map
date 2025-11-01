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

      {/* Description */}
      <p className="text-sm text-gray-300 mb-4">{event.description}</p>
    </div>
  );
}
