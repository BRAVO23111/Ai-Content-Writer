"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface TwitterConnectButtonProps {
  onStatusChange?: (connected: boolean) => void;
}

export default function TwitterConnectButton({ onStatusChange }: TwitterConnectButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    return <Button disabled variant="outline" size="sm">Checking Twitter...</Button>;
  }

  return isConnected ? (
    <Button onClick={handleDisconnect} variant="outline" size="sm" className="bg-green-600/90 text-white hover:bg-green-700 transition-all flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
      Connected
    </Button>
  ) : (
    <Button onClick={handleConnect} variant="outline" size="sm" className="bg-blue-600/90 text-white hover:bg-blue-700 transition-all">
      Connect Twitter
    </Button>
  );
}