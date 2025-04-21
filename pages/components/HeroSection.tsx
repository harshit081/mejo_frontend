import { HeroSectionProps } from '../types';
import { ImageCard } from './ImageCard';
import Image from 'next/image';
import background from "../components/background.svg"
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export const HeroSection: React.FC<HeroSectionProps> = ({ backgroundImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    { src: "/images/dog.jpg", alt: "Dog Portrait" },
    { src: "/images/autumn_road.jpg", alt: "Autumn Road" },
    { src: "/images/cat.jpg", alt: "Cat Portrait" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Increased interval to 5s for smoother transitions

    return () => clearInterval(timer);
  }, []);

  const getImageStyle = (index: number) => {
    const position = (index - currentIndex + images.length) % images.length;
    const baseStyle = {
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'absolute' as const,
    };
    
    // Left image
    if (position === 0) return {
      ...baseStyle,
      width: "16rem",
      height: "32rem",
      left: "calc(50% - 24rem)", // Position relative to center
      zIndex: 0,
      scale: 0.85,
      opacity: 0.7,
    };
    
    // Center image (featured)
    if (position === 1) return {
      ...baseStyle,
      width: "20rem",
      height: "36rem",
      left: "calc(50% - 10rem)", // Center position
      zIndex: 2,
      scale: 1,
      opacity: 1,
    };
    
    // Right image
    return {
      ...baseStyle,
      width: "16rem",
      height: "32rem",
      left: "calc(50% + 8rem)", // Position relative to center
      zIndex: 0,
      scale: 0.85,
      opacity: 0.7,
    };
  };

  return (
    <div className="hero-section flex relative flex-col pb-64 w-full min-h-[1080px] max-md:pb-24 max-md:max-w-full">
      <div className="hero-background-image absolute inset-0">
        <Image
          src={background}
          alt="Background hero image"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="hero-content relative self-center mt-52 mb-0 ml-16 w-full max-w-[1540px] max-md:mt-10 max-md:mb-2.5 max-md:max-w-full">
        <div className="hero-content-wrapper flex gap-5 max-md:flex-col">
          <div className="hero-title-container flex flex-col w-[44%] max-md:ml-0 max-md:w-full">
            <h1 className="hero-title relative text-9xl leading-[130px] text-zinc-800 max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-10">
              Attract
              <p className='bg-hero-title-gradient bg-clip-text text-transparent'>
                New Leads
              </p>
              like never before
            </h1>
          </div>
          
          <div className="hero-image-container flex flex-col ml-5 w-[56%] max-md:ml-0 max-md:w-full">
            <div className="hero-image-wrapper relative h-[40rem] max-md:mt-10 max-md:max-w-full">
              <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                  {images.map((image, index) => (
                    <motion.div
                      key={`${image.src}-${index}`}
                      className="absolute rounded-2xl overflow-hidden shadow-2xl"
                      style={getImageStyle(index)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: getImageStyle(index).opacity,
                        scale: getImageStyle(index).scale,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        priority={index === currentIndex}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};