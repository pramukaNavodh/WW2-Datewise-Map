"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calender.css";
import { ww2Events, WW2Event } from "@/data/Events";
import EventCard from "@/components/EventCard";
import Script from "next/script";

// Import globe dynamically (client only)
const Globe: any = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function WW2Globe() {
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [date, setDate] = useState<Date>(new Date(1939, 8, 1)); // Default: Sep 1, 1939
  const [selectedEvent, setSelectedEvent] = useState<WW2Event | null>(null);

  // 🪟 Handle dynamic window resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // initialize once
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

    // Set initial zoom/position
    globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 1.5 }, 2000);
  }, [dimensions]);

  //  Filter markers by selected date (YYYY-MM-DD)
  const selectedDateString = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
  const markers = ww2Events.filter((e) => e.date === selectedDateString);

  // loading screen
  if (!dimensions) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-xl">
        Loading globe...
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      {/* 🔹 Site Title + Calendar (top left) */}
      <div className="absolute top-6 left-6 z-50 flex flex-col gap-3">
        <h1 className="text-white text-3xl font-bold tracking-wide drop-shadow-lg">
          WW2 Date-wise Map
        </h1>

        <div className="bg-gray-900/90 rounded-2xl p-3 shadow-lg">
          <Calendar
            onChange={(val) => {
              setDate(val as Date);
              setSelectedEvent(null); // close card when date changes
            }}
            value={date}
            minDate={new Date(1919, 0, 1)}
            maxDate={new Date(1950, 11, 31)}
            className="text-white"
          />
        </div>
      </div>

      {/* Event Card (top right) */}
      {selectedEvent && (
        <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {/* 🌍 Globe */}
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
        onPointClick={(point: WW2Event) => setSelectedEvent(point)}
      />
      {/* ☕ Buy Me a Coffee Widget */}
      <Script
        id="bmc-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var script = document.createElement("script");
            script.setAttribute("data-name", "BMC-Widget");
            script.setAttribute("data-cfasync", "false");
            script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
            script.setAttribute("data-id", "pramuka");
            script.setAttribute("data-description", "Support me on Buy me a coffee!");
            script.setAttribute("data-message", "Thank you very much for your kind support!! 🥰");
            script.setAttribute("data-color", "#FF5F5F");
            script.setAttribute("data-position", "Left");
            script.setAttribute("data-x_margin", "18");
            script.setAttribute("data-y_margin", "18");
            document.body.appendChild(script);
          `,
        }}
      />
      {/* 🌍 Image Credits */}
      <div className="absolute bottom-4 right-4 z-50 text-xs text-gray-300 bg-gray-900/60 px-3 py-2 rounded-lg">
        Images ©{" "}
          <a
            href="https://planetpixelemporium.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
          Planet Pixel Emporium
          </a>{" "}
          & NASA
      </div>
    </div>
  );
}
