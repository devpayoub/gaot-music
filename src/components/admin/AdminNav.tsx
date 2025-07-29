"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Music, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminNav() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!userProfile || !userProfile.email?.includes('@admin.com')) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only admin users can access this page. Please login with admin credentials.",
      });
      router.push('/admin/login');
    }
  }, [userProfile, router, toast]);

  // Don't render if not admin
  if (!userProfile || !userProfile.email?.includes('@admin.com')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#17191D] to-[#121315] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage your music platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/verifications">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Artist Verifications</CardTitle>
                    <CardDescription className="text-zinc-400">Review and approve artist applications</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription className="text-zinc-400">Manage users and permissions</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/albums">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Album Management</CardTitle>
                    <CardDescription className="text-zinc-400">Review and manage albums</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Platform Settings</CardTitle>
                    <CardDescription className="text-zinc-400">Configure platform settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/">
            <Button variant="outline" className="text-zinc-400 border-zinc-700 hover:bg-zinc-800">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 