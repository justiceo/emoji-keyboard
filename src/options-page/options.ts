import "../content-script/content-script"; // To inject popup for dev mode.
import { Config, SettingsUI } from "../utils/settings/settings";
import "./options.css";
import "../utils/feedback/feedback";

const configOptions: Config[] = [
  {
    id: "hide-recents",
    type: "switch",
    title: "Hide Recents",
    description: "Do not show the most recently used emojis upon invocation.",
    default_value: false,
  },
  {
    id: "previewr-width",
    type: "range",
    title: "Emojis per row",
    description: "The number of emojis to show per row.",
    default_value: 10,
    min: "6",
    max: "15",
    step: "1",
  },
  {
    id: "previewr-height",
    type: "range",
    title: "Number of rows",
    description: "The number of emoji rows to show.",
    default_value: 1,
    min: "1",
    max: "4",
  },
  {
    id: "blocked-sites",
    type: "textarea",
    title: "Disabled on Websites",
    description:
      "Extension will not run on these sites. Enter one site per line.",
    default_value: "",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".options-container")
    ?.appendChild(new SettingsUI(configOptions));

  document.querySelector("#show-preview")?.addEventListener("click", () => {
    window.postMessage(
      { application: "emoji-keyboard", action: "render-emojis" },
      window.location.origin
    );
  });
});
