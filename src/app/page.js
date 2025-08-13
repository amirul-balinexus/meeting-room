"use client";
import Link from "next/link";

const rooms = [
  {
    slug: "agung-room",
    title: "1st Floor - Agung Room",
    description: "Main meeting room on the first floor",
    color: "bg-purple-600",
  },
  {
    slug: "bali-room",
    title: "2nd Floor - Bali Room",
    description: "Conference room on the second floor",
    color: "bg-red-600",
  },
  {
    slug: "java-room",
    title: "3rd Floor - Java Room",
    description: "Meeting space on the third floor",
    color: "bg-green-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meeting Room Calendars
          </h1>
          <p className="text-xl text-gray-600">
            Select a room to view its calendar and availability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link
              key={room.slug}
              href={`/${room.slug}`}
              className="block group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <div className={`h-4 ${room.color}`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  <div className="flex items-center text-purple-600 font-medium">
                    <span>View Calendar</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Each room calendar refreshes automatically every 5 minutes and
            supports fullscreen view
          </p>
        </div>
      </div>
    </div>
  );
}
