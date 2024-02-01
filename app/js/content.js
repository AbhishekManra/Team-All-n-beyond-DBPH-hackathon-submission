const endpoint = "http:/127.0.0.1:5000/";
const descriptions = {
  "Sneaking": "Coerces users to act in ways that they would not normally act by obscuring information.",
  "Urgency": "Places deadlines on things to make them appear more desirable",
  "Misdirection": "Aims to deceptively incline a user towards one choice over the other.",
  "Social Proof": "Gives the perception that a given action or product has been approved by other people.",
  "Scarcity": "Tries to increase the value of something by making it appear to be limited in availability.",
  "Obstruction": "Tries to make an action more difficult so that a user is less likely to do that action.",
  "Forced Action": "Forces a user to complete extra, unrelated tasks to do something that should be simple.",
};

function scrape() {

  if (document.getElementById("anb_count")) {
    return;
  }

  const elements = getFilteredElements(document.body);

  fetchDarkPatterns(elements)
    .then(processDarkPatterns)
    .catch(handleError);
}

function getFilteredElements(body) {
  const elements = segments(body);
  return elements
    .map((element) => element.innerText.trim().replace(/\t/g, " "))
    .filter((text) => text.length > 0);
}

function fetchDarkPatterns(filteredElements) {
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokens: filteredElements }),
  })
    .then((resp) => resp.json());
}

function processDarkPatterns(data) {
  data = data.replace(/'/g, '"');
  const json = JSON.parse(data);

  let dpCount = 0;
  let elementIndex = 0;

  const elements = segments(document.body);
  elements.forEach((element) => {
    const text = element.innerText.trim().replace(/\t/g, " ");
    if (text.length > 0 && json.result[elementIndex] !== "Not Dark") {
      highlight(element, json.result[elementIndex]);
      dpCount++;
    }
    elementIndex++;
  });

  storeDarkPatternsCount(dpCount);
}

function highlight(element, type) {
  element.classList.add("anb-highlight");

  const body = document.createElement("span");
  body.classList.add("anb-highlight-body");

  const header = document.createElement("div");
  header.classList.add("modal-header");
  const headerText = document.createElement("h1");
  headerText.innerHTML = type + " Pattern";
  header.appendChild(headerText);
  body.appendChild(header);

  const content = document.createElement("div");
  content.classList.add("modal-content");
  content.innerHTML = descriptions[type];
  body.appendChild(content);

  element.appendChild(body);
}

function storeDarkPatternsCount(number) {
  const g = document.createElement("div");
  g.id = "anb_count";
  g.value = number;
  g.style.opacity = 0;
  g.style.position = "fixed";
  document.body.appendChild(g);
  sendDarkPatterns(number);
}

function sendDarkPatterns(number) {
  chrome.runtime.sendMessage({
    message: "update_current_count",
    count: number,
  });
}

function handleError(error) {
  console.error(error);
  console.error(error.stack);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "analyze_site") {
    scrape();
  } else if (request.message === "popup_open") {
    const element = document.getElementById("anb_count");
    if (element) {
      sendDarkPatterns(element.value);
    }
  }
});


