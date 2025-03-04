import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "antd";

export function ProductImageCarousel({ images, productName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(images.map(() => false));
  const intervalRef = useRef(null);

  // Start the auto-transition
  useEffect(() => {
    startAutoTransition();
    return () => stopAutoTransition();
  }, [images, currentIndex]);

  const startAutoTransition = () => {
    stopAutoTransition();
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5 seconds
  };

  const stopAutoTransition = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const goToPrevious = () => {
    stopAutoTransition();
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    stopAutoTransition();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const selectThumbnail = (index) => {
    stopAutoTransition();
    setCurrentIndex(index);
  };

  const handleImageLoad = (index) => {
    setImagesLoaded((prevImagesLoaded) => {
      const newImagesLoaded = [...prevImagesLoaded];
      newImagesLoaded[index] = true;
      return newImagesLoaded;
    });
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      {/* Main Image Display */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[300px] overflow-hidden bg-muted/20">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Loading Placeholder */}
            {!imagesLoaded[index] && (
              <Skeleton.Image className="w-full h-full object-contain" active />
            )}

            {/* Actual Image */}
            <img
              src={image}
              alt={`${productName} - Image ${index + 1}`}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2 px-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectThumbnail(index)}
              className={`relative cursor-pointer w-16 h-16 md:w-20 md:h-20 border-2 rounded-md overflow-hidden transition-all duration-200 ${
                index === currentIndex
                  ? "border-primary"
                  : "border-transparent hover:border-primary/50"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
