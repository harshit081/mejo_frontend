import { HeroSectionProps } from '../types';
import { ImageCard } from './ImageCard';
import Image from 'next/image';
import background from "../components/background.svg"

export const HeroSection: React.FC<HeroSectionProps> = ({ backgroundImage }) => (
  <div className="hero-section flex relative flex-col pb-64 w-full min-h-[1080px] max-md:pb-24 max-md:max-w-full ">
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
          <div className="hero-image-wrapper relative grow max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <ImageCard
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c1b3471251c07304b3aa82012c254e6ae0c31e7621ec3674cd93d620c16582b8?placeholderIfAbsent=true&apiKey=4c3f70633dcc438f977ddb9596975766"
                alt="Feature showcase 1"
                className="aspect-[0.68] w-2/3 max-md:mt-10"
              />
              <ImageCard
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a2710020f7fff4c239b8986b1ff84ab01a7b9b9f10d369e56d3b675efab147a?placeholderIfAbsent=true&apiKey=4c3f70633dcc438f977ddb9596975766"
                alt="Feature showcase 2"
                className="aspect-[0.63] w-full max-md:mt-6"
              />
              <ImageCard
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c1b3471251c07304b3aa82012c254e6ae0c31e7621ec3674cd93d620c16582b8?placeholderIfAbsent=true&apiKey=4c3f70633dcc438f977ddb9596975766"
                alt="Feature showcase 3"
                className="aspect-[0.68] w-2/3 max-md:mt-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);