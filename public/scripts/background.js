
// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener(request => {
  if (request.type === "OpenAuth") {
    // console.log('OpenPopup');
    // alert(request.href);
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // query the active tab, which will be only one tab
      //and inject the script in it
      // chrome.tabs.executeScript(tabs[0].id, {file: "content_script.js"});
    // });
    console.log(request.href);
    chrome.windows.create({
      url: chrome.runtime.getURL(`index.html#/auth?i_m=${request.href.split('?i_m=')[1]}`),
      type: "popup",
      focused: true,
      width: 390,
      height: 600,
      top: 0,
      left: window.screen.width - 390,
    }, () => {
      console.log("Opened popup!")
    })
    
  }
})

