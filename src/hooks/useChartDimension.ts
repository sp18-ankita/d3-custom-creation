export const useChartDimensions = (width: number, height: number) => {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const boundedWidth = width - margin.left - margin.right;
  const boundedHeight = height - margin.top - margin.bottom;

  return {
    width,
    height,
    margin,
    boundedWidth,
    boundedHeight,
  };
};
