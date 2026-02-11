import React, { useMemo } from "react";
import styled from "styled-components";
import { AFFILIATE_ADS } from "./affiliateAds";
import { Colors } from "~/styles/colors";

export const AffiliateAdSlot: React.FC = () => {
  const ad = useMemo(() => {
    if (AFFILIATE_ADS.length === 0) return null;
    const idx = Math.floor(Math.random() * AFFILIATE_ADS.length);
    return AFFILIATE_ADS[idx];
  }, []);

  if (!ad) return null;

  return (
    <Wrapper>
      <AdLink
        href={ad.href}
        target="_blank"
        rel="noopener noreferrer sponsored nofollow"
      >
        <AdImage src={ad.imageSrc} alt="" loading="lazy" />
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
  aspect-ratio: 6 / 5;
  object-fit: cover;
`;

const ImpressionPixel = styled.img`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;
