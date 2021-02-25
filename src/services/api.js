export async function getPrices(name) {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${name}&tsyms=USD`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCoinList() {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
    );
    const { Data } = await response.json();
    return Data;
  } catch (error) {
    console.error(error);
  }
}
