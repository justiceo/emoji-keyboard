import "../content-script/content-script"; // To inject popup for dev mode.
import { Config, SettingsUI } from "../utils/settings/settings";
import "./options.css";


const configOptions: Config[] = [
  {
    id: "previewr-width",
    type: "range",
    title: "Preview Width (%)",
    description: "The width of the preview panel relative to the page.",
    default_value: 320,
    min: "160",
    max: "480",
    step: "32",
  },
  {
    id: "previewr-height",
    type: "range",
    title: "Emoji rows",
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
      window.location.origin,
    );
  });
});