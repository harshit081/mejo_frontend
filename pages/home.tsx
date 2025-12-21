"use client";

import dynamic from 'next/dynamic';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

// Lazy load heavy components
const HeroSection = dynamic(() => import('./components/HeroSection').then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="min-h-[50vh] flex items-center justify-center"><div className="animate-pulse bg-gray-200 rounded-lg w-full h-96"></div></div>
});

const Features = dynamic(() => import('./components/Features').then(mod => ({ default: mod.Features })), {
  loading: () => <div className="min-h-[50vh] flex items-center justify-center"><div className="animate-pulse bg-gray-100 rounded-lg w-full h-64"></div></div>
});

const Team = dynamic(() => import('./components/Team').then(mod => ({ default: mod.Team })), {
  loading: () => <div className="min-h-[30vh] flex items-center justify-center"><div className="animate-pulse bg-gray-100 rounded-lg w-full h-48"></div></div>
});

const home: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col bg-stone-100">
      <Navigation />
      <HeroSection
        backgroundImage=""
      />
      <Features />
      <Team />
      <Footer />
    </div>
  );
};

export default home;  