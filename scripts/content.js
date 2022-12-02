// see https://meet-martin.medium.com/using-javascript-es6-import-export-modules-in-chrome-extensions-f63a3a0d2736

"use strict";

const script = document.createElement("script");
script.setAttribute("type", "module");
script.setAttribute("src", chrome.extension.getURL("main.js"));
const head =
  document.head ||
  document.getElementsByTagName("head")[0] ||
  document.documentElement;
head.insertBefore(script, head.lastChild);
