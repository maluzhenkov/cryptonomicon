<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div
      v-show="isLoading"
      class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700">
              Тикер
            </label>
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                ref="ticker"
                v-model.trim="ticker"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
                @input="valid.error = false"
                @keydown.enter="add"
              />
            </div>
            <div
              v-show="autocomplite.length"
              class="flex bg-white shadow-md p-1 rounded-md flex-wrap"
            >
              <span
                v-for="symbol in autocomplite"
                :key="symbol"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
                @click="addAutocomplite(symbol)"
              >
                {{ symbol }}
              </span>
            </div>
            <div v-show="valid.error" class="text-sm text-red-600">
              Такой тикер уже добавлен
            </div>
          </div>
          <div>
            <button
              @click="add"
              type="button"
              class="ml-4 mt-5 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              :disabled="!ticker"
            >
              <img
                class="-ml-0.5 mr-2 h-6 w-6"
                src="./assets/add.svg"
                alt="add"
              />
              Добавить
            </button>
          </div>
        </div>
      </section>

      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div class="flex justify-between">
          <div>Фильтр: <input v-model.trim="filter" /></div>
          <div class="flex items-center">
            <button
              class="mx-2 inline-flex items-center py-1 px-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              v-if="page > 1"
              @click="page = page - 1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              class="mx-2 inline-flex items-center py-1 px-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-400 hover:bg-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="page = page + 1"
              v-if="hasNextPage"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            Страница: {{ page }}
          </div>
        </div>

        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="ticker in paginatedTickers"
            :key="ticker.name"
            :class="{ 'outline-black': selectedTicker?.name === ticker.name }"
            class="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
            @click="select(ticker)"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ ticker.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(ticker.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="handleDelete(ticker)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:bg-gray-200 hover:text-red-400 transition-all focus:outline-none"
            >
              <img class="h-5 w-5" src="./assets/remove.svg" alt="remove" />
              Удалить
            </button>
          </div>
        </dl>
        <div class="text-center" v-if="!paginatedTickers.length">
          По фильтру "{{ filter }}" ничего не найдено!
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <section v-if="selectedTicker" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedTicker.name }} - USD
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
            v-for="(bar, idx) in normalizedGraph"
            :key="idx"
            :style="{ height: `${bar.height}%` }"
            class="bg-purple-800 border w-10"
            :title="bar.price"
          ></div>
        </div>
        <button
          @click="select(null)"
          type="button"
          class="absolute top-0 right-0"
        >
          <img src="./assets/close.svg" alt="close" />
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import * as api from "@/services/api";

const MAX_PER_PAGE = 6;
const STORAGE_NAME = "cryptonomicon-list";

export default {
  name: "App",
  data() {
    return {
      isLoading: false,
      valid: {
        error: false
      },
      ticker: "",
      filter: "",
      tickers: [],
      selectedTicker: null,
      graph: [],
      page: 1,
      allCoins: [],
      interval: null
    };
  },
  watch: {
    selectedTicker() {
      this.graph = [];
    },

    tickers() {
      localStorage.setItem(STORAGE_NAME, JSON.stringify(this.tickers));
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    filter() {
      this.page = 1;
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    }
  },
  computed: {
    autocomplite() {
      const search = this.ticker.toLowerCase();
      return search
        ? this.allCoins
            .filter((item) => {
              return item.Symbol.toLowerCase().includes(search);
              // ||
              // item.FullName.toLowerCase().includes(search)
            })
            .map((item) => item.Symbol)
            .sort((a, b) => a.length - b.length)
            .slice(0, 4)
        : [];
    },

    startIndex() {
      return (this.page - 1) * MAX_PER_PAGE;
    },

    endIndex() {
      return this.page * MAX_PER_PAGE;
    },

    filteredTickers() {
      return this.tickers.filter((ticker) =>
        ticker.name.toLowerCase().includes(this.filter.toLowerCase())
      );
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },

    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (maxValue === minValue) {
        return this.graph.map(() => ({ height: 50, price: minValue }));
      }

      return this.graph.map((price) => {
        return {
          height: 5 + ((price - minValue) * 95) / (maxValue - minValue),
          price
        };
      });
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      };
    }
  },
  created() {
    this.isLoading = true;
    // Получаем filter и page из параметров URL
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );
    const VALID_KEYS = ["filter", "page"];
    VALID_KEYS.forEach((key) => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });

    // Получаем State(состояние) из localStorage
    const tickersData = localStorage.getItem(STORAGE_NAME);
    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        api.subscribeToTicker(ticker.name, (newPrice) =>
          this.updateTicker(ticker.name, newPrice)
        );
      });
    }

    api
      .getCoinList()
      .then((data) => {
        this.allCoins = Object.values(data);
      })
      .finally(() => {
        this.isLoading = false;
      });
  },
  methods: {
    updateTicker(tickerName, price) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (t === this.selectedTicker) {
            this.graph.push(price);
          }

          t.price = price;
        });
    },

    add() {
      const currentTicker = {
        name: this.ticker,
        price: "-"
      };

      const index = this.tickers.findIndex(
        (item) => item.name === currentTicker.name
      );

      if (index !== -1) {
        this.valid.error = true;
        return;
      }
      this.valid.error = false;

      this.tickers = [...this.tickers, currentTicker];

      api.subscribeToTicker(currentTicker.name, (newPrice) =>
        this.updateTicker(currentTicker.name, newPrice)
      );

      this.filter = "";
      this.ticker = "";
    },

    addAutocomplite(symbol) {
      this.ticker = symbol;
      this.add();
    },

    select(ticker) {
      this.selectedTicker = ticker;
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);

      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
      }

      api.unsubscribeFromTicker(tickerToRemove.name);
    },

    formatPrice(price) {
      if (price === "-") {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    }
  }
};
</script>
