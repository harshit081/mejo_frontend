import { HeroSectionProps } from "../types";
import { ImageCard } from "./ImageCard";
import Image from "next/image";
import background from "@/public/images/background.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set([0]));

  const images = [
    { src: "/images/dog.jpg", alt: "Dog Portrait" },
    { src: "/images/autumn_road.jpg", alt: "Autumn Road" },
    { src: "/images/cat.jpg", alt: "Cat Portrait" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        // Preload next image
        setImagesLoaded(prev => new Set([...prev, next]));
        return next;
      });
    }, 8000); // Increased to 8s for better performance

    return () => clearInterval(timer);
  }, []);

  const getImageStyle = (index: number) => {
    const position = (index - currentIndex + images.length) % images.length;
    const baseStyle = {
      transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)", // Slower transition
      position: "absolute" as const,
    };

    // Left image
    if (position === 0)
      return {
        ...baseStyle,
        width: "12rem", // Reduced size
        height: "24rem", // Reduced size
        left: "calc(50% - 20rem)",
        zIndex: 0,
        scale: 0.8,
        opacity: 0.6,
      };

    // Center image (featured)
    if (position === 1)
      return {
        ...baseStyle,
        width: "16rem", // Reduced from 20rem
        height: "28rem", // Reduced from 36rem
        left: "calc(50% - 8rem)",
        zIndex: 2,
        scale: 1,
        opacity: 1,
      };

    // Right image
    return {
      ...baseStyle,
      width: "12rem", // Reduced size
      height: "24rem", // Reduced size
      left: "calc(50% + 6rem)",
      zIndex: 0,
      scale: 0.8,
      opacity: 0.6,
    };
  };

  return (
    <div className="hero-section flex relative flex-col pb-32 w-full min-h-[800px] max-md:pb-24 max-md:max-w-full">
    {/* Reduced height */}
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
{/* Title with gradient */}
            <h1 className="hero-title relative bg-hero-title-gradient bg-clip-text text-transparent font-bold text-9xl mb-5 max-md:mt-10 max-md:max-w-full max-md:text-5xl pb-7">
              Mejo
            </h1>

            {/* Normal text without gradient */}
            <p className="text-3xl leading-tight text-gray-800 max-md:text-2xl">
              Your personal digital journal, reimagined.
            </p>

            <p className="mt-6 text-2xl text-gray-600 max-w-2xl leading-relaxed">
              Capture your thoughts, organize ideas, and revisit memories in one
              secure, personalized space. Whether it's a daily diary, creative
              notes, or life reflections — Mejo is your trusted companion.
            </p>
            <button
              className="mt-8 px-8 py-4 bg-gradient-to-r from-[#fcd34d] via-[#fb7185] to-[#a78bfa]
              text-white text-lg font-medium rounded-sm
              shadow-lg hover:shadow-[#bf94e4]/30 
              transform hover:translate-y-[-2px] 
              transition-all duration-300 ease-out"
            >
              Start journaling today — your thoughts deserve a home.
            </button>
          </div>

          <div className="hero-image-container flex flex-col ml-5 w-[56%] max-md:ml-0 max-md:w-full">
            <div className="hero-image-wrapper relative h-[32rem] max-md:mt-10 max-md:max-w-full"> {/* Reduced height */}
              <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                  {images.map((image, index) => {
                    // Only render if image is loaded or is adjacent to current
                    const shouldRender = imagesLoaded.has(index) ||
                      Math.abs((index - currentIndex + images.length) % images.length) <= 1;

                    if (!shouldRender) return null;

                    return (
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
                          duration: 0.8, // Slower transition
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
                          loading={index === currentIndex ? "eager" : "lazy"}
                          quality={85} // Reduced quality for better performance
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
