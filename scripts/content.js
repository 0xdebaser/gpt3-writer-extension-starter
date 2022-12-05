let targetEl;

async function replaceAllDomInstances(target, replacement) {
  console.log("Target:", target);
  console.log("Replacement:", replacement);
  if (targetEl && targetEl.textContent) {
    targetEl.textContent = targetEl.textContent.replace(target, replacement);
    return "success";
  } else return "failure";
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.content === "no api key!") {
    alert(
      "Using Shake It requires you to enter your own OpenAI api key. To get one, visit: https://beta.openai.com/account/api-keys."
    );
    sendResponse({ status: "success" });
  } else {
    const { target, replacement } = request.content;
    replaceAllDomInstances(target, replacement.trimStart());
    sendResponse({ status: "success" });
  }
});

window.addEventListener("contextmenu", (event) => {
  targetEl = event.target;
});
