/**
 * 引数の文字列の前0を除去する
 * @param str 前0を除去する文字列
 */
export function zeroSuppress(str: string) {
  return str ? str.replace(/^0+/, "") : str;
}
