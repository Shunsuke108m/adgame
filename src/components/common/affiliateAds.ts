export type AffiliateAd = {
  adName: string;
  adUrl: string;
  redirect: string;
  impressionSrc?: string;
};

/**
 * アフィリエイト広告の定義をここに集約する。
 * 画像・遷移先URLの差し替えはこの配列のみ編集すれば全スロットに反映される。
 */
export const AFFILIATE_ADS: AffiliateAd[] = [
  {
    adName: "a8_sample_01",
    adUrl: "https://www21.a8.net/svt/bgt?aid=260208731542&wid=003&eno=01&mid=s00000027239001003000&mc=1",
    redirect: "https://px.a8.net/svt/ejp?a8mat=4AX6CB+8YP076+5U6E+5YZ75",
    impressionSrc: "https://www17.a8.net/0.gif?a8mat=4AX6CB+8YP076+5U6E+5YZ75",
  }
];
