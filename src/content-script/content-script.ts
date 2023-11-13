import "./previewr";
import "./iframe-helper";
import "./content-script.css";
import { Logger } from "../utils/logger";

// This is necessary for listening to logs from popup and bg.
const L = new Logger("content-script");

// Listen for ":" keydown
// Show a floaty with suggestions based on last three keywords (minus articles)
// If nothing has been typed yet, show continue type for emoji suggestions.
// As the user types, filter the suggestions, prioritizing their keyword matches

let isFloatieActive = false;

const updateSuggestions = (e) => {
  const input = e.target;
  const caretPos = input.selectionStart;
  const context = input.value.slice(0, caretPos);
  const colonIndex = context.indexOf(":");
  const pretext = context.slice(0, colonIndex);
  const query = context.slice(colonIndex + 1, caretPos);

  if (colonIndex === -1) {
    // the caret is behind the trigger, return no suggestion
    L.log("No suggestions: out of context");
    return;
  }
  if (context.length > 0) {
  }
};

const maybeActivateFloatie = (e) => {
  isFloatieActive = true;
  L.log("floatie activated", e);
};

const maybeUpdateSuggestions = (e) => {
  if (isFloatieActive) {
    L.log("suggestions updated", e);
  }
};

const maybeCloseFloatie = (e) => {
  if (isFloatieActive) {
    isFloatieActive = false;
    L.log("floatie deactivated", e);
  }
};

// Listen for all keydown events and scan for input types.
// Listening for changes on input elements has the drawback
// that we have to keep checking the DOM for newly added inputs.
window.addEventListener("load", (unused) => {
  window.addEventListener("keypress", (event) => {
    if (
      event.target?.nodeName !== "INPUT" &&
      event.target?.nodeName !== "TEXTAREA"
    ) {
      L.debug("Ignoring event:", event);
      // todo: maybe close floatie.
      return;
    }

    // Do not show for non-text fields e.g. passwords or email.
    // HTML input types - https://www.w3schools.com/html/html_form_input_types.asp
    if (event.target?.type !== "text" && event.target?.type !== "textarea") {
      L.debug("Ignoring event:", event);
      return;
    }

    if (event.key === ":") {
      maybeActivateFloatie(event);
      return;
    }

    if (event.key === " ") {
      maybeCloseFloatie(event);
      return;
    }
    maybeUpdateSuggestions(event);
  });
});
