let pinyinDict = {};
let isPinyinDictLoaded = false;

// load our generated dict
fetch(chrome.runtime.getURL('pinyinDict.json'))
  .then(response => response.json())
  .then(data => {
    pinyinDict = data;
    isPinyinDictLoaded = true;
    console.log('Pinyin dictionary loaded');
  })
  .catch(error => console.error('Error loading pinyin dictionary:', error));

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "showPinyin",
    title: "Show Pinyin",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "showPinyin") {
    if (!isPinyinDictLoaded) {
      console.error('Pinyin dictionary is not loaded yet.');
      return;
    }

    const selectedText = info.selectionText;
    const pinyinResult = convertToPinyin(selectedText);
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showPinyinPopup,
      args: [pinyinResult]
    });
  }
});

function convertToPinyin(text) {
  if (!isPinyinDictLoaded) {
    console.error('Pinyin dictionary is not loaded yet.');
    return text;
  }

  return text.split('').map(char => {
    if (pinyinDict[char]) {
      return pinyinDict[char][0]; // use first pinyin from list if multiple are available
      // implementing a smarter selection method is gonna be a pain and i'm not up for that yet lol
    }
    return char;
  }).join(' ');
}

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
