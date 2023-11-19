import { Logger } from "../utils/logger";
import Storage from "../utils/storage";
import { CLICKED_EMOJIS } from "../utils/storage-keys";

export class Floatie {
  query = "";
  isFloatieActive = false;
  logger = new Logger("Floatie");

  renderer = (msg) => {
    // Anyone can override this handler.
    this.logger.debug(msg);
    window.postMessage(msg);
  };

  // Listen for all keypress events and scan for input types.
  // Listening for changes on input elements has the drawback
  // that we have to keep checking the DOM for newly added inputs.
  keyListenerForEmoji = (event) => {
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
      this.maybeUpdateSuggestion(event);
    }
  };

  metaListenerForEmoji = (e) => {
    // TODO: Handle backspace character (remove last character from query)
    // Handle enter character (insert emoji)
    // Handle tab character (insert emoji)

    if (e.key === "Backspace") {
      // todo: delete button? No
      this.query = this.query.slice(0, this.query.length - 1);
      // todo: If context no longer contains :, clear query
    } else if (e.key in ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
      // Handle arrow keys (change selected emoji)? FYI: User might be navigating the input field.
    } else if (e.key == "Tab") {
    } else if (e.key === "Enter") {
      // also character
    }
  };

  async maybeActivateFloatie(e) {
    this.isFloatieActive = true;
    const context = e.target.value.slice(0, e.target.selectionStart).trim();
    const emojiHistory = await Storage.get(CLICKED_EMOJIS);

    // TODO: If there is no space prior, ignore.
    // Unless the prior character is an emoji :)
    // This is non-trivial - https://stackoverflow.com/a/39425959

    if (context.length === 0) {
      this.renderer({
        application: "emoji-keyboard",
        action: "render-emojis",
        data: {
          title: "Recents ⏰",
          emojis: emojiHistory,
        },
        point: e.target.getBoundingClientRect(),
      });
    } else {
      // Display suggestions based on context.
      const suggestedEmojis = this.suggestEmojis(context, emojiHistory);
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
    if (e.key === "Enter") {
      // maybe insert emoji
    } else {
      this.query += e.key;
    }

    const context = e.target.value.slice(0, e.target.selectionStart).trim();
    const emojiHistory = await Storage.get(CLICKED_EMOJIS);
    const matchingEmojis = this.searchEmojis(this.query, context, emojiHistory);

    if (this.isFloatieActive) {
      this.renderer({
        application: "emoji-keyboard",
        action: "render-emojis",
        data: {
          title: "Results 🔎",
          emojis: matchingEmojis,
        },
        point: e.target.getBoundingClientRect(),
      });
    }
  }

  maybeCloseFloatie(e) {
    if (this.isFloatieActive) {
      this.isFloatieActive = false;
      this.query = "";
      this.logger.log("floatie deactivated", e);
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
    return recentEmojis;
  }
}
