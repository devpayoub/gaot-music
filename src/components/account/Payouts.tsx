import React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Payouts() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Payouts</h1>
      <Card className="bg-zinc-800/50">
        <CardContent className="p-6">
          <CardTitle>Payout Methods</CardTitle>
          <CardDescription>Manage your payout preferences.</CardDescription>
          <Button className="mt-4">Set Up Direct Deposit</Button>
        </CardContent>
      </Card>
    </>
  );
} 