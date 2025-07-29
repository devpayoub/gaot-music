import React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export default function Earnings() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Earnings</h1>
      <Card className="bg-zinc-800/50">
        <CardContent className="p-6">
          <CardTitle>Revenue Dashboard</CardTitle>
          <CardDescription>Track your earnings and sales.</CardDescription>
        </CardContent>
      </Card>
    </>
  );
} 