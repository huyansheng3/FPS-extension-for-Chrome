chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.id, { message: 'clicked_browser_action' });
});
