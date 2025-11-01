// src/data/ww2Events.ts
export interface WW2Event {
  lat: number;
  lng: number;
  title: string;
  description: string;
  image: string;
  date: string; // use "YYYY-MM-DD" format
  color?: string;
}

export const ww2Events: WW2Event[] = [
  {
    lat: 52.2297,
    lng: 21.0122,
    title: "Germany invades Poland",
    description: "This marked the beginning of World War II as German forces invaded Poland on September 1, 1939.",
    image: "/images/allied.jpg",
    date: "1939-09-01",
    color: "red",
  },
  {
    lat: 35.6895,
    lng: 139.6917,
    title: "Tokyo Bombing",
    description: "In 1945, Allied forces bombed Tokyo, causing massive destruction and civilian casualties.",
    image: "/images/allied.jpg",
    date: "1939-09-01",
    color: "orange",
  },
];
