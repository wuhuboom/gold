import en from "./en.json";
// import eg from "./eg.json";
import zh from "./zh.json";
import de from "./de.json";
import dz from "./dz.json";
import ind from "./in.json";
import fr from "./fr.json";
import deal from "./deal.json";
export default {
  en: { ...en, ...deal.en },
  zh: { ...zh, ...deal.zh },
  de: { ...de, ...deal.de },
  dz: { ...dz, ...deal.dz },
  ind: { ...ind, ...deal.in },
  fr: { ...fr, ...deal.fr },
};
