"use client";

import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Team } from './components/Team';
// import { About } from './components/About';

const home: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col bg-stone-100">
      <Navigation />
      <HeroSection
        backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/13fa47c826863868a8a3030196be5ce28c781ec23e07080e438f03995eba895b?placeholderIfAbsent=true&apiKey=4c3f70633dcc438f977ddb9596975766"
      />
      <Features />
      <Team />
      {/* <About/> */}
      <Footer />
    </div>
  );
};

export default home;  