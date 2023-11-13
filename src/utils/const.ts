import { i18n } from "./i18n";
import manifest from "../manifest.json";

export const APPLICATION_ID =
  manifest.__package_name + "/" + i18n("@@extension_id");
