"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calender.css";
import { ww2Events, WW2Event } from "@/data/Events";
import EventCard from "@/components/EventCard";

// Simple hook for mobile detection (or use window.matchMedia)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

// Import globe dynamically (client only)
const Globe: any = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function WW2Globe() {
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [date, setDate] = useState<Date>(new Date(1939, 8, 1)); // Default: Sep 1, 1939
  const [selectedEvent, setSelectedEvent] = useState<WW2Event | null>(null);
  const isMobile = useIsMobile();

  // 👇 NEW: state for showing/hiding calendar on mobile
  const [showCalendar, setShowCalendar] = useState(false);

  // 🪟 Handle dynamic window resizing
 useEffect(() => {
  const updateSize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  updateSize(); // initialize immediately

  window.addEventListener("resize", updateSize);
  window.addEventListener("orientationchange", updateSize); // mobile fix

  return () => {
    window.removeEventListener("resize", updateSize);
    window.removeEventListener("orientationchange", updateSize);
  };
}, []);

  // Configure renderer & initial globe POV (responsive zoom)
  useEffect(() => {
    if (!globeRef.current) return;

    const renderer = globeRef.current.renderer?.();
    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap for mobile perf
      renderer.antialias = !isMobile; // Disable AA on mobile for speed
    }

    // Responsive initial position: Wider view on mobile
    const altitude = isMobile ? 2.5 : 1.5;
    globeRef.current.pointOfView({ lat: 20, lng: 0, altitude }, 2000);
  }, [dimensions, isMobile]);

  // 👇 NEW: ensure globe re-renders properly after resize (especially on mobile Safari)
  useEffect(() => {
    if (globeRef.current && dimensions) {
      setTimeout(() => {
        if (globeRef.current.width) {
          globeRef.current.refresh();
        }
      }, 300);
    }
  }, [dimensions]);

  // Buy Me a Coffee widget
  useEffect(() => {
    if (document.getElementById("bmc-wbtn")) return;

    const script = document.createElement("script");
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.setAttribute("data-id", "pramuka");
    script.setAttribute("data-description", "Support me on Buy me a coffee!");
    script.setAttribute("data-message", "Do you like this project? What about a little donation?");
    script.setAttribute("data-color", "#16a34a");
    script.setAttribute("data-position", "Left");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");

    script.onload = function () {
      const evt = document.createEvent("Event");
      evt.initEvent("DOMContentLoaded", false, false);
      window.dispatchEvent(evt);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      const widget = document.getElementById("bmc-wbtn");
      if (widget && widget.parentNode) {
        widget.parentNode.removeChild(widget);
      }
    };
  }, []);

  // Filter markers by selected date (YYYY-MM-DD)
  const selectedDateString = date.toLocaleDateString("en-CA");
  const markers = ww2Events.filter((e) => e.date === selectedDateString);

  // loading screen
  if (!dimensions) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl">
        Loading globe...
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        width: "100vw",
        height: `${window.innerHeight}px`,
      }}
    >
      {/* 🔹 Site Title + Calendar (top left, compact on mobile) */}
      {!isMobile || showCalendar ? (
        <div className="absolute top-2 left-2 z-50 flex flex-col gap-2 w-[85vw] sm:w-auto sm:max-w-xs">
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-lg text-center sm:text-left">
            WW2 Date-wise Map
          </h1>

          {/* Calendar wrapper – limited height + scroll */}
          <div className="bg-gray-900/90 rounded-2xl p-2 sm:p-3 shadow-lg w-full max-h-[70vh] overflow-y-auto">
            <Calendar
              onChange={(val) => {
                setDate(val as Date);
                setSelectedEvent(null);
              }}
              value={date}
              minDate={new Date(1919, 0, 1)}
              maxDate={new Date(1950, 11, 31)}
              className="text-white w-full"
            />
          </div>

          {/* Close button only for mobile */}
          {isMobile && (
            <button
              onClick={() => setShowCalendar(false)}
              className="bg-gray-700 text-white rounded-lg mt-2 p-2 text-sm"
            >
              Close
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowCalendar(true)}
          className="absolute top-2 left-2 bg-gray-800 text-white rounded-full p-2 z-50 shadow-md"
        >
          📅 View Calendar
        </button>
      )}

      {/* Event Card (top right) */}
      {selectedEvent && (
        <div className="absolute top-4 right-4 z-50 max-w-sm">
          <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
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
        pointAltitude={isMobile ? 0.05 : 0.1}
        pointColor={(d: any) => d.color || "white"}
        pointLabel={(d: any) => `${d.title} — ${d.date}`}
        onPointClick={(point: WW2Event) => setSelectedEvent(point)}
        globeMaterial={isMobile ? { roughness: 1 } : undefined}
        htmlElementsData={[]}
      />

      {/* 🌍 Image Credits */}
      <div className="absolute bottom-4 left-4 z-50 text-xs sm:text-sm text-gray-300 bg-gray-900/60 px-3 py-2 rounded-lg text-center max-w-xs">
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
