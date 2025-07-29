"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Music, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121315] via-[#17191D] to-[#1a1c20] flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo2.png"
            alt="Logo"
            width={120}
            height={120}
            className="animate-pulse"
          />
        </div>

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed">
            The music you're looking for seems to have wandered off. 
            Don't worry, there's plenty more great music waiting for you.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            <Music className="w-8 h-8 text-zinc-600 animate-bounce" style={{ animationDelay: '0s' }} />
            <Search className="w-8 h-8 text-zinc-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Music className="w-8 h-8 text-zinc-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            onClick={() => window.history.back()}
            variant="outline" 
            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
          <h3 className="text-lg font-semibold text-white mb-3">
            Need Help Finding Something?
          </h3>
          <p className="text-zinc-400 text-sm mb-4">
            Try searching for albums, artists, or explore our featured music collection.
          </p>
          <Link href="/">
            <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-700/50">
              Explore Music
            </Button>
          </Link>
        </div>

        {/* Background Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
} 