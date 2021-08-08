import { buildLexoRank, NumeralSystem64 } from "@wewatch/lexorank";

export class LexoRank extends buildLexoRank({
  NumeralSystem: NumeralSystem64,
  maxOrder: 8,
  initialMinDecimal: "1000000",
  defaultGap: "1000000",
}) {}
