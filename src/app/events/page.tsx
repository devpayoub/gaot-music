"use client";

import React, { useState } from "react";
import { Search, Calendar, MapPin, Clock, Users, Ticket, Music, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

// Mock data for events
const events = [
  {
    id: 1,
    title: "Drake World Tour 2024",
    artist: "Drake",
    date: "2024-06-15",
    time: "20:00",
    location: "Madison Square Garden",
    city: "New York, NY",
    image: "/events/drake-concert.jpg",
    price: 89.99,
    capacity: 20000,
    sold: 18500,
    isUpcoming: true,
    genre: "Hip-Hop"
  },
  {
    id: 2,
    title: "Kendrick Lamar Live",
    artist: "Kendrick Lamar",
    date: "2024-07-22",
    time: "19:30",
    location: "Staples Center",
    city: "Los Angeles, CA",
    image: "/events/kendrick-concert.jpg",
    price: 75.50,
    capacity: 19000,
    sold: 12000,
    isUpcoming: true,
    genre: "Hip-Hop"
  },
  {
    id: 3,
    title: "Travis Scott Astroworld Festival",
    artist: "Travis Scott",
    date: "2024-08-10",
    time: "18:00",
    location: "NRG Park",
    city: "Houston, TX",
    image: "/events/travis-festival.jpg",
    price: 150.00,
    capacity: 50000,
    sold: 45000,
    isUpcoming: true,
    genre: "Hip-Hop"
  },
  {
    id: 4,
    title: "J. Cole Dreamville Festival",
    artist: "J. Cole",
    date: "2024-09-05",
    time: "17:00",
    location: "Dorothea Dix Park",
    city: "Raleigh, NC",
    image: "/events/jcole-festival.jpg",
    price: 120.00,
    capacity: 40000,
    sold: 35000,
    isUpcoming: true,
    genre: "Hip-Hop"
  },
  {
    id: 5,
    title: "Post Malone Concert",
    artist: "Post Malone",
    date: "2024-05-20",
    time: "20:30",
    location: "T-Mobile Arena",
    city: "Las Vegas, NV",
    image: "/events/post-concert.jpg",
    price: 95.00,
    capacity: 18000,
    sold: 18000,
    isUpcoming: false,
    genre: "Hip-Hop/Rock"
  },
  {
    id: 6,
    title: "Eminem Live in Detroit",
    artist: "Eminem",
    date: "2024-04-12",
    time: "19:00",
    location: "Ford Field",
    city: "Detroit, MI",
    image: "/events/eminem-concert.jpg",
    price: 110.00,
    capacity: 65000,
    sold: 65000,
    isUpcoming: false,
    genre: "Hip-Hop"
  }
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "upcoming" | "past">("all");

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "upcoming") return matchesSearch && event.isUpcoming;
    if (filterType === "past") return matchesSearch && !event.isUpcoming;
    return matchesSearch;
  });

  const upcomingEvents = events.filter(event => event.isUpcoming);
  const pastEvents = events.filter(event => !event.isUpcoming);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailabilityPercentage = (sold: number, capacity: number) => {
    return Math.round((sold / capacity) * 100);
  };

  const EventCard = ({ event }: { event: typeof events[0] }) => (
    <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-colors">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {event.isUpcoming ? 'UPCOMING' : 'PAST'}
          </div>
          <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            ${event.price}
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-1">{event.title}</h3>
            <p className="text-zinc-400 mb-2">{event.artist}</p>
            <div className="flex items-center space-x-4 text-sm text-zinc-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-zinc-400 mt-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}, {event.city}</span>
            </div>
          </div>
          
          {event.isUpcoming && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Availability</span>
                <span className="text-white">{getAvailabilityPercentage(event.sold, event.capacity)}% sold</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getAvailabilityPercentage(event.sold, event.capacity)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Link href={`/events/${event.id}`} className="flex-1">
              <Button variant="outline" className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                View Details
              </Button>
            </Link>
            {event.isUpcoming && event.sold < event.capacity && (
              <Button className="bg-white text-black hover:bg-gray-200">
                <Ticket className="w-4 h-4 mr-2" />
                Book
              </Button>
            )}
            {event.isUpcoming && event.sold >= event.capacity && (
              <Button disabled className="bg-zinc-600 text-zinc-400 cursor-not-allowed">
                Sold Out
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121315] via-[#17191D] to-[#1a1c20]">
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Music Events
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Discover upcoming concerts, festivals, and live performances from your favorite artists
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search events, artists, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400 h-12"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    onClick={() => setFilterType("all")}
                    className={filterType === "all" ? "bg-white text-black" : "border-zinc-600 text-zinc-300"}
                  >
                    All Events
                  </Button>
                  <Button
                    variant={filterType === "upcoming" ? "default" : "outline"}
                    onClick={() => setFilterType("upcoming")}
                    className={filterType === "upcoming" ? "bg-white text-black" : "border-zinc-600 text-zinc-300"}
                  >
                    Upcoming
                  </Button>
                  <Button
                    variant={filterType === "past" ? "default" : "outline"}
                    onClick={() => setFilterType("past")}
                    className={filterType === "past" ? "bg-white text-black" : "border-zinc-600 text-zinc-300"}
                  >
                    Past
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <CardTitle className="text-2xl text-white">{events.length}</CardTitle>
                  <CardDescription className="text-zinc-400">Total Events</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6 text-center">
                  <Music className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <CardTitle className="text-2xl text-white">{upcomingEvents.length}</CardTitle>
                  <CardDescription className="text-zinc-400">Upcoming</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <CardTitle className="text-2xl text-white">
                    {events.reduce((sum, event) => sum + event.capacity, 0).toLocaleString()}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Total Capacity</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6 text-center">
                  <Ticket className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <CardTitle className="text-2xl text-white">
                    {events.reduce((sum, event) => sum + event.sold, 0).toLocaleString()}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Tickets Sold</CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
                <p className="text-zinc-400">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 
 