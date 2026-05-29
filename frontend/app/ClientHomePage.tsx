'use client';
import { useState, useEffect, useCallback } from 'react';
import HomeContent from '@/components/HomeContent';
import SplashAnimation from '@/components/SplashAnimation';

export default function ClientHomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [startReveal, setStartReveal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRevealStart = useCallback(() => {
    setStartReveal(true);
  }, []);

  const handleComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!isClient) return null;

  return (
    <>
      {showSplash && (
        <SplashAnimation 
          onRevealStart={handleRevealStart}
          onComplete={handleComplete} 
        />
      )}
      <div 
        style={{ 
          height: showSplash ? '100vh' : 'auto',
          overflow: showSplash ? 'hidden' : 'auto'
        }}
      >
        <HomeContent startReveal={startReveal} />
      </div>
    </>
  );
}


