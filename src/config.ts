import { Config, MenuItem } from "./extension";

export const packageName = "emoji-keyboard";
export const applicationId =
  packageName + "/" + chrome?.i18n?.getMessage("@@extension_id");
export const sentryDsn =
  "https://b1d81a9e5f1546f79885a473ce33128c@o526305.ingest.sentry.io/6244539";
export const measurementId = "G-JWLV6CJVSJ";
export const gaApiSecret = "E2EWHH--QbSaf9-f0ePC5g";
export const uninstallUrl = "https://forms.gle/8e94ypTgY3ZQiR948";
export const configOptions: Config[] = [
  {
    id: "hide-recents",
    type: "switch",
    title: "Hide Recents",
    description: "Do not show the most recently used emojis upon invocation.",
    default_value: false,
  },
  {
    id: "hide-suggestions",
    type: "switch",
    title: "Hide Suggestions",
    description:
      "Do not show suggestions based on prior input upon invocation.",
    default_value: false,
  },
  {
    id: "emoji-columns",
    type: "range",
    title: "Emojis per row",
    description: "The number of emojis to show per row.",
    default_value: 10,
    min: "6",
    max: "15",
    step: "1",
  },
  {
    id: "emoji-rows",
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

export const contextMenus: MenuItem[] = [];
