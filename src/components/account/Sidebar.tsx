"use client";

// src/components/account/Sidebar.tsx
import { useRouter } from "next/navigation";
import {
  User, Library, History, Heart, Settings, CreditCard, Download,
  Music, Upload, BarChart, ShieldCheck, Wallet, Pencil, X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    type: "User" | "Artist";
    status: "Pending" | "Verified" | "Rejected";
    followersCount?: number;
  };
  active: string;
  setActive: (value: string) => void;
}

const navItems = {
  user: [
    { icon: <User className="w-5 h-5" />, label: "Profile" },
    { icon: <Library className="w-5 h-5" />, label: "My Music Library" },
    { icon: <History className="w-5 h-5" />, label: "Purchase History" },
    { icon: <Heart className="w-5 h-5" />, label: "Favorites" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", divider: true },
    { icon: <CreditCard className="w-5 h-5" />, label: "Payment Methods" },
    { icon: <Download className="w-5 h-5" />, label: "Downloads" },
  ],
  artist: [
    { icon: <User className="w-5 h-5" />, label: "Profile" },
    { icon: <Music className="w-5 h-5" />, label: "My albums" },
    { icon: <Upload className="w-5 h-5" />, label: "Upload Album" },
    //{ icon: <BarChart className="w-5 h-5" />, label: "Analytics" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", divider: true },
    { icon: <ShieldCheck className="w-5 h-5" />, label: "Verification" },
   // { icon: <Wallet className="w-5 h-5" />, label: "Earnings" },
   // { icon: <CreditCard className="w-5 h-5" />, label: "Payouts" },
  ]
};

export default function Sidebar({ user, active, setActive }: SidebarProps) {
  const router = useRouter();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newPassword, setNewPassword] = useState("");

  const handleNavigation = (item: { label: string }) => {
    setActive(item.label);
    router.push(`/account?tab=${item.label}`);
  };

  const handleEditProfile = () => {
    console.log("Updating profile:", { newName, newPassword });
    setIsEditProfileOpen(false);
  };

  const items = navItems[user.type.toLowerCase() as keyof typeof navItems];

  // Get status badge color
  const getStatusBadge = () => {
    switch (user.status) {
      case "Verified":
        return <Badge className="bg-green-500/20 text-green-500">Verified</Badge>;
      case "Rejected":
        return <Badge className="bg-red-500/20 text-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
    }
  };

  return (
    <>
      <aside className="w-full lg:w-80 text-zinc-100 flex flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              {user.type === "Artist" && user.status === "Verified" && (
                <Image
                  src="/b-blue.svg"
                  alt="Verified"
                  width={17}
                  height={17}
                  className="ml translate-y-[2px]"
                />
              )}
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="p-1 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-zinc-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-zinc-500">Status: {user.type}</span>
              {user.type === "Artist" && getStatusBadge()}
              {user.type === "Artist" && user.followersCount !== undefined && (
                <span className="text-xs text-zinc-500">• {user.followersCount.toLocaleString()} followers</span>
              )}
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((item) => (
            <div key={item.label}>
              {item.divider && <div className="my-2 border-t border-zinc-800" />}
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active === item.label
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </nav>

        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm">
                  Name
                </label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditProfile}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </aside>
    </>
  );
}
