import React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export default function Analytics() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-zinc-800/50">
          <CardContent className="p-4 sm:p-6">
            <CardTitle>Total Sales</CardTitle>
            <CardDescription>View your sales statistics.</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50">
          <CardContent className="p-4 sm:p-6">
            <CardTitle>Listener Stats</CardTitle>
            <CardDescription>Track your audience engagement.</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50">
          <CardContent className="p-4 sm:p-6">
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Monitor your earnings.</CardDescription>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 