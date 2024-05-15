
// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
let currentWindow = null;
chrome.windows.onRemoved.addListener(
  (windowId) => {
    if (currentWindow?.id === windowId) {
      currentWindow = null;
    }
  }
)
chrome.runtime.onMessage.addListener(async request => {
  if (request.type === "OpenAuth") {
    if (currentWindow) {
      await chrome.windows.remove(currentWindow.id);
    }
    if (request.href.includes('?openid-request=')) {
      const payload = request.href.split('?openid-request=')[1];
      chrome.windows.create({
        url: chrome.runtime.getURL(`index.html#/openIdRequest?payload=${payload}`),
        type: "popup",
        focused: true,
        width: 390,
        height: 600,
        top: 0,
        left: request.windowWidth - 390,
      }, () => {
        console.log("Opened popup!")
      });
    } else if (request.href.includes('?openid-offer=')) {
      const payload = request.href.split('?openid-offer=')[1];
      chrome.windows.create({
        url: chrome.runtime.getURL(`index.html#/openIdOffer?type=base64&payload=${payload}`),
        type: "popup",
        focused: true,
        width: 390,
        height: 600,
        top: 0,
        left: request.windowWidth - 390,
      }, () => {
        console.log("Opened popup!")
      });
    } else {
      const data = request.href.includes('?i_m=')
        ? { type: 'base64', payload: request.href.split('?i_m=')[1] }
        : { type: 'link', payload: decodeURIComponent(request.href.split('?request_uri=')[1]) };

      chrome.windows.create({
        url: chrome.runtime.getURL(`index.html#/auth?type=${data.type}&payload=${data.payload}`),
        type: "popup",
        focused: true,
        width: 390,
        height: 600,
        top: 0,
        left: request.windowWidth - 390,
      }, () => {
        console.log("Opened popup!")
      })
    }
  }
});
