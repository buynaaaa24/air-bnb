'use client';

import { useSearchParams } from "next/navigation";
import Slideshow from "./Slideshow";

interface SlideshowWrapperProps {
  images: string[];
}

const SlideshowWrapper: React.FC<SlideshowWrapperProps> = ({ images }) => {
  const searchParams = useSearchParams();


  const hasQueryParams = searchParams ? Array.from(searchParams.entries()).length > 0 : false;

  if (images.length === 0 || hasQueryParams) {
    return null;
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <Slideshow images={images} />
    </div>
  );
};

export default SlideshowWrapper;
