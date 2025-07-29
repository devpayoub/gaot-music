"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ProfileContent } from "./ProfileContent";
import { VerificationContent } from "./VerificationContent";
import FavoritesContent from "./FavoritesContent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

import UploadAlbum from "./uploadalbum";
import MyAlbums from "./MyAlbums";
import Analytics from "./Analytics";
import Earnings from "./Earnings";
import Payouts from "./Payouts";
import ConnectedDevices from "./ConnectedDevices";
import DeleteAccountSection from "./DeleteAccountSection";

// Common wrapper for all pages
const MainWrapper = ({ children }: { children: React.ReactNode }) => (
  <main className="flex-1 p-4 sm:p-6 lg:p-10 text-zinc-100 min-h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pb-20 lg:pb-40">
    {children}
  </main>
);

interface AccountMainProps {
  active: string;
  userType: "User" | "Artist";
}

export default function AccountMain({ active, userType }: AccountMainProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  
  // Don't transform the case, use the active prop directly
  const currentSection = tab || active;

  // Define valid tabs for each user type
  const validUserTabs = [
    "Profile", "My Music Library", "Purchase History", "Favorites", 
    "Settings", "Payment Methods", "Downloads"
  ];
  
  const validArtistTabs = [
    "Profile", "My albums", "Upload Album", "Analytics", 
    "Earnings", "Payouts", "Settings", "Verification"
  ];

  // Check if current section is valid for the user type
  const validTabs = userType === "User" ? validUserTabs : validArtistTabs;
  const isValidTab = validTabs.includes(currentSection);

  // Redirect to 404 if tab is not valid
  if (!isValidTab) {
    router.push('/not-found');
    return null;
  }

  // User-specific sections
  if (userType === "User") {
    switch (currentSection) {
      case "My Music Library":
        return (
          <MainWrapper>
            <h1 className="text-2xl font-bold mb-6">My Music Library</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-zinc-800/50">
                <CardContent className="p-4 sm:p-6">
                  <CardTitle>Your Purchased Albums</CardTitle>
                  <CardDescription>You haven't purchased any albums yet.</CardDescription>
                  <Button className="mt-4 w-full sm:w-auto">Browse Albums</Button>
                </CardContent>
              </Card>
            </div>
          </MainWrapper>
        );

      case "Purchase History":
        return (
          <MainWrapper>
            <h1 className="text-2xl font-bold mb-6">Purchase History</h1>
            <Card className="bg-zinc-800/50">
              <CardContent className="p-4 sm:p-6">
                <CardTitle>Recent Purchases</CardTitle>
                <CardDescription>No purchase history available.</CardDescription>
              </CardContent>
            </Card>
          </MainWrapper>
        );

      case "Favorites":
        return (
          <MainWrapper>
            <h1 className="text-2xl font-bold mb-6">Favorites</h1>
            <FavoritesContent />
          </MainWrapper>
        );

      case "Payment Methods":
        return (
          <MainWrapper>
            <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>
            <Card className="bg-zinc-800/50">
              <CardContent className="p-4 sm:p-6">
                <CardTitle>Your Payment Methods</CardTitle>
                <CardDescription>Add or manage your payment methods.</CardDescription>
                <Button className="mt-4 w-full sm:w-auto">Add New Card</Button>
              </CardContent>
            </Card>
          </MainWrapper>
        );

      case "Downloads":
        return (
          <MainWrapper>
            <h1 className="text-2xl font-bold mb-6">Downloads</h1>
            <Card className="bg-zinc-800/50">
              <CardContent className="p-4 sm:p-6">
                <CardTitle>Download Manager</CardTitle>
                <CardDescription>Manage your downloaded albums.</CardDescription>
              </CardContent>
            </Card>
          </MainWrapper>
        );
    }
  }

  // Artist-specific sections
  if (userType === "Artist") {
    switch (currentSection) {
      case "My albums":
        return (
          <MainWrapper>
            <MyAlbums />
          </MainWrapper>
        );

      case "Upload Album":
        return (
          <MainWrapper>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Upload Album</h1>
            </div>
            <UploadAlbum />
          </MainWrapper>
        );

      case "Analytics":
        return (
          <MainWrapper>
            <Analytics />
          </MainWrapper>
        );

      case "Earnings":
        return (
          <MainWrapper>
            <Earnings />
          </MainWrapper>
        );

      case "Payouts":
        return (
          <MainWrapper>
            <Payouts />
          </MainWrapper>
        );
    }
  }

  // Common sections for both user types
  switch (currentSection) {
    case "Profile":
      return (
        <MainWrapper>
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          <ProfileContent userType={userType} />
        </MainWrapper>
      );

    case "Settings":
  return (
        <MainWrapper>
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <div className="space-y-6">
            {/* Two-Factor Authentication */}
            <Card className="bg-zinc-800/50">
              <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                <div>
                  <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                  <CardDescription>Enhance your account security with 2FA.</CardDescription>
                </div>
                <input type="checkbox" className="toggle toggle-primary" />
              </CardContent>
            </Card>
            {/* Accordions for Connected Devices/Sessions and Delete Account */}
            <Accordion type="single" collapsible>
              <AccordionItem value="devices">
                <AccordionTrigger>Connected Devices/Sessions</AccordionTrigger>
                <AccordionContent>
                  <ConnectedDevices />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="delete">
                <AccordionTrigger>Delete Account</AccordionTrigger>
                <AccordionContent>
                  <Card className="bg-zinc-800/50">
                    <CardContent className="p-4 sm:p-6">
                      <CardTitle>Delete Account</CardTitle>
                      <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                      <DeleteAccountSection />
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
      </div>
        </MainWrapper>
      );

    case "Verification":
      return (
        <MainWrapper>
          <h1 className="text-2xl font-bold mb-6">Verification</h1>
          <VerificationContent />
        </MainWrapper>
      );

    default:
      return (
        <MainWrapper>
          <h1 className="text-2xl font-bold mb-6">{currentSection}</h1>
          <Card className="bg-zinc-800/50">
            <CardContent className="p-4 sm:p-6">
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>This section is under development.</CardDescription>
            </CardContent>
          </Card>
        </MainWrapper>
  );
  }
}