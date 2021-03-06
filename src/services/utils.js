export const uuid = () => {
  return Math.random()
    .toString(16)
    .slice(2);
};

export const currencyNormalize = (price) => {
  return price > 1 ? price.toFixed(2) : price.toPrecision(2);
};

export const unique = (arr) => {
  const result = [];

  for (const str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
};
