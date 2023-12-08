import "../content-script/content-script"; // For demo.
import { SettingsUI } from "../utils/settings/settings";
import "./options.css";
import "../utils/feedback/feedback";
import { configOptions, packageName } from "../config";
import { appDescription, appName } from "../utils/i18n";
import { Logger } from "../utils/logger";

class Options {
  logger = new Logger(this);

  init() {
    this.renderSettingsUI();
    this.setI18nText();
    this.registerDemoClickHandler();
  }

  renderSettingsUI() {
    document
      .querySelector(".options-container")
      ?.appendChild(new SettingsUI(configOptions));
  }

  setI18nText() {
    document.querySelector(".title")!.textContent = appName;
    document.querySelector(".description")!.textContent = appDescription;
    // Todo: set show-demo and report and issue.
  }

  registerDemoClickHandler() {
    document.querySelector("#show-preview")?.addEventListener("click", () => {
      this.logger.debug("Handling demo click");
      window.postMessage(
        { application: packageName, action: "render-emojis" },
        window.location.origin
      );
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Options().init();
});
