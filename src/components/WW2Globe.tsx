"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function WW2Globe() {
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // run once
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const renderer = globeRef.current.renderer?.();
    if (renderer) {
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.antialias = true;
    }
    globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 2000);
  }, [dimensions]);

  const markers = [
    { 
        lat: 52.2297, 
        lng: 21.0122, 
        size: 1, 
        color: "red", 
        label: "Germany invades Poland (1939)" },
    { 
        lat: 35.6895, 
        lng: 139.6917, 
        size: 1, 
        color: "orange", 
        label: "Tokyo Bombing (1945)" },
  ];

  // 🧠 Don't render anything until dimensions are known (prevents hydration mismatch)
  if (!dimensions) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="/textures/earth.jpg"
        bumpImageUrl="/textures/earth-bump.jpg"
        backgroundImageUrl="/textures/stars-bg.jpg"
        pointsData={markers}
        pointAltitude={0.03}
        pointColor={(d: any) => d.color}
        pointLabel={(d: any) => d.label}
      />
    </div>
  );
}
