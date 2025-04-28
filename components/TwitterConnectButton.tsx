"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface TwitterConnectButtonProps {
  onStatusChange?: (connected: boolean) => void;
}

export default function TwitterConnectButton({ onStatusChange }: TwitterConnectButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check Twitter connection status on load
  useEffect(() => {
    const checkTwitterStatus = async () => {
      try {
        const response = await fetch('/api/auth/twitter/status');
        const data = await response.json();
        
        setIsConnected(data.authenticated);
        if (onStatusChange) {
          onStatusChange(data.authenticated);
        }
      } catch (error) {
        console.error('Error checking Twitter status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTwitterStatus();
  }, [onStatusChange]);

  const handleConnect = () => {
    // Redirect to Twitter auth endpoint
    window.location.href = '/api/auth/twitter';
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/auth/twitter/disconnect', { method: 'POST' });
      setIsConnected(false);
      if (onStatusChange) {
        onStatusChange(false);
      }
    } catch (error) {
      console.error('Error disconnecting Twitter:', error);
    }
  };

  if (isLoading) {
    return <Button disabled variant="outline" size="sm">
      Checking Twitter...
    </Button>;
  }

  if (isConnected) {
    return (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="bg-green-50 text-green-700">
          Twitter Connected
        </Button>
        <Button onClick={handleDisconnect} variant="outline" size="sm" className="text-red-600">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} variant="outline" size="sm">
      Connect Twitter
    </Button>
  );
}