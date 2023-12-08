import { RemoteLogger } from "../utils/logger";
import Analytics from "../utils/analytics";
import Storage from "../utils/storage";
import { INSTALL_TIME_MS } from "../utils/storage";
import { uninstallUrl } from "../config";

const logger = new RemoteLogger("post-install");
const welcomeUrl = chrome.runtime.getURL("welcome/welcome.html");

const onInstalled = (details: chrome.runtime.InstalledDetails) => {
  // Set the installation time in storage.
  Storage.put(INSTALL_TIME_MS, Date.now());

  // On fresh install, open page how to use extension.
  if (details.reason === "install") {
    chrome.tabs.create({
      url: welcomeUrl,
      active: true,
    });
    Analytics.fireEvent("install", { reaason: details.reason });
  }

  // Set url to take users upon uninstall.
  chrome.runtime.setUninstallURL(uninstallUrl, () => {
    if (chrome.runtime.lastError) {
      logger.error("Error setting uninstall URL", chrome.runtime.lastError);
    }
  });

  // Check that all commands have shortcuts assigned.
  checkCommandShortcuts();
};
chrome.runtime.onInstalled.addListener(onInstalled);

// Only use this function during the initial install phase. After
// installation the user may have intentionally unassigned commands.
function checkCommandShortcuts() {
  chrome.commands.getAll((commands) => {
    let missingShortcuts: any[] = [];

    for (let { name, shortcut } of commands) {
      if (shortcut === "") {
        missingShortcuts.push(name);
      }
    }

    if (missingShortcuts.length > 0) {
      logger.warn("Missing shortcuts for commands:", missingShortcuts);

      Analytics.fireEvent("missing_command_shortcut", {
        data: missingShortcuts,
      });
    }
  });
}

// TODO: Implement requestUpdateCheck.
