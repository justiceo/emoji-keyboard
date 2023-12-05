import { Logger } from "../utils/logger";
import Storage from "../utils/storage";
import { CLICKED_EMOJIS } from "../utils/storage-keys";
import emojiList from "../standalone/emoji-list.json";

export class Floatie {
  query = "";
  isFloatieActive = false;
  logger = new Logger("Floatie");
  lastMousePosition?: DOMRect;
  lastInput: HTMLInputElement | null;
  matchingEmojis: any[] = [];

  renderer = (msg) => {
    // Anyone can override this handler.
    this.logger.debug(msg);
    window.postMessage(msg);
  };

  // Handle click events on the floatie.
  clickHandler = (event) => {
    if (
      !this.isFloatieActive ||
      event.target?.nodeName !== "LI" ||
      !this.lastInput
    ) {
      return;
    }

    if (
      !(event.target as HTMLElement).parentElement?.classList.contains(
        "emoji-list"
      ) ||
      !(event.target as HTMLElement).closest(".winbox")
    ) {
      return;
    }

    // Emoji was clicked.
    const emoji = (event.target as HTMLElement).innerText;
    this.insertEmojiIntoInput(emoji, this.lastInput);
    // TODO: maybe update "clicked_emojis" in storage.
    this.maybeCloseFloatie(event);
  };

  // Keypress event is only raised by character keys on input-like elements.
  // This listener operates (is bound) at the window level, not element level.
  keypressListener = (event) => {
    // TODO: Handle contentEditable elements (e.g. instagram)
    if (
      event.target?.nodeName !== "INPUT" &&
      event.target?.nodeName !== "TEXTAREA"
    ) {
      this.logger.debug("Ignoring event in non-input:", event);
      return;
    }

    // Do not show for non-text fields e.g. passwords or email.
    // HTML input types - https://www.w3schools.com/html/html_form_input_types.asp
    if (
      event.target?.type !== "text" &&
      event.target?.type !== "textarea" &&
      event.target?.type !== "search"
    ) {
      this.logger.debug("Ignoring event from non-text input:", event);
      return;
    }

    this.logger.debug("#keypress:", event.key);
    if (event.key === ":") {
      this.maybeActivateFloatie(event);
      this.lastInput = event.target as HTMLInputElement;
    } else if (event.key === " " && this.isFloatieActive) {
      this.maybeCloseFloatie(event);
    } else if (this.isFloatieActive) {
      this.query += event.key;
      this.maybeUpdateSuggestion(event);
      this.lastInput = event.target as HTMLInputElement;
    }
  };

  // Ideal for intercepting events that we want to handle instead of the input (e.g. arrow keys)
  keydownHandler = (e) => {
    this.lastMousePosition = {
      width: 300,
      height: 50,
      x: e.x,
      y: e.y,
      left: e.x,
      top: e.y,
    } as DOMRect;

    if (!this.isFloatieActive) {
      return;
    }

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      // Handle arrow keys (change selected emoji)? FYI: User might be navigating the input field.
      let selectedEmojiIndex = this.matchingEmojis.findIndex((e) => e.selected);
      switch (e.key) {
        case "ArrowLeft":
          selectedEmojiIndex--;
          break;
        case "ArrowRight":
          selectedEmojiIndex++;
          break;
        case "ArrowUp":
          // Do nothing for now?? since we are shooting for a single row.
          break;
        case "ArrowDown":
          break;
      }
      if (selectedEmojiIndex < 0) {
        selectedEmojiIndex = this.matchingEmojis.length - 1;
      } else if (selectedEmojiIndex >= this.matchingEmojis.length) {
        selectedEmojiIndex = 0;
      }
      this.matchingEmojis.forEach((e) => (e.selected = false));
      this.matchingEmojis[selectedEmojiIndex].selected = true;
      this.renderer({
        application: "emoji-keyboard",
        action: "render-emojis",
        data: {
          title: "Results 🔎",
          emojis: this.matchingEmojis,
        },
        point: this.lastMousePosition,
      });
    } else if (e.key == "Tab" || e.key === "Enter") {
      e.preventDefault();
      // Todo: fix for contenteditable later.
      // insert last selected emoji.
      const selectedEmoji = this.matchingEmojis.find((e) => e.selected);
      if (selectedEmoji) {
        this.insertEmojiIntoInput(selectedEmoji.emoji, e.target);
        this.maybeCloseFloatie(e);
      }
    }
  };

  insertEmojiIntoInput(emoji: string, input: HTMLInputElement) {
    const caretPos = input.selectionStart ?? 0;
    const context = input.value.slice(0, caretPos);
    const colonIndex = context.lastIndexOf(":");
    const pretext = context.slice(0, colonIndex);
    const posttext = context.slice(caretPos, context.length);
    const newContext = pretext + emoji + posttext;
    input.value = newContext;
    input.selectionStart = caretPos + emoji.length - 1;
    input.selectionEnd = caretPos + emoji.length - 1;
  }

  // Ideal for observing events that we don't mind modifying the input element (e.g. backspace)
  keyupHandler = (e) => {
    this.lastMousePosition = {
      width: 300,
      height: 50,
      x: e.x,
      y: e.y,
      left: e.x,
      top: e.y,
    } as DOMRect;

    if (!this.isFloatieActive) {
      return;
    }

    if (e.key === "Backspace" && this.isFloatieActive) {
      // todo: delete button? No
      this.query = this.query.slice(0, this.query.length - 1);
      this.maybeUpdateSuggestion(e);
    } else if (e.key === "Escape") {
      this.maybeCloseFloatie(e);
    }
  };

  async maybeActivateFloatie(e) {
    this.isFloatieActive = true;
    const context = e.target.value.slice(0, e.target.selectionStart).trim();
    this.matchingEmojis = await Storage.get(CLICKED_EMOJIS);

    // TODO: If there is no space prior, ignore.
    // Unless the prior character is an emoji :)
    // This is non-trivial - https://stackoverflow.com/a/39425959

    if (context.length === 0) {
      this.selectTheFirstEmoji();
      this.renderer({
        application: "emoji-keyboard",
        action: "render-emojis",
        data: {
          title: "Recents ⏰",
          emojis: this.matchingEmojis,
        },
        point: e.target.getBoundingClientRect(),
      });
    } else {
      // Display suggestions based on context.
      this.matchingEmojis = this.suggestHandler(context, this.matchingEmojis);
      this.selectTheFirstEmoji();
      this.renderer({
        application: "emoji-keyboard",
        action: "render-emojis",
        data: {
          title: "Suggestions ✨",
          emojis: this.matchingEmojis,
        },
        point: e.target.getBoundingClientRect(),
      });
    }
  }

  async maybeUpdateSuggestion(e) {
    const context: string = e.target.value
      .slice(0, e.target.selectionStart)
      .trim();
    const emojiHistory = await Storage.get(CLICKED_EMOJIS);
    this.matchingEmojis = this.searchHandler(this.query, context, emojiHistory);

    if (!context.includes(":") || context.length === 0) {
      // TODO: narrow down to string in front.
      // regex match context for : and any word characters till the end of the string.
      this.logger.debug(
        "matcher value: ",
        context.match(/:\w+$/),
        "for context:",
        context
      );
      this.maybeCloseFloatie(e);
      return;
    }
    if (!this.isFloatieActive) {
      this.maybeCloseFloatie(e);
      return;
    }

    this.selectTheFirstEmoji();
    this.renderer({
      application: "emoji-keyboard",
      action: "render-emojis",
      data: {
        title: "Results 🔎",
        emojis: this.matchingEmojis,
      },
      point: e.target.getBoundingClientRect(),
    });
  }

  selectTheFirstEmoji() {
    this.matchingEmojis.forEach((e) => (e.selected = false));
    if (this.matchingEmojis.length > 0) {
      this.matchingEmojis[0].selected = true;
    }
  }

  maybeCloseFloatie(e) {
    if (this.isFloatieActive) {
      this.isFloatieActive = false;
      this.query = "";
      this.matchingEmojis = [];
      this.logger.log("floatie deactivated", e);
      this.lastInput = null;
      this.renderer({
        application: "emoji-keyboard",
        action: "escape",
        point: e.target.getBoundingClientRect(),
      });
    }
  }

  suggestHandler(context: string, recentEmojis) {
    return recentEmojis;
  }

  searchHandler = (query: string, context: string, recentEmojis) => {
    const results = emojiList.filter((emoji) =>
      emoji.alternatesStr.includes(query)
    );
    return results;
  };
}
