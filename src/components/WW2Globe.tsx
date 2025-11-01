"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calender.css";
import { ww2Events, WW2Event } from "@/data/Events";
import EventCard from "@/components/EventCard";

// ----------------------------
// 📱 Mobile detection hook
// ----------------------------
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

// 🪐 Dynamic import for Globe (client-only)
const Globe: any = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function WW2Globe() {
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [date, setDate] = useState<Date>(new Date(1919, 0, 18));
  const [selectedEvent, setSelectedEvent] = useState<WW2Event | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  const isMobile = useIsMobile();

  // ----------------------------
  // 🪟 Responsive screen tracking
  // ----------------------------
  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    window.addEventListener("orientationchange", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("orientationchange", updateSize);
    };
  }, []);

  // ----------------------------
  // 🌍 Texture URLs (absolute)
  // ----------------------------
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const globeTexture = isMobile
    ? `${baseUrl}/textures/earth-mobile.jpg`
    : `${baseUrl}/textures/earth.jpg`;
  const bumpTexture = `${baseUrl}/textures/earth-bump.jpg`;
  const backgroundTexture = `${baseUrl}/textures/stars-bg.jpg`;

  // ----------------------------
  // 🧩 Preload textures before rendering
  // ----------------------------
  useEffect(() => {
    let loaded = 0;
    const total = isMobile ? 2 : 3; // globe + background (+ bump if desktop)
    const onLoad = () => {
      loaded++;
      if (loaded >= total) setTexturesLoaded(true);
    };

    const preload = (src: string) => {
      const img = new Image();
      img.src = src;
      img.onload = onLoad;
      img.onerror = onLoad;
    };

    preload(globeTexture);
    preload(backgroundTexture);
    if (!isMobile) preload(bumpTexture);
  }, [globeTexture, bumpTexture, backgroundTexture, isMobile]);

  // ----------------------------
  // 🌍 Force translations fallback for Globe
  // ----------------------------
  useEffect(() => {
    if (typeof window !== "undefined" && (Globe as any).registerClientLocalizations) {
      try {
        (Globe as any).registerClientLocalizations({ translations: {} });
      } catch (err) {
        console.warn("Globe localization patch failed:", err);
      }
    }
  }, []);

  // ----------------------------
  // 🌍 Configure renderer and POV
  // ----------------------------
  useEffect(() => {
    if (!globeRef.current) return;

    const renderer = globeRef.current.renderer?.();
    if (renderer) {
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.antialias = !isMobile;
    }

    const altitude = isMobile ? 2.6 : 1.5;
    globeRef.current.pointOfView({ lat: 20, lng: 0, altitude }, 2000);
  }, [dimensions, isMobile]);

  // ----------------------------
  // 🔁 Re-render fix for Safari
  // ----------------------------
  useEffect(() => {
    if (globeRef.current && dimensions) {
      setTimeout(() => {
        if (globeRef.current.refresh) globeRef.current.refresh();
      }, 400);
    }
  }, [dimensions]);

  // ----------------------------
  // ☕ Buy Me a Coffee widget
  // ----------------------------
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
      if (script.parentNode) script.parentNode.removeChild(script);
      const widget = document.getElementById("bmc-wbtn");
      if (widget && widget.parentNode) widget.parentNode.removeChild(widget);
    };
  }, []);

  // ----------------------------
  // 🎯 Event filtering
  // ----------------------------
  const selectedDateString = date.toLocaleDateString("en-CA");
  const markers = ww2Events.filter((e) => e.date === selectedDateString);

  // ----------------------------
  // 🧱 Loading state
  // ----------------------------
  if (!dimensions || !texturesLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl">
        Loading globe...
      </div>
    );
  }

  // ----------------------------
  // 🌍 Main Render
  // ----------------------------
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        width: "100vw",
        height: `${window.innerHeight}px`,
      }}
    >
      {/* 📅 Title + Calendar */}
      {!isMobile || showCalendar ? (
        <div className="absolute top-2 left-2 z-50 flex flex-col gap-2 w-[85vw] sm:w-auto sm:max-w-xs">
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-lg text-center sm:text-left">
            WW2 Date-wise Map
          </h1>

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

      {/* 📜 Event Card */}
      {selectedEvent && (
        <div className="absolute top-4 right-4 z-50 max-w-sm">
          <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
      )}

      {/* 🌍 The Globe */}
      {!isMobile && dimensions && texturesLoaded ? (
      <Globe
        key="desktop"
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={globeTexture}
        bumpImageUrl={bumpTexture}
        backgroundImageUrl={backgroundTexture}
        pointsData={markers}
        pointAltitude={0.1}
        pointColor={(d: any) => d.color || "white"}
        pointLabel={(d: any) => `${d.title} — ${d.date}`}
        onPointClick={(point: WW2Event) => setSelectedEvent(point)}
      />
      ) : (
      <img
        src={globeTexture}
        alt="WW2 Globe"
        className="w-full h-full object-cover"
      />
)}

      {/* 🖼️ Image Credits */}
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
