import React, { ReactNode } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export default function TabPanel(props: TabPanelProps) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
