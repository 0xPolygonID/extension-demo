
// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
let currentWindow = null;
chrome.windows.onRemoved.addListener(
  (windowId) => {
    if(currentWindow?.id === windowId) {
      currentWindow = null;
    }
  }
)
chrome.runtime.onMessage.addListener(async request => {
  if (request.type === "OpenAuth") {
    if (currentWindow) {
      await chrome.windows.remove(currentWindow.id);
    }
    chrome.windows.create({
      url: chrome.runtime.getURL(`index.html#/auth?i_m=${request.href.split('?i_m=')[1]}`),
      type: "popup",
      focused: true,
      width: 390,
      height: 600,
      top: 0,
      left: request.windowWidth - 390,
    }, (window) => {
      currentWindow = window;
    });
  }
});
