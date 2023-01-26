import { Gallery, Image } from 'react-grid-gallery';
import React from 'react';

type ImageGalleryProps={
  images: Image[]
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
}
export default function ImageGallery({ images, setImages }:ImageGalleryProps) {
  const selectionHandler = (index: number) => {
    const nextImages = images.map((image, i) => (i === index ? { ...image, isSelected: !image.isSelected } : image));
    setImages(nextImages);
  };
  return (
    <Gallery images={images} onSelect={selectionHandler} />
  );
}
