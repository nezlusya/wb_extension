// Переменные для хранения текущих значений фильтра
let currentMin = null;
let currentMax = null;

// Селекторы для Wildberries
const productSelector = '.product-card__wrapper';
const priceSelector = '.product-card__wrapper .price__wrap .price__lower-price.wallet-price';

// Функция для применения фильтра к одному товару
function applyFilterToProduct(product, min, max) {
  const priceElement = product.querySelector(priceSelector);
  if (!priceElement) return;

  const priceText = priceElement.textContent;
  const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);

  // Если оба значения min и max не заданы (NaN), убираем выделение
  if (isNaN(min) && isNaN(max)) {
    product.style.border = '';
    product.style.boxShadow = '';
  } 
  // Если цена попадает в диапазон, выделяем товар
  else if ((isNaN(min) || price >= min) && (isNaN(max) || price <= max)) {
    product.style.border = '10px solid #4CAF50';
    product.style.boxShadow = '0 0 8px rgba(252,15,192,0.5)';
  } 
  // В противном случае убираем выделение
  else {
    product.style.border = '';
    product.style.boxShadow = '';
  }
}

// Функция для применения фильтра ко всем текущим товарам
function applyPriceFilter(min, max) {
  currentMin = min;
  currentMax = max;

  // Применяем фильтр ко всем товарам на странице
  document.querySelectorAll(productSelector).forEach(product => {
    applyFilterToProduct(product, min, max);
  });
}

// Настройка MutationObserver для отслеживания новых товаров
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        // Проверяем, является ли добавленный узел карточкой товара
        if (node.matches && node.matches(productSelector)) {
          applyFilterToProduct(node, currentMin, currentMax);
        }
      });
    }
  });
});

// Замените '.product-list' на реальный селектор контейнера товаров
const productList = document.querySelector('.product-page .cards-list__container .product-card');
if (productList) {
  observer.observe(productList, { childList: true });
} else {
  console.error('Контейнер списка товаров не найден. Пожалуйста, обновите селектор.');
}

// Слушатель сообщений от popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyFilter") {
    applyPriceFilter(message.min, message.max);
  }
});