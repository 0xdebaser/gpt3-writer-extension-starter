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
  console.log(request);
  const { target, replacement } = request.content;
  replaceAllDomInstances(target, replacement.trimStart());
  sendResponse({ status: "success" });
});

window.addEventListener("contextmenu", (event) => {
  targetEl = event.target;
});
