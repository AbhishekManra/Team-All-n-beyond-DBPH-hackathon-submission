document.addEventListener('DOMContentLoaded', function () {
  // Send "popup_open" message when the popup is opened
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "popup_open" });
  });

  // Send "analyze_site" message when the analyze button is clicked
  var analyzeButton = document.getElementsByClassName("analyze-button")[0];
  if (analyzeButton) {
      analyzeButton.onclick = function () {
          chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_site" });
          });
      };
  }

  // Open a new tab when the link is clicked
  var linkElement = document.getElementsByClassName("link")[0];
  if (linkElement) {
      linkElement.onclick = function () {
          chrome.tabs.create({
              url: linkElement.getAttribute("href"),
          });
      };
  }
});

// Listen for "update_current_count" message from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "update_current_count") {
      var numberElement = document.getElementsByClassName("number")[0];
      if (numberElement) {
          numberElement.textContent = request.count;
      }
  }
});
