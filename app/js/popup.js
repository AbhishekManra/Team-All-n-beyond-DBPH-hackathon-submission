window.onload = function () {
  // Get the active tab and send a message when the popup opens
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "popup_open" });
  });

// analyze button
  const analyzeButton = document.getElementsByClassName("analyze-button")[0];
  analyzeButton.addEventListener("click", function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_site" });
    });
  });

  //  event  to the link
  const linkElement = document.getElementsByClassName("link")[0];
  linkElement.addEventListener("click", function () {
    chrome.tabs.create({ url: linkElement.getAttribute("href") });
  });
};
//show count
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "update_current_count") {
    document.getElementsByClassName("number")[0].textContent = request.count;
  }
});




