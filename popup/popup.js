document.getElementById('applyFilter').addEventListener('click', () => {
  const min = document.getElementById('currentMin').value;
  const max = document.getElementById('currentMax').value;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].url.startsWith("https://www.wildberries.ru/")) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "applyFilter",
        min: Number(min),
        max: Number(max)
      }).catch((error) => {
        console.error("Не удалось отправить сообщение:", error);
        alert("Не удалось применить фильтр. Попробуйте снова или обновите страницу.");
      });
    } else {
      alert("Это расширение работает только на страницах Wildberries.");
    }
  });
});