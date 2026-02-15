import React, { useMemo } from "react";
import styled from "styled-components";
import { AFFILIATE_ADS } from "./affiliateAds";
import { Colors } from "~/styles/colors";

const DEFAULT_CLICK_ENDPOINT = "https://ad-click.adgame-web.skikatte.com/r";
const CLICK_ENDPOINT =
  (import.meta.env.VITE_AD_CLICK_ENDPOINT as string | undefined)?.trim() ||
  DEFAULT_CLICK_ENDPOINT;

export const AffiliateAdSlot: React.FC = () => {
  const ad = useMemo(() => {
    if (AFFILIATE_ADS.length === 0) return null;
    const idx = Math.floor(Math.random() * AFFILIATE_ADS.length);
    return AFFILIATE_ADS[idx];
  }, []);

  if (!ad) return null;

  const clickHref = buildClickHref({
    endpoint: CLICK_ENDPOINT,
    adName: ad.adName,
    adUrl: ad.adImageUrl,
    redirect: ad.redirect,
    from: typeof window !== "undefined" ? window.location.href : "",
  });

  return (
    <Wrapper>
      <AdLink
        href={clickHref}
        target="_blank"
        rel="noopener noreferrer sponsored nofollow"
      >
        <AdImage src={ad.adImageUrl} alt="" loading="lazy" />
      </AdLink>
      {ad.impressionSrc && (
        <ImpressionPixel
          src={ad.impressionSrc}
          alt=""
          width={1}
          height={1}
          loading="eager"
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  margin-top: 24px;
  width: 300px;
  max-width: 100%;
`;

const AdLink = styled.a`
  display: block;
  width: 100%;
  border: 1px solid ${Colors.Border};
  border-radius: 8px;
  overflow: hidden;
  background: ${Colors.BackgroundWhite};
`;

const AdImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

const ImpressionPixel = styled.img`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

function buildClickHref(input: {
  endpoint: string;
  adName: string;
  adUrl: string;
  redirect: string;
  from: string;
}): string {
  const url = new URL(input.endpoint);
  url.searchParams.set("adName", input.adName);
  url.searchParams.set("adUrl", input.adUrl);
  url.searchParams.set("redirect", input.redirect);
  url.searchParams.set("from", input.from);
  return url.toString();
}
