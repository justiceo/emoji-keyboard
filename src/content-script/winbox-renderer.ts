import { Logger } from "../utils/logger";
import { WinBox } from "../utils/winbox/winbox";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import "./previewr.css";
import manifest from "../manifest.json";

// Export the dialog dom
WinBox.prototype.getDom = function () {
  return this.dom;
};

WinBox.prototype.startLoading = function () {
  this.dom.querySelector(".loading").style.display = "block";
};
WinBox.prototype.stopLoading = function () {
  this.dom.querySelector(".loading").style.display = "none";
};

// This class is responsible to loading/reloading/unloading the angular app into the UI.
export class WinboxRenderer {
  logger = new Logger(this);
  iframeName = manifest.__package_name + "/mainframe";
  dialog?: WinBox;
  urlBase = chrome.runtime.getURL("standalone/emoji.html#");

  onMessageHandler = (event) => {
    if (event.origin !== window.location.origin) {
      this.logger.debug(
        "Ignoring message from different origin",
        event.origin,
        event.data,
      );
      return;
    }

    if (event.data.application !== manifest.__package_name) {
      this.logger.debug("Ignoring origin messsage not initiated by Dictionary");
      return;
    }

    this.handleMessage(event.data);
  };

  // Close the dialog upon any interaction with containing doc.
  onEscHandler = (evt) => {
    this.handleMessage({
      action: "escape",
      href: document.location.href,
      sourceFrame: this.iframeName,
    });
  };

  async handleMessage(message) {
    this.logger.debug("#handleMessage: ", message);
    switch (message.action) {
      case "emoji-search":
        try {
          let searchUrl = this.urlBase + message.data;
          if (this.dialog) {
            this.dialog.startLoading();
          }
          this.previewUrl(new URL(searchUrl), message.point);
          return;
        } catch (e) {
          this.logger.log("Error creating url: ", e);
        }
        break;
      case "loaded-and-cleaned":
        // TODO: Reset to actual URL in case of internal navigation within iframe.
        // this.url = new URL(message.href);
        this.dialog?.show();
        this.dialog?.stopLoading();
        break;
      case "loaded-and-no-def":
        // TODO: If verbose-define, show NO definition found.
        this.dialog?.close();
        break;
      case "unload":
        this.dialog?.startLoading();
        break;
      case "escape":
        this.dialog?.close();
        break;
      default:
        this.logger.warn("Unhandled action: ", message.action);
        break;
    }
  }

  async previewUrl(url: URL, point?: DOMRect) {
    this.logger.log("#previewUrl: ", url);
    const winboxOptions = await this.getWinboxOptions(url, point);

    if (!this.dialog) {
      this.logger.debug("creating new dialog with options", winboxOptions);
      this.dialog = new WinBox(
        chrome.i18n.getMessage("appName"),
        winboxOptions,
      );
    } else {
      this.logger.debug("restoring dialog");
      // TODO: Also reset html to ensure load is fired.
      this.dialog.setUrl(url.href);
      this.dialog.move(
        winboxOptions.x,
        winboxOptions.y,
        /* skipUpdate= */ false,
      );
    }
  }

  async getWinboxOptions(url: URL, point?: DOMRect) {
    let pos = { x: 0, y: 0, placement: "top" };
    if (point) {
      pos = await this.getPos(point!);
    }
    return {
      icon: chrome.runtime.getURL("assets/logo-24x24.png"),
      x: pos.x,
      y: pos.y,
      width: "410px",
      height: "400px",
      autosize: false,
      class: ["no-max", "no-full", "no-min", "no-resize", "no-move"],
      index: await this.getMaxZIndex(),
      // Simply updating the url without changing the iframe, means the content-script doesn't get re-inserted into the frame, even though it's now out of context.
      html: `<iframe name="${this.iframeName}" src="${url}"></iframe><div class="loading"><span class="bar-animation"></span></div> `,
      // url: url.href, // Update restore when you update this.
      hidden: false,
      shadowel: "smart-emoji-keyboard-window",
      cssurl: chrome.runtime.getURL("content-script/winbox.css"),
      framename: this.iframeName,

      onclose: () => {
        this.dialog = undefined;
        document
          .querySelectorAll("smart-emoji-keyboard-window")
          ?.forEach((e) => e.remove());
      },
    };
  }

  getMaxZIndex() {
    return new Promise((resolve: (arg0: number) => void) => {
      const z = Math.max(
        ...Array.from(document.querySelectorAll("body *"), (el) =>
          parseFloat(window.getComputedStyle(el).zIndex),
        ).filter((zIndex) => !Number.isNaN(zIndex)),
        0,
      );
      resolve(z);
    });
  }

  async getPos(rect: DOMRect) {
    const virtualEl = {
      getBoundingClientRect() {
        return rect;
      },
    };
    const div = document.createElement("div");
    // These dimensions need to match that of the dialog precisely.
    div.style.width = "410px";
    div.style.height = "400px";
    div.style.position = "fixed";
    div.style.visibility = "hidden";
    document.body.appendChild(div);
    return computePosition(virtualEl, div, {
      placement: "top",
      strategy: "fixed", // If you use "fixed", x, y would change to clientX/Y.
      middleware: [
        offset(12), // Space between mouse and tooltip.
        flip(),
        shift({ padding: 5 }), // Space from the edge of the browser.
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      return {
        x: x,
        y: y,
        placement: placement,
      };
    });
  }
}
