# cryptonomicon

## Список изменений\улучшений\замечаний

- [x] Валюта(название валюты) не должна добавлятся в список, если её нет в api.
- [x] При добавлении новой валюты - данные необходмо отобразить сразу, а не через 5 секунд.
- [x] Переписать код с использованием Composition API.
- [x] Предотвратить утечку памяти при удалении валюты из списка (clearInterval).
- [x] При наведении курсора на график - отображать историю цены валюты.
- [ ] Решение на бесконечном рендере новых div в графике не самое лучше, сделать более надежное с использованием других инструментов (типо canvas).

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
