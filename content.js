chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showPinyin") {
    showPinyinPopup(request.pinyin);
  }
});

function showPinyinPopup(pinyin) {
  const popup = document.createElement('div');
  popup.textContent = pinyin;
  popup.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 10px;
    background-color: white;
    border: 1px solid black;
    z-index: 9999;
    font-size: 16px;
  `;
  
  document.body.appendChild(popup);
  
  setTimeout(() => {
    document.body.removeChild(popup);
  }, 5000);
}