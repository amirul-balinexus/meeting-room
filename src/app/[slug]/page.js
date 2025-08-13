"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Room configurations
const roomConfigs = {
  "agung-room": {
    title: "1st Floor - Agung Room",
    calendarId: "Y18xODhhNGY2cXA1ZnBxajJiaWYwaDk0Y3N0cDI0OEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t",
    color: "%239e69af",
    buttonColor: "bg-purple-700 hover:bg-purple-800"
  },
  "bali-room": {
    title: "2nd Floor - Bali Room", 
    calendarId: "Y18xODhhNGY2cXA1ZnBxajJiaWYwaDk0Y3N0cDI0OEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t",
    color: "%23B71C1C",
    buttonColor: "bg-red-700 hover:bg-red-800"
  },
  "java-room": {
    title: "3rd Floor - Java Room",
    calendarId: "Y18xODhhNGY2cXA1ZnBxajJiaWYwaDk0Y3N0cDI0OEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t", 
    color: "%234CAF50",
    buttonColor: "bg-green-700 hover:bg-green-800"
  }
};

export default function RoomPage() {
  const params = useParams();
  const roomSlug = params.slug;
  const iframeRef = useRef(null);
  
  // Get room configuration or redirect to home if invalid
  const roomConfig = roomConfigs[roomSlug];
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    }, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);
  
  if (!roomConfig) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Room Not Found</h1>
          <Link href="/" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }
  
  // Build calendar URL
  const calendarUrl = `https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Asia%2FMakassar&showPrint=0&mode=WEEK&title=${encodeURIComponent(roomConfig.title)}&showTabs=0&showCalendars=0&showDate=0&showNav=0&src=${roomConfig.calendarId}&color=${roomConfig.color}`;

  return (
    <div
      className="w-screen h-screen min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-100"
      style={{ margin: 0, padding: 0 }}>
      <div className="w-full h-full flex-1 flex items-center justify-center relative">
        <iframe
          ref={iframeRef}
          src={calendarUrl}
          style={{ border: "solid 1px #777", width: "100%", height: "100%" }}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
        />
        <div className="absolute top-4 left-4 z-10">
          <h1 className="text-2xl font-bold text-gray-800 bg-white bg-opacity-90 px-4 py-2 rounded shadow">
            {roomConfig.title}
          </h1>
        </div>
        <button
          onClick={() => {
            const iframe = iframeRef.current;
            if (iframe) {
              if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
              } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
              } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
              } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
              }
            }
          }}
          className={`absolute top-4 right-4 z-10 px-4 py-2 text-white rounded shadow focus:outline-none transition-colors ${roomConfig.buttonColor}`}
        >
          Full Screen Preview
        </button>
        <Link
          href="/"
          className="absolute bottom-4 left-4 z-10 px-4 py-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700 focus:outline-none transition-colors"
        >
          ← Back to Rooms
        </Link>
      </div>
    </div>
  );
}
