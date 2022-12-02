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

async function generateCompletionAction({ selectionText }) {
  try {
    sendMessage("generating...");
    const prompt = `Rewrite the following text in the style of William Shakespeare: ${selectionText}.`;
    const baseCompletion = await generate(prompt);
    console.log(baseCompletion.text);
    sendMessage(baseCompletion.text);
  } catch (error) {
    console.error(error);
    sendMessage(error.toString());
  }
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

// function added by 0xdebaser
function sendMessage2(selectionText, replacementText) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    // chrome.tabs.sendMessage(tab, payload, callback)
    chrome.tabs.sendMessage(
      activeTab,
      {
        message: "inject",
        selectionText: selectionText,
        replacementText: replacementText,
      },
      (response) => {
        if (response.status === "failed") {
          console.log("injection failed.");
        }
      }
    );
  });
}

//function added by 0xdebaser
async function generateAnSend({ selectionText }) {
  try {
    sendMessage("generating...");
    const prompt = `Rewrite the following text in the style of William Shakespeare: ${selectionText}.`;
    const response = await generate(prompt);
    const replacementText = response.text;
    console.log(replacementText);
    sendMessage2(selectionText, replacementText);
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

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
