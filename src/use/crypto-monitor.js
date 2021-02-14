import { ref } from "vue";
import { uuid, currencyNormalize } from "@/services/utils";
import { getPrice } from "@/services/api";

export default function useCryptoMonitor() {
  const cryptoCurrencyName = ref("");
  const cryptoCurrencyList = ref([]);
  const selectedCrypt = ref(null);
  const graph = ref([]);

  async function addCryptoCurrency() {
    if (cryptoCurrencyName.value) {
      const item = {
        id: uuid(),
        name: cryptoCurrencyName.value,
        price: "-",
        interval: null
      };
      cryptoCurrencyName.value = "";

      const price = await getPrice(item.name);

      if (price) {
        item.price = currencyNormalize(price);
        cryptoCurrencyList.value.unshift(item);
        item.interval = setInterval(async () => {
          const price = await getPrice(item.name);
          if (price) {
            cryptoCurrencyList.value.find(
              cryptoItem => cryptoItem.id === item.id
            ).price = currencyNormalize(price);

            if (selectedCrypt.value?.id === item.id) {
              graph.value.push(currencyNormalize(price));
            }
          }
        }, 5000);
      }
    }
  }

  function onSelectCtypt(item) {
    selectedCrypt.value = item;
    graph.value = [];
  }

  function removeCryptoCurrency(item) {
    cryptoCurrencyList.value = cryptoCurrencyList.value.filter(
      cryptItem => cryptItem.id !== item.id
    );
    clearInterval(item.interval);

    if (selectedCrypt.value?.id === item.id) {
      onSelectCtypt(null);
    }
  }

  function normalizeGraph() {
    const maxValue = Math.max(...graph.value);
    const minValue = Math.min(...graph.value);
    return graph.value.map(price => {
      return {
        height: 5 + ((price - minValue) * 95) / (maxValue - minValue),
        price
      };
    });
  }

  return {
    cryptoCurrencyName,
    addCryptoCurrency,
    removeCryptoCurrency,
    cryptoCurrencyList,
    selectedCrypt,
    onSelectCtypt,
    normalizeGraph
  };
}
