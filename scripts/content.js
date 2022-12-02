function insert(content) {
  // Find Calmly editor input section
  const elements = document.getElementsByClassName("droid");

  if (elements.length === 0) {
    return false;
  }

  const element = elements[0];

  // Grab the first p tag so we can replace it with our injection
  //   const pToRemove = element.childNodes[0];
  //   pToRemove.remove();
  element.innerHTML = "";

  // Split content by \n
  const splitContent = content.split("\n");

  // Wrap in p tags
  splitContent.forEach((content) => {
    const p = document.createElement("p");

    if (content === "") {
      const br = document.createElement("br");
      p.appendChild(br);
    } else {
      p.textContent = content;
    }

    // Insert into HTML one at a time
    element.appendChild(p);

    // On success return true
    return true;
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "inject") {
    const { content } = request;
    const result = insert(content);
    if (!result) {
      sendResponse({ status: "failed" });
    } else {
      sendResponse({ status: "success" });
    }
  }
});
