
import React, { useState } from 'react';
import { ProductImage } from '../types';

interface ImageGalleryProps {
  images: ProductImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 rounded-md overflow-hidden transition-all ${
              activeImage === idx ? 'border-rose-300' : 'border-transparent opacity-70'
            }`}
          >
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 aspect-square bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
        <img
          src={images[activeImage]?.url}
          alt={images[activeImage]?.alt}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default ImageGallery;
