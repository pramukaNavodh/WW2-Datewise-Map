"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calender.css";
import { ww2Events } from "@/data/Events";

// Import globe dynamically (client only)
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function WW2Globe() {
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [date, setDate] = useState<Date>(new Date(1939, 8, 1)); // Default: Sep 1, 1939

  // dynamic handle window
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // run once at mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Configure renderer & initial globe POV
  useEffect(() => {
    if (!globeRef.current) return;

    const renderer = globeRef.current.renderer?.();
    if (renderer) {
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.antialias = true;
    }

    // Set initial view
    globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 1 }, 2000);
  }, [dimensions]);

  //  Filter markers by selected date (YYYY-MM-DD)
  const selectedDateString = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
const markers = ww2Events.filter((e) => e.date === selectedDateString);

  // Loading state until dimensions are ready
  if (!dimensions) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-xl">
        Loading globe...
      </div>
    );
  }

  // Render globe + calendar
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      {/*  Calendar - top left */}
      <div className="absolute top-6 left-6 z-50 bg-gray-900/90 rounded-2xl p-3 shadow-lg">
        <Calendar
          onChange={(val) => setDate(val as Date)}
          value={date}
          minDate={new Date(1919, 0, 1)}
          maxDate={new Date(1950, 11, 31)}
          className="text-white"
        />
      </div>

      {/*  Globe */}
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="/textures/earth.jpg"
        bumpImageUrl="/textures/earth-bump.jpg"
        backgroundImageUrl="/textures/stars-bg.jpg"
        pointsData={markers}
        pointAltitude={0.1}
        pointColor={(d: any) => d.color || "white"}
        pointLabel={(d: any) => `${d.title} — ${d.date}`}
      />
    </div>
  );
}
