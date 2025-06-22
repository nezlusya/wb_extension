// Переменные для хранения значений фильтра
let currentMin = null;
let currentMax = null;

// Селекторы для Wildberries (обновите их, если структура сайта изменилась)
const productSelector = '.product-card__wrapper'; // Селектор карточек товаров
const priceSelector = '.price__lower-price.wallet-price'; // Селектор цены

function applyFilterToProduct(product, min, max) {
  const priceElement = product.querySelector(priceSelector);
  if (!priceElement) return;

  const priceText = priceElement.textContent.trim();
  if (!priceText) {
    // Если цена ещё не загрузилась, пробуем снова через 500 мс
    setTimeout(() => applyFilterToProduct(product, min, max), 500);
    return;
  }

  const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);

  // Если фильтр не задан (min и max не указаны), возвращаем полную видимость и убираем выделение
  if (isNaN(min) && isNaN(max)) {
    product.style.opacity = '1';
    product.style.border = '';
    product.style.boxShadow = '';
  } 
  // Если цена в диапазоне, делаем товар полностью видимым и выделяем
  else if ((isNaN(min) || price >= min) && (isNaN(max) || price <= max)) {
    product.style.opacity = '1';
    product.style.border = '10px solid #4CAF50';
    product.style.boxShadow = '0 0 8px rgba(252,15,192,0.5)';
  } 
  // Если цена вне диапазона, делаем товар прозрачным
  else {
    product.style.opacity = '0.3'; // Можно изменить на 0.5 для меньшей прозрачности
    product.style.border = '';
    product.style.boxShadow = '';
  }
}

// Функция для применения фильтра ко всем товарам
function applyPriceFilter(min, max) {
  currentMin = min;
  currentMax = max;

  document.querySelectorAll(productSelector).forEach(product => {
    applyFilterToProduct(product, min, max);
  });
}

// Настройка MutationObserver для отслеживания новых товаров
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches(productSelector)) {
            setTimeout(() => applyFilterToProduct(node, currentMin, currentMax), 500);
          }
          node.querySelectorAll(productSelector).forEach(product => {
            setTimeout(() => applyFilterToProduct(product, currentMin, currentMax), 500);
          });
        }
      });
    }
  });
});

// Отслеживаем изменения во всей странице
observer.observe(document.body, { childList: true, subtree: true });

// Периодическая проверка каждые 2 секунды
setInterval(() => {
  if (currentMin !== null || currentMax !== null) {
    document.querySelectorAll(productSelector).forEach(product => {
      applyFilterToProduct(product, currentMin, currentMax);
    });
  }
}, 2000);

// Слушаем сообщения от popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyFilter") {
    applyPriceFilter(message.min, message.max);
  }
});


