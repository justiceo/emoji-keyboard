import emojiList from "../standalone/emoji-list.json";

export class Searcher {
  search(query: string) {
    const results = emojiList.filter((emoji) =>
      emoji.alternatesStr.includes(query)
    );
    return results;
  }
}
