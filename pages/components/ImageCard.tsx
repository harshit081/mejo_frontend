import Image from 'next/image';
import { ImageCardProps } from '../types';

export const ImageCard: React.FC<ImageCardProps> = ({ src, alt, className }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain rounded-[71px]"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority
    />
  </div>
);