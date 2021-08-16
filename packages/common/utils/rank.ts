import { buildLexoRank, NumeralSystem64 } from "@wewatch/lexorank";
import { customAlphabet } from "nanoid";

export class LexoRank extends buildLexoRank({
  NumeralSystem: NumeralSystem64,
  maxOrder: 8,
  initialMinDecimal: "1000000",
  defaultGap: "1000000",
}) {}

export const generateRankSuffix = customAlphabet(
  LexoRank.config.numeralSystem.CHARS.join(""),
  5,
);
