"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calender.css";
import { ww2Events, WW2Event } from "@/data/Events";
import EventCard from "@/components/EventCard";
import { Menu, X } from "lucide-react";
import "@/styles/bmc-mobile.css";

const Globe: any = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function WW2Globe() {
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [date, setDate] = useState<Date>(new Date(1919, 0, 18));
  const [selectedEvent, setSelectedEvent] = useState<WW2Event | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Globe configuration
  useEffect(() => {
    if (!globeRef.current || !dimensions) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    globeRef.current.pointOfView({ lat: 39, lng: 34, altitude: 2.5 }, 0);
  }, [dimensions]);

  // Close calendar on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedEvent(null);
        setIsCalendarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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
    script.setAttribute("data-color", "#17a34a");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");
    script.onload = () => {
      const evt = new Event("DOMContentLoaded");
      window.dispatchEvent(evt);
    };
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      const widget = document.getElementById("bmc-wbtn");
      if (widget && widget.parentNode) widget.parentNode.removeChild(widget);
    };
  }, []);

  const selectedDateString = date.toLocaleDateString("en-CA");

  const markers = useMemo(
    () => ww2Events.filter((e) => e.date === selectedDateString),
    [selectedDateString]
  );

  // --- Previous / Next Incident Logic ---
  const sortedDates = useMemo(() => {
    const unique = Array.from(new Set(ww2Events.map((e) => e.date)));
    return unique.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, []);

  const goToPreviousIncident = () => {
    const currentIndex = sortedDates.findIndex((d) => d === selectedDateString);
    let targetDate = "";

    if (currentIndex === -1) {
      const pastDates = sortedDates.filter((d) => new Date(d) < new Date(selectedDateString));
      if (pastDates.length > 0) targetDate = pastDates[pastDates.length - 1];
    } else if (currentIndex > 0) {
      targetDate = sortedDates[currentIndex - 1];
    }

    if (targetDate) {
      setDate(new Date(targetDate));
      setSelectedEvent(null);
    }
  };

  const goToNextIncident = () => {
    const currentIndex = sortedDates.findIndex((d) => d === selectedDateString);
    let targetDate = "";

    if (currentIndex === -1) {
      const futureDates = sortedDates.filter((d) => new Date(d) > new Date(selectedDateString));
      if (futureDates.length > 0) targetDate = futureDates[0];
    } else if (currentIndex < sortedDates.length - 1) {
      targetDate = sortedDates[currentIndex + 1];
    }

    if (targetDate) {
      setDate(new Date(targetDate));
      setSelectedEvent(null);
    }
  };

  const hasPrev = sortedDates.some((d) => new Date(d) < new Date(selectedDateString));
  const hasNext = sortedDates.some((d) => new Date(d) > new Date(selectedDateString));

  if (!dimensions) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-xl">
        Loading globe...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ width: dimensions.width, height: dimensions.height }}>
      <div className="absolute top-4 left-4 z-50 pointer-events-none">
        <h1 className="text-white text-xl md:text-3xl font-bold tracking-wide drop-shadow-lg whitespace-nowrap">
          WW2 Date-wise Map
        </h1>
      </div>

      <button
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="absolute top-12 left-4 z-50 md:hidden bg-gray-900/90 p-3 rounded-full shadow-lg transition-transform hover:scale-110"
        aria-label="Toggle calendar"
      >
        {isCalendarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Calendar + Navigation */}
      <div
        className={`
          absolute top-20 left-4 z-30 bg-gray-900/95 rounded-2xl p-4 shadow-xl transition-all duration-300
          md:translate-x-0 md:opacity-100 md:pointer-events-auto md:top-16 md:z-40
          ${isCalendarOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "-translate-x-full opacity-0 pointer-events-none"}
          md:max-w-xs w-80
        `}
      >
        <Calendar
          onChange={(val) => {
            setDate(val as Date);
            setSelectedEvent(null);
            setIsCalendarOpen(false);
          }}
          value={date}
          minDate={new Date(1800, 0, 1)}
          maxDate={new Date(2025, 11, 31)}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;
            const str = date.toLocaleDateString("en-CA");
            const count = ww2Events.filter((e) => e.date === str).length;
            if (count === 0) return null;
            return (
              <div className="flex justify-center -mt-1">
                <span className="bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              </div>
            );
          }}
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={goToPreviousIncident}
            disabled={!hasPrev}
            className={`bg-gray-800 text-white text-sm px-3 py-2 rounded-lg transition ${
              !hasPrev ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
          >
            ← Previous Incident
          </button>
          <button
            onClick={goToNextIncident}
            disabled={!hasNext}
            className={`bg-gray-800 text-white text-sm px-3 py-2 rounded-lg transition ${
              !hasNext ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
          >
            Next Incident →
          </button>
        </div>
      </div>

      {selectedEvent && (
        <div
          className={`fixed z-50 flex items-start justify-center p-4 top-20 left-4 w-[calc(100%-2rem)] max-w-md md:top-6 md:right-6 md:left-auto md:w-80`}
        >
          <div className="fixed inset-0 bg-black/70 md:hidden" onClick={() => setSelectedEvent(null)} />
          <div className="relative w-full md:w-auto">
            <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          </div>
        </div>
      )}

      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="/textures/earth.jpg"
        bumpImageUrl="/textures/earth-bump.jpg"
        backgroundImageUrl="/textures/stars-bg.jpg"
        pointsData={markers}
        pointAltitude={0.1}
        pointColor={() => "#ff3333"}
        pointLabel={(d: any) => `${d.title} — ${d.date}`}
        onPointClick={(point: WW2Event) => {
          setSelectedEvent(point);
          globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 0.8 }, 1000);
        }}
        htmlElementsData={markers}
        htmlElement={(d: any) => {
          const el = document.createElement("div");
          el.innerHTML = `<div class="pulse-marker"></div>`;
          el.style.cursor = "pointer";
          el.onclick = () => {
            setSelectedEvent(d);
            globeRef.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 0.8 }, 1000);
          };
          return el;
        }}
      />

      <div className="absolute bottom-4 left-4 z-40 text-[10px] md:text-xs text-gray-300 bg-gray-900/60 px-2 py-1 md:px-3 md:py-2 rounded-lg">
        Images ©{" "}
        <a href="https://planetpixelemporium.com/" target="_blank" rel="noopener noreferrer" className="underline">
          Planet Pixel Emporium
        </a>{" "}
        & NASA
      </div>
    </div>
  );
}
