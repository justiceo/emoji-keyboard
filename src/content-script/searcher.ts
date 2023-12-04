import Document from "flexsearch/src/document";
import Fuse from "fuse.js";
import emojiList from "../standalone/emoji-list.json";
import { Logger } from "../utils/logger";

export class Searcher {
  doc = new Document({
    preset: "score",
    tokenize: "full",
    charset: "latin:advanced",
    resolution: 9,
    cache: true,
    id: "emoji",
    index: ["alternates"],
    suggest: true,
  });
  fuse = new Fuse(emojiList, {
    keys: ["alternates"],
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    includeMatches: false,
    findAllMatches: false,
    minMatchCharLength: 1,
    location: 0,
    threshold: 0.3,
    distance: 20,
    useExtendedSearch: false,
    ignoreLocation: false,
    ignoreFieldNorm: true,
    fieldNormWeight: 1,
  });
  logger = new Logger(this);

  constructor() {
    emojiList.forEach((emoji) => {
      this.doc.add(emoji.emoji, emoji);
    });
  }

  search(query: string) {
    this.logger.debug("Searching for:", query);

    const resultIndices = this.doc.search(query, {
      limit: 100,
      suggest: true,
      index: ["alternates"],
      bool: "or",
    });
    if (resultIndices.length === 0) {
      // perform a fuzzy search instead.
      return this.fuzzySearch(query);
    }

    this.logger.debug("Search result indices:", resultIndices);
    const matchingEmojis = resultIndices[0].result.map((r) =>
      emojiList.find((e) => e.emoji === r)
    );

    this.logger.debug("Search results:", matchingEmojis);
    return matchingEmojis;
  }

  fuzzySearch(query: string) {
    this.logger.debug("Fuzzy searching for:", query);

    const result = this.fuse.search(query);
    if (result.length === 0) {
      // perform a strict search including ":" prefix
      return this.strictSearch(query);
    }
    this.logger.debug("Fuzzy search results:", result);

    const emojis = result.map((r) => r.item);
    this.logger.debug("Matching fuzzy emojis:", emojis);
    return emojis;
  }

  suggest(context: string) {
    const noSymbols = context.replace(/[^a-zA-Z0-9\s]/g, " ");
    const lastWord = noSymbols.trim().split(" ").pop() ?? "";

    if (lastWord.length < 2) {
      return [];
    }

    // TODO: consider popping until a word with length > 3 is found.

    const result = this.fuse.search(lastWord);
    if (result.length === 0) {
      return [];
    }
    this.logger.debug("Fuzzy search results:", result);

    const emojis = result.map((r) => r.item);
    this.logger.debug("Matching fuzzy emojis:", emojis);
    return emojis;
  }

  strictSearch(query: string) {
    this.logger.debug("Strict searching for:", query);
    return emojiList.filter(
      (emoji) =>
        emoji.alternates.includes(":" + query) ||
        emoji.alternates.includes(query)
    );
  }
}
