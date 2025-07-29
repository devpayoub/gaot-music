"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function DatabaseTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Check if we can read from user_interactions
      console.log('Testing user_interactions read...');
      const { data: interactions, error: interactionsError } = await supabase
        .from('user_interactions')
        .select('*')
        .limit(1);
      
      results.interactionsRead = { data: interactions, error: interactionsError };

      // Test 2: Check if we can read from albums
      console.log('Testing albums read...');
      const { data: albums, error: albumsError } = await supabase
        .from('albums')
        .select('*')
        .limit(1);
      
      results.albumsRead = { data: albums, error: albumsError };

      // Test 3: Check if we can insert into user_interactions
      console.log('Testing user_interactions insert...');
      const testInteraction = {
        user_id: '00000000-0000-0000-0000-000000000000', // dummy ID
        target_id: '00000000-0000-0000-0000-000000000000', // dummy ID
        target_type: 'album',
        interaction_type: 'like'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('user_interactions')
        .insert([testInteraction])
        .select();
      
      results.interactionsInsert = { data: insertData, error: insertError };

      // Test 4: Check current user
      const { data: { user } } = await supabase.auth.getUser();
      results.currentUser = user;

      setTestResults(results);
    } catch (error) {
      console.error('Test error:', error);
      results.error = error;
      setTestResults(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardContent className="p-6">
        <CardTitle className="text-white mb-4">Database Connection Test</CardTitle>
        <Button onClick={runTests} disabled={loading} className="mb-4">
          {loading ? 'Running Tests...' : 'Run Database Tests'}
        </Button>
        
        {testResults && (
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Current User:</h4>
              <pre className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded">
                {JSON.stringify(testResults.currentUser, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">User Interactions Read Test:</h4>
              <pre className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded">
                {JSON.stringify(testResults.interactionsRead, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">Albums Read Test:</h4>
              <pre className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded">
                {JSON.stringify(testResults.albumsRead, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">User Interactions Insert Test:</h4>
              <pre className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded">
                {JSON.stringify(testResults.interactionsInsert, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 