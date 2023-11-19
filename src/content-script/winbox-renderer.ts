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
    list.classList.add("emoji-list");

    emojis.forEach((emoji) => {
      const el = document.createElement("li");
      el.innerHTML = emoji.emoji;
      el.addEventListener("mouseover", (e) => {
        this.logger.debug("hovered on ", emoji.description[0]);

        this.dialog!.dom.querySelector(".wb-notice").classList.remove('success', "hidden");
        const truncate = (input) => input.length > 31 ? `${input.substring(0, 28)}...` : input;
        this.dialog!.dom.querySelector(".wb-notice").innerHTML = ":" + truncate(emoji.description[0]);
      });
      el.addEventListener("click", (e) => {
        this.logger.debug("clicked on ", emoji.description[0]);
        navigator.clipboard.writeText(emoji.emoji);
        this.dialog!.dom.querySelector(".wb-notice").classList.add('success');
        this.dialog!.dom.querySelector(".wb-notice").innerHTML = "copied to clipboard!";
      });
      list.appendChild(el);
    });

    list.addEventListener("mouseleave", e => {
      this.dialog!.dom.querySelector(".wb-notice").innerHTML = "";
      this.dialog!.dom.querySelector(".wb-notice").classList.remove('success');
      this.dialog!.dom.querySelector(".wb-notice").classList.add('hidden');
    });
    const winboxOptions = await this.getWinboxOptions(list, point);

    if (!this.dialog) {
      this.logger.debug("Creating new dialog with options", winboxOptions);
      this.dialog = new WinBox(i18n(title), winboxOptions);
      const notice = document.createElement("span");
      notice.classList.add("wb-notice", "hidden");
      const header = this.dialog.dom.querySelector(".wb-header") as HTMLElement;
      if (header) {
        header.insertBefore(notice, header.lastChild)
      } else {
        this.logger.warn("Couldn't find header to insert notice into.");
      }
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
      width: "320px",
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
    const placeholder = document.createElement("div");
    // These dimensions need to match that of the dialog precisely.
    placeholder.style.width = "310px";
    placeholder.style.height = "50px";
    placeholder.style.position = "fixed";
    placeholder.style.visibility = "hidden";
    document.body.appendChild(placeholder);
    return computePosition(virtualEl, placeholder, {
      placement: "top",
      strategy: "fixed", // If you use "fixed", x, y would change to clientX/Y.
      middleware: [
        offset(5), // Space between mouse and tooltip.
        flip(),
        shift({ padding: 5 }), // Space from the edge of the browser.
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      placeholder.remove();
      return {
        x: x,
        y: y,
        placement: placement,
      };
    });
  }
}
