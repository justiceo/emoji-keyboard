import "./post-install";
import "./context-menus";
import "./icon-updater";
import "./post-install";
import "./context-menus";
import "./icon-updater";
import "./feedback-checker";
import { getOrCreateSessionId } from "../utils/session-id";
import { RemoteLogger } from "../utils/logger";

const logger = new RemoteLogger("service-worker");
// All service-worker messages should go through this function.
const onMessage = (
  message: any,
  sender: chrome.runtime.MessageSender,
  callback: (response?: any) => void
) => {
  // Check if the message is from this extension.
  if (!sender.id || sender.id !== chrome.i18n.getMessage("@@extension_id")) {
    logger.debug("Ignoring message from unknown sender", sender);
    return;
  }
  logger.debug("Received message: ", message, " from: ", sender);

  if (message === "get_or_create_session_id") {
    getOrCreateSessionId().then((sessionId) => {
      logger.log("Sending session Id", sessionId);
      callback(sessionId);
    });
    return true; // Important! Return true to indicate you want to send a response asynchronously
  }

  if (message === "open_options_page") {
    chrome.runtime.openOptionsPage();
    return;
  }

  // For now, bounce-back message to the content script.
  sendMessage(message, callback);
};
chrome.runtime.onMessage.addListener(onMessage);

function sendMessage(message, callback?) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length == 0) {
      logger.error("Unexpected state: No active tab");
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id!, message, (response) => {
      callback(response);
    });
  });
}
