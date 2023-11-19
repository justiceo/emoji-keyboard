import { Logger } from "../utils/logger";
import { WinBox } from "../utils/winbox/winbox";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { i18n } from "../utils/i18n";

export class WinboxRenderer {
  logger = new Logger(this);
  dialog?: WinBox;

  // Close the dialog upon any interaction with containing doc.
  onEscHandler = (evt) => {
    this.handleMessage({
      action: "escape",
      href: document.location.href,
    });
  };

  async handleMessage(message) {
    this.logger.debug("#handleMessage: ", message);
    switch (message.action) {
      case "render-emojis":
        this.renderEmojis(
          message.data.title,
          message.data.emojis,
          message.point
        );
        break;
      case "emoji-hover":
        // todo: display emoji title;
        break;
      case "emoji-click":
        // todo: display "copied" notice
        break;
      case "escape":
        this.dialog?.close();
        break;
      default:
        this.logger.warn("Unhandled action: ", message.action);
        break;
    }
  }

  async renderEmojis(title: string, emojis: any[], point?: DOMRect) {
    this.logger.log("#renderEmojis: ", title, emojis, point);
    const list = document.createElement("ul");
    list.style.display = "flex";

    emojis.forEach((e) => {
      const el = document.createElement("li");
      el.innerHTML = e.emoji;
      el.style.margin = "5px";
      el.style.fontSize = "20px";
      list.appendChild(el);
    });
    const winboxOptions = await this.getWinboxOptions(list, point);

    if (!this.dialog) {
      this.logger.debug("Creating new dialog with options", winboxOptions);
      this.dialog = new WinBox(i18n(title), winboxOptions);
      // this.dialog.mount(list);
    } else {
      this.logger.debug("Restoring dialog");
      this.dialog.move(
        winboxOptions.x,
        winboxOptions.y,
        /* skipUpdate= */ false
      );
      this.dialog.setTitle(i18n(title));
      this.dialog.mount(list);
    }

    this.dialog.addControl({
      index: 2,
      class: "wb-open material-symbols-outlined",
      title: "Help",
      image: "",
      click: (event, winbox) => {
        this.logger.debug("#openOptions");
        chrome.runtime.sendMessage("open_options_page");
      },
    });
  }

  async getWinboxOptions(markup: HTMLElement, point?: DOMRect) {
    let pos = { x: 0, y: 0, placement: "top" };
    if (point) {
      pos = await this.getPos(point!);
    }
    return {
      icon: "",
      x: pos.x,
      y: pos.y,
      header: 20,
      background: "white",
      color: "black",
      width: "300px",
      height: "50px",
      autosize: false,
      class: [
        "no-max",
        "no-close",
        "no-full",
        "no-min",
        "no-resize",
        "no-move",
      ],
      index: await this.getMaxZIndex(),
      // Simply updating the url without changing the iframe, means the content-script doesn't get re-inserted into the frame, even though it's now out of context.
      mount: markup,
      hidden: false,
      shadowel: "smart-emoji-keyboard-window",
      cssurl: chrome.runtime.getURL("content-script/winbox-extended.css"),

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
          parseFloat(window.getComputedStyle(el).zIndex)
        ).filter((zIndex) => !Number.isNaN(zIndex)),
        0
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
    div.style.width = "300px";
    div.style.height = "50px";
    div.style.position = "fixed";
    div.style.visibility = "hidden";
    document.body.appendChild(div);
    return computePosition(virtualEl, div, {
      placement: "top",
      strategy: "fixed", // If you use "fixed", x, y would change to clientX/Y.
      middleware: [
        offset(5), // Space between mouse and tooltip.
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
