import { Gallery, Image } from 'react-grid-gallery';
import React from 'react';

type ImageGalleryProps={
  images: Image[]
  singleSelectOnly?:boolean
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
}
export default function ImageGallery({ images, setImages, singleSelectOnly }:ImageGalleryProps) {
  const selectionHandler = (index: number) => {
    let nextImages;
    if (singleSelectOnly) {
      nextImages = images.map((image, i) => ({ ...image, isSelected: i === index ? !image.isSelected : false }));
    } else {
      nextImages = images.map((image, i) => (i === index ? { ...image, isSelected: !image.isSelected } : image));
    }
    setImages(nextImages);
  };
  return (
    <Gallery images={images} onSelect={selectionHandler} />
  );
}
