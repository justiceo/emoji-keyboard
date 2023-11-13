import { Logger } from "../utils/logger";
import { APPLICATION_ID } from "../utils/const";

// This script is executed inside the previewed page (i.e. document is iframe).
export class IFrameHelper {
  logger = new Logger(this);

  registerListeners() {
    // This script is only applicable in Iframes that were created by the extension.
    if (!this.inIframe()) {
      return;
    }
    if (this.getFrameName() !== APPLICATION_ID) {
      return;
    }

    document.onkeydown = this.onEscape;
    window.onload = this.onLoad;
    window.onunload = this.onUnload;
  }

  inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  getFrameName() {
    return window.name;
  }

  sendMessage(message: any) {
    this.logger.debug("#sendMessage", message);
    chrome.runtime.sendMessage({
      application: APPLICATION_ID,
      sourceFrame: this.getFrameName(),
      href: document.location.href,
      ...message,
    });
  }

  onEscape = (evt: KeyboardEvent) => {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = evt.key === "Escape" || evt.key === "Esc";
    } else {
      isEscape = evt.keyCode === 27;
    }
    if (isEscape) {
      this.sendMessage({
        action: "escape",
      });
    }
  };

  onLoad = (_: Event) => {
    this.sendMessage({
      action: "iframe-loaded",
    });
  };

  onUnload = (_: Event) => {
    this.sendMessage({
      action: "iframe-unload",
    });
  };
}
new IFrameHelper().registerListeners();
