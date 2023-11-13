import enUsEmoji from "../assets/emoji-en-US.json";
import "./emoji.css";
import { Logger } from "../utils/logger";

class Emoji {
  logger = new Logger(this);
  container = document.querySelector(".emojis-container")!;
  filter = document.querySelector(".speedy-filter") as HTMLInputElement;

  registerListeners() {
    // Add emojis to container.
    let markup;
    for (const emoji in enUsEmoji) {
      markup += `<li class="result emoji-wrapper js-emoji" title="${enUsEmoji[emoji]}">
      <div class="js-emoji-char native-emoji" data-emoji="${emoji}" >${emoji}</div></li>`;
    }
    this.container.innerHTML = markup;

    document.querySelector(".loading")?.remove();
    this.searchHash();

    // TODO: Replace document with #querySelectorAll.
    document.addEventListener("click", this.emojiClickHandler);
    document.addEventListener("click", this.emojiCategoryClickHandler);

    this.filter.addEventListener("input", this.updateHashWithInputValue);
    window.addEventListener("hashchange", this.onHashChangeHandler);
  }

  emojiClickHandler = (evt: MouseEvent) => {
    const emoji = evt.target?.closest(".js-emoji");
    if (!emoji) {
      this.logger.debug("No emoji found");
      return;
    }
    getSelection()?.removeAllRanges();
    var range = document.createRange();
    const node = emoji.querySelector(".js-emoji-char");
    range.selectNodeContents(node);
    getSelection()?.addRange(range);
    document.execCommand("copy");
    this.alertCopied(node.getAttribute("data-emoji"));
  };

  emojiCategoryClickHandler = (event: MouseEvent) => {
    if (event.target?.classList.contains("group")) {
      this.filter.value = event.target.href.substr(1);
      this.search(this.filter.value);
    } else if (event.target?.classList.contains("js-clear-search")) {
      this.filter.value = "";
    }
  };

  onHashChangeHandler = () => {
    this.searchHash();
    for (const link of document.querySelectorAll('.active[href^="#"]')) {
      link.classList.remove("active");
    }
    var active = document.querySelector("[href='#{window.location.hash}']");
    if (active) active.classList.add("active");
  };

  updateHashWithInputValue = () => {
    window.location.hash = this.filter.value.replace(" ", "_");
  };

  alertCopied(emoji) {
    var alert = document.createElement("div");
    alert.classList.add("alert");
    alert.textContent = `Copied ${emoji}`;
    document.body.append(alert);
    setTimeout(function () {
      alert.remove();
    }, 1000);
  }

  searchHash = () => {
    if (window.location.hash.length) {
      this.filter.value = window.location.hash.substr(1);
      this.search(this.filter.value);
    } else {
      this.search();
    }
  };
  search = (keyword?) => {
    keyword = typeof keyword === "undefined" ? "" : keyword;
    document.querySelector(".keyword").textContent = keyword;
    keyword = keyword.trim();

    if (window.speedyKeyword !== keyword) {
      window.speedyKeyword = keyword;
      for (const result of document.querySelectorAll(".result")) {
        result.hidden =
          keyword.length > 0
            ? result
                .getAttribute("title")
                .toLowerCase()
                .indexOf(keyword.toLowerCase()) < 0
            : false;
      }
    }
    this.setRelatedDOMVisibility(keyword);
  };

  setRelatedDOMVisibility = (keyword?) => {
    var foundSomething = !!document.querySelector(".result:not([hidden])");
    document.querySelector(".no-results").hidden = foundSomething;
  };
}
new Emoji().registerListeners();
