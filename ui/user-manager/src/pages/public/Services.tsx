import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import PageManager from '../../components/pages/PageManager';

export default function Services() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <PageManager user={user} pageId="services" />
  );
}
