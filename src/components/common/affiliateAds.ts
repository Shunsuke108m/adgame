export type AffiliateAd = {
  adName: string;
  adImageUrl: string;
  redirect: string;
  impressionSrc?: string;
};

/**
 * アフィリエイト広告の定義をここに集約する。
 * 画像・遷移先URLの差し替えはこの配列のみ編集すれば全スロットに反映される。
 */
export const AFFILIATE_ADS: AffiliateAd[] = [
  {
    adName: "a8_rocketnow_official_bonus60000",
    adImageUrl: "https://www21.a8.net/svt/bgt?aid=260208731542&wid=003&eno=01&mid=s00000027239001003000&mc=1",
    redirect: "https://px.a8.net/svt/ejp?a8mat=4AX6CB+8YP076+5U6E+5YZ75",
  },
  {
    adName: "a8_rocketnow_official_shiftBoshu",
    adImageUrl: "https://www21.a8.net/svt/bgt?aid=260208731542&wid=003&eno=01&mid=s00000027239001006000&mc=1",
    redirect: "https://px.a8.net/svt/ejp?a8mat=4AX6CB+8YP076+5U6E+5ZMCH",
  },
  {
    adName: "a8_rocketnow_original_docchide",
    adImageUrl: "/ads/rocketnow/a8_rocketnow_original_docchide.png",
    redirect: "https://px.a8.net/svt/ejp?a8mat=4AX6CB+8YP076+5U6E+5YZ75",
  },
  {
    adName: "a8_rocketnow_original_okaneMoraiNagara",
    adImageUrl: "/ads/rocketnow/a8_rocketnow_original_okanemorainagara.png",
    redirect: "https://px.a8.net/svt/ejp?a8mat=4AX6CB+8YP076+5U6E+5YZ75",
  },
  {
    adName: "a8_rocketnow_original_12kilofutotta",
    adImageUrl: "/ads/rocketnow/a8_rocketnow_original_12kilofutotta.png",
    redirect: "https://px.a8.net/svt/ejp?a8mat=4AX6CB+8YP076+5U6E+5YZ75",
  },
  {
    adName: "a8_techgo_official_138man",
    adImageUrl: "https://www28.a8.net/svt/bgt?aid=260208731468&wid=003&eno=01&mid=s00000024757003003000&mc=1",
    redirect: "https://px.a8.net/svt/ejp?a8mat=4AX6CB+7QMXFM+5B0Y+HVNAP",
  },
  {
    adName: "a8_techgo_original_sorosoro",
    adImageUrl: "/ads/techgo/a8_techgo_original_sorosoro.png",
    redirect: "https://px.a8.net/svt/ejp?a8mat=4AX6CB+7QMXFM+5B0Y+HVNAP",
  },
  {
    adName: "a8_techgo_original_sijokachi",
    adImageUrl: "/ads/techgo/a8_techgo_original_sijokachi.png",
    redirect: "https://px.a8.net/svt/ejp?a8mat=4AX6CB+7QMXFM+5B0Y+HVNAP",
  },
];
