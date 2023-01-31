import { Gallery, Image } from 'react-grid-gallery';
import React from 'react';

type ImageGalleryProps={
  images: Image[]
  singleSelectOnly?:boolean
  onSelect: (images:Image[])=>void;
}
export default function ImageGallery({ images, onSelect, singleSelectOnly }:ImageGalleryProps) {
  const selectionHandler = (index: number) => {
    let nextImages;
    if (singleSelectOnly) {
      nextImages = images.map((image, i) => ({ ...image, isSelected: i === index ? !image.isSelected : false }));
    } else {
      nextImages = images.map((image, i) => (i === index ? { ...image, isSelected: !image.isSelected } : image));
    }
    onSelect(nextImages);
  };
  return (
    <Gallery images={images} onSelect={selectionHandler} />
  );
}
