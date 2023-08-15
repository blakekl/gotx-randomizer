import { createContext } from "react";
import RandomizerStore from "./RandomizerStore";

export default createContext({
  randomizerStore: new RandomizerStore(),
});
