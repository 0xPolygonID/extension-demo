'use strict';
document.addEventListener('authEvent', function(e) {
    chrome.runtime.sendMessage({type: 'OpenAuth', href: e.detail})
});