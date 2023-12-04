import Document from "flexsearch/src/document";
import emojiList from "../standalone/emoji-list.json";
import { Logger } from "../utils/logger";

export class Searcher {
  doc = new Document({
    preset: "score",
    tokenize: "full",
    charset: "latin:advanced",
    cache: true,
    id: "emoji",
    index: ["alternates"],
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
      return [];
    }

    const matchingEmojis = resultIndices[0].result.map((r) =>
      emojiList.find((e) => e.emoji === r)
    );

    this.logger.debug("Search results:", matchingEmojis);
    return matchingEmojis;
  }
}
