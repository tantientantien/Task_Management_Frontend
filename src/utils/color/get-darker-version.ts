import tinycolor from "tinycolor2";

export const getDarkerVersion = (hex: string, percent = 20) => {
  return tinycolor(hex).darken(percent).toHexString();
};
