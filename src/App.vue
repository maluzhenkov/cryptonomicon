<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700">
              Тикер
            </label>
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="cryptoCurrencyName"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
            </div>
          </div>
        </div>
        <button
          @click="addCryptoCurrency"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <img class="-ml-0.5 mr-2 h-6 w-6" src="./assets/add.svg" alt="add" />
          Добавить
        </button>
      </section>

      <template v-if="cryptoCurrencyList.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="cryptItem in cryptoCurrencyList"
            :key="cryptItem.id"
            :class="{ 'outline-black': selectedCrypt?.id === cryptItem.id }"
            class="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
            @click="onSelectCtypt(cryptItem)"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ cryptItem.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ cryptItem.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="removeCryptoCurrency(cryptItem)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <img class="h-5 w-5" src="./assets/remove.svg" alt="remove" />
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <section v-if="selectedCrypt" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedCrypt.name }} - USD
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
            v-for="(bar, idx) in normalizeGraph()"
            :key="idx"
            :style="{ height: `${bar.height}%` }"
            class="bg-purple-800 border w-10"
            :title="bar.price"
          ></div>
        </div>
        <button
          @click="onSelectCtypt(null)"
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
import useCtyptoMonitor from "@/use/crypto-monitor";

export default {
  name: "App",
  setup() {
    return { ...useCtyptoMonitor() };
  }
};
</script>
