const changeKeyButton = document.getElementById("change-key-button");
const keyNeeded = document.getElementById("key-needed");
const keyEntered = document.getElementById("key-entered");
const saveKeyButton = document.getElementById("save-key-button");

function changeKey() {
  keyNeeded.style.display = "block";
  keyEntered.style.display = "none";
}

function checkForKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["openai-key"], (result) => {
      resolve(result["openai-key"]);
    });
  });
}

function encode(input) {
  return btoa(input);
}

async function saveKey() {
  const input = document.getElementById("key-input");

  if (input) {
    const { value } = input;
    const encodedValue = encode(value);
    chrome.storage.local.set({ "openai-key": encodedValue }, () => {
      keyNeeded.style.display = "none";
      keyEntered.style.display = "block";
    });
  }
}

saveKeyButton.addEventListener("click", saveKey);
changeKeyButton.addEventListener("click", changeKey);

checkForKey().then((response) => {
  if (response) {
    keyNeeded.style.display = "none";
    keyEntered.style.display = "block";
  }
});
