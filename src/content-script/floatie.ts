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

  // Listen for all keypress events and scan for input types.
  // Listening for changes on input elements has the drawback
  // that we have to keep checking the DOM for newly added inputs.
  keyListenerForEmoji = (event) => {
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

    this.logger.debug("#keyListenerForEmoji handling key:", event.key);
    if (event.key === ":") {
      this.maybeActivateFloatie(event);
    } else if (event.key === " ") {
      this.maybeCloseFloatie(event);
    } else {
      this.query += event.key;
      this.maybeUpdateSuggestion(event);
    }
  };

  metaListenerForEmoji = (e) => {
    // TODO: Handle backspace character (remove last character from query)
    // Handle enter character (insert emoji)
    // Handle tab character (insert emoji)

    this.lastMousePosition = {
      width: 300,
      height: 50,
      x: e.x,
      y: e.y,
      left: e.x,
      top: e.y,
    } as DOMRect;

    if (e.key === "Backspace" && this.isFloatieActive) {
      // todo: delete button? No
      this.query = this.query.slice(0, this.query.length - 1);
      this.maybeUpdateSuggestion(e);
      // todo: If context no longer contains :, clear query
    } else if (e.key in ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
      // Handle arrow keys (change selected emoji)? FYI: User might be navigating the input field.
    } else if (e.key == "Tab") {
    } else if (e.key === "Enter") {
      // also character
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
    this.matchingEmojis = this.searchEmojis(this.query, context, emojiHistory);

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

  searchEmojis(query: string, context: string, recentEmojis) {
    // TODO: Filter recentEmojis and emoji bank for context.
    // search for each word in emojiList
    const results = emojiList.filter((emoji) =>
      emoji.alternatesStr.includes(query)
    );
    return results;
  }
}
