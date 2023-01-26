import React from 'react';
import { Stack } from '@mui/material';

type Props = {
  children?: React.ReactNode;
};
export default function StackContainer({ children }: Props) {
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
