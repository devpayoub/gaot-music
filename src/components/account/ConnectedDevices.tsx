import React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConnectedDevices() {
  return (
    <Card className="bg-zinc-800/50">
      <CardContent className="p-4 sm:p-6">
        <CardTitle>Connected Devices/Sessions</CardTitle>
        <CardDescription>Manage your active sessions.</CardDescription>
        <ul className="mt-4 space-y-2">
          <li className="flex items-center justify-between bg-zinc-900 rounded px-3 py-2">
            <span>Chrome on Windows 10</span>
            <Button size="sm" variant="outline">Sign Out</Button>
          </li>
          <li className="flex items-center justify-between bg-zinc-900 rounded px-3 py-2">
            <span>Safari on iPhone</span>
            <Button size="sm" variant="outline">Sign Out</Button>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
} 