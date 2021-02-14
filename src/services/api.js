export async function getPrice(name) {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${name}&tsyms=USD&api_key=${process.env.VUE_APP_API_KEY}`
    );
    const data = await response.json();
    return data.USD;
  } catch (error) {
    console.error(error);
  }
}
