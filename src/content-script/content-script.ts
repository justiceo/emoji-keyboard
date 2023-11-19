import "./iframe-helper";
import "./content-script.css";
import { Logger } from "../utils/logger";
import { WinboxRenderer } from "./winbox-renderer";
import manifest from "../manifest.json";

// Listen for ":" keydown
// Show a floaty with suggestions based on last three keywords (minus articles)
// If nothing has been typed yet, show continue type for emoji suggestions.
// As the user types, filter the suggestions, prioritizing their keyword matches
class ContentScript {
  logger = new Logger(this);
  winboxRenderer = new WinboxRenderer();
  isFloatieActive = false;
  query = "";

  init() {
    if (this.inApplicationIframe()) {
    } else if (this.inAnyIframe()) {
      // todo: run iframe helper
    } else {
      // Add event listeners for main window.
      window.addEventListener("message", this.onMessageHandler, false);
      document.onkeydown = this.winboxRenderer.onEscHandler;
      document.onscroll = this.winboxRenderer.onEscHandler;
      document.onresize = this.winboxRenderer.onEscHandler;

      window.addEventListener("keypress", this.emojiTriggerScanner);
    }
  }

  // Listen for all keydown events and scan for input types.
  // Listening for changes on input elements has the drawback
  // that we have to keep checking the DOM for newly added inputs.
  emojiTriggerScanner = (event) => {
    if (
      event.target?.nodeName !== "INPUT" &&
      event.target?.nodeName !== "TEXTAREA"
    ) {
      this.logger.debug("Ignoring event:", event);
      // todo: maybe close floatie.
      return;
    }

    // Do not show for non-text fields e.g. passwords or email.
    // HTML input types - https://www.w3schools.com/html/html_form_input_types.asp
    if (event.target?.type !== "text" && event.target?.type !== "textarea") {
      this.logger.debug("Ignoring event:", event);
      return;
    }

    if (event.key === ":") {
      this.maybeActivateFloatie(event);
      return;
    }

    if (event.key === " ") {
      this.maybeCloseFloatie(event);
      return;
    }
    this.maybeUpdateSuggestions(event);
  };

  maybeActivateFloatie = (e) => {
    this.isFloatieActive = true;
    window.postMessage({
      application: "emoji-keyboard",
      action: "emoji-search",
      data: "",
      point: e.target.getBoundingClientRect(),
    });
  };

  maybeUpdateSuggestions = (e) => {
    this.query += e.key;
    if (this.isFloatieActive) {
      this.logger.log("suggestions updated", e);
      window.postMessage({
        application: "emoji-keyboard",
        action: "emoji-search",
        data: this.query,
        point: e.target.getBoundingClientRect(),
      });
    }
  };

  maybeCloseFloatie = (e) => {
    if (this.isFloatieActive) {
      this.isFloatieActive = false;
      this.query = "";
      this.logger.log("floatie deactivated", e);
    }
  };

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
      this.logger.debug(
        "Ignoring origin messsage not initiated by emoji-keyboard",
      );
      return;
    }

    this.winboxRenderer.handleMessage(event.data);
  };

  /*
   * Returns true if this script is running inside an iframe,
   * since the content script is added to all frames.
   */
  inAnyIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  inApplicationIframe() {
    try {
      return window.name === manifest.__package_name + "/mainframe";
    } catch (e) {
      return false;
    }
  }
}
new ContentScript().init();
