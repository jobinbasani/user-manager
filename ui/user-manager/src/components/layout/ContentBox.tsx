import Card from '@mui/material/Card';
import React from 'react';

type Props = {
  children?: React.ReactNode;
};

export default function ContentBox({ children }: Props) {
  return (
    <Card sx={{
      marginLeft: 0, marginRight: 0, marginTop: 2, marginBottom: 2,
    }}
    >
      {children}
    </Card>
  );
}
