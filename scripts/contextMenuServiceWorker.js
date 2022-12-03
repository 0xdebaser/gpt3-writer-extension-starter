async function generate(prompt) {
  const key = await getKey();
  const url = "https://api.openai.com/v1/completions";

  const completionsResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  });
  const completion = await completionsResponse.json();
  console.log(completion.choices);
  return completion.choices.pop();
}

function getKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["openai-key"], (result) => {
      if (result["openai-key"]) {
        const decodedKey = atob(result["openai-key"]);
        resolve(decodedKey);
      }
    });
  });
}

function sendMessage(content) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;
    // chrome.tabs.sendMessage(tab, payload, callback)
    chrome.tabs.sendMessage(
      activeTab,
      { message: "inject", content },
      (response) => {
        // if (response.hasOwnPropery("status") && response.status === "failed") {
        //   console.log("injection failed.");
        console.log(response);
      }
    );
  });
}

async function generateAndSend({ selectionText }) {
  const loadingText = "generating...";
  try {
    sendMessage({ target: selectionText, replacement: loadingText });
    const prompt = `Rewrite the following text in the style of William Shakespeare: ${selectionText}.`;
    const response = await generate(prompt);
    const replacementText = response.text;
    console.log(replacementText);
    sendMessage({ target: loadingText, replacement: replacementText });
  } catch (error) {
    console.error(error);
    sendMessage(error.toString());
  }
}

console.log("Hello from contextMenuServiceWorker!");

chrome.contextMenus.create({
  id: "context-run",
  title: "Shake It!",
  contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(generateAndSend);
