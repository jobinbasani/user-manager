import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import PageManager from '../../components/pages/PageManager';
import PageContainer from '../../components/layout/PageContainer';

export default function Committee() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <PageContainer>
      <PageManager user={user} pageId="committee" />
    </PageContainer>
  );
}
