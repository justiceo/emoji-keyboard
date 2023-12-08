import "../utils/feedback/feedback";
import { RemoteLogger } from "../utils/logger";

class Popup {
  logger = new RemoteLogger(this);

  init() {
    this.registerOptionsNav();
  }

  registerOptionsNav() {
    document.querySelector("#go-to-options")?.addEventListener("click", () => {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL("options.html"));
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Popup().init();
});
