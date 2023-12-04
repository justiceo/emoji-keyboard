import { Logger } from "../utils/logger";
import Storage from "../utils/storage";
import { CLICKED_EMOJIS } from "../utils/storage-keys";
import emojiList from "../standalone/emoji-list.json";

export class Floatie {
  query = "";
  isFloatieActive = false;
  logger = new Logger("Floatie");
  lastMousePosition?: DOMRect;
  matchingEmojis: any[] = [];

  renderer = (msg) => {
    // Anyone can override this handler.
    this.logger.debug(msg);
    window.postMessage(msg);
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
    } else if (event.key === " " && this.isFloatieActive) {
      this.maybeCloseFloatie(event);
    } else if (this.isFloatieActive) {
      this.query += event.key;
      this.maybeUpdateSuggestion(event);
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
          selected: selectedEmojiIndex,
        },
        point: this.lastMousePosition,
      });
    } else if (e.key == "Tab" || e.key === "Enter") {
      e.preventDefault();
      // Todo: fix for contenteditable later.
      // insert last selected emoji.
      const selectedEmoji = this.matchingEmojis.find((e) => e.selected);
      if (selectedEmoji) {
        const input = e.target;
        const caretPos = input.selectionStart;
        const context = input.value.slice(0, caretPos);
        const colonIndex = context.lastIndexOf(":");
        const pretext = context.slice(0, colonIndex);
        const posttext = context.slice(caretPos, context.length);
        const emoji = selectedEmoji.emoji;
        const newContext = pretext + emoji + posttext;
        input.value = newContext;
        input.selectionStart = caretPos + emoji.length - 1;
        input.selectionEnd = caretPos + emoji.length - 1;
        this.maybeCloseFloatie(e);
      }
    }
  };

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
      const suggestedEmojis = this.suggestEmojis(context, this.matchingEmojis);
      this.renderer({
        application: "emoji-keyboard",
        action: "render-emojis",
        data: {
          title: "Suggestions ✨",
          emojis: suggestedEmojis,
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

    // Mark the first emoji as selected.
    if (this.matchingEmojis.length > 0) {
      this.matchingEmojis[0].selected = true;
    }

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

  maybeCloseFloatie(e) {
    if (this.isFloatieActive) {
      this.isFloatieActive = false;
      this.query = "";
      this.matchingEmojis = [];
      this.logger.log("floatie deactivated", e);
      this.renderer({
        application: "emoji-keyboard",
        action: "escape",
        point: e.target.getBoundingClientRect(),
      });
    }
  }

  // TODO: implement.
  updateSuggestions = (e) => {
    const input = e.target;
    const caretPos = input.selectionStart;
    const context = input.value.slice(0, caretPos);
    const colonIndex = context.indexOf(":");
    const pretext = context.slice(0, colonIndex);
    const query = context.slice(colonIndex + 1, caretPos);

    if (colonIndex === -1) {
      // the caret is behind the trigger, return no suggestion
      this.logger.log("No suggestions: out of context");
      return;
    }
    if (context.length > 0) {
    }
  };

  suggestEmojis(context: string, recentEmojis) {
    // TODO: Filter recentEmojis and emoji bank for context.
    return recentEmojis;
  }

  searchHandler = (query: string, context: string, recentEmojis) => {
    const results = emojiList.filter((emoji) =>
      emoji.alternatesStr.includes(query)
    );
    return results;
  };
}
