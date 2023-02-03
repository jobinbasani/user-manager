import React from 'react';
import { Stack } from '@mui/material';
import { ContainerProps } from './StackContainer';

export default function PageContainer({ children }: ContainerProps) {
  return (
    <Stack spacing={2} p={2} sx={{ width: { sm: 0.92, md: 0.5 } }}>
      {children}
    </Stack>
  );
}
