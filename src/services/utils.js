export const uuid = () => {
  return Math.random()
    .toString(16)
    .slice(2);
};

export const currencyNormalize = price => {
  return price > 1 ? price.toFixed(2) : price.toPrecision(2);
};
