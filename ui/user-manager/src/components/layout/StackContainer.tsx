import React from 'react';
import { Stack } from '@mui/material';

export type ContainerProps = {
  children?: React.ReactNode;
};
export default function StackContainer({ children }: ContainerProps) {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        height: 400,
        width: {
          sm: 0.92,
          md: 0.5,
        },
      }}
      p={2}
    >
      {children}
    </Stack>
  );
}
