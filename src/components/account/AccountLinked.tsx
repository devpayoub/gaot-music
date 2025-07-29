import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Settings, ShieldCheck, CreditCard } from 'lucide-react';  
import { Button } from '@/components/ui/button';

const AccountLinked: React.FC = () => {


    return (
        <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <img src="/spotify.png" alt="Spotify" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Spotify</h3>
                <p className="text-xs text-zinc-400">
                  Connect Spotify for Background Agents, Bugbot and enhanced codebase context
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-white text-black hover:bg-white-700">
              Connect
            </Button>
          </div>          
        </CardContent>
      </Card>
    );
};

export default AccountLinked;
