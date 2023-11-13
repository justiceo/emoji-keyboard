import { SettingsUI } from "../utils/options/settings";
import "../utils/feedback/feedback";
import { RemoteLogger } from "../utils/logger";

document.querySelector("#go-to-options").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});

const L = new RemoteLogger("popup");
L.debug("Init success");
