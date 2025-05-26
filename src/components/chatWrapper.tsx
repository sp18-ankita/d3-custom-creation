import React from 'react';

type Props = {
  width?: number;
  height?: number;
  children: React.ReactNode;
};

export const ChartWrapper: React.FC<Props> = ({ width = 400, height = 300, children }) => (
  <svg width={width} height={height}>
    {children}
  </svg>
);
