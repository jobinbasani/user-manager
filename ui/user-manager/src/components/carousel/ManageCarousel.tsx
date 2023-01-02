import React from 'react';
import AddCarouselItem, { AddCarouselProps } from '../form/AddCarouselItem';

export default function ManageCarousel({ user }:AddCarouselProps) {
  return (
    <div>
      {user.isAdmin ? <AddCarouselItem user={user} /> : null}
    </div>
  );
}
