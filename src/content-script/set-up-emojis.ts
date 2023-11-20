import emojiJson from "../standalone/emoji-list.json";
import Storage from "../utils/storage";
import { CLICKED_EMOJIS } from "../utils/storage-keys";

const collection: any[] = emojiJson.slice(0, 30);
Storage.put(CLICKED_EMOJIS, collection);
