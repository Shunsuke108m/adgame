import styled from "styled-components";
import { Colors } from "~/styles/colors";

export const Page = styled.div`
  padding: 24px 20px;
  max-width: 600px;
  margin: 0 auto;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LoadingText = styled.p`
  text-align: center;
  color: ${Colors.TextBlack};
  margin: 0;
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${Colors.TextBlack};
  margin: 0;
  padding: 48px 16px;
`;

export const Card = styled.article`
  position: relative;
  width: 100%;
  max-width: 520px;
  background: linear-gradient(
    135deg,
    #fafaf9 0%,
    ${Colors.BackgroundWhite} 50%,
    #f8f9fa 100%
  );
  border: 1px solid ${Colors.Border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.02);
`;

export const CardAccent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 5px;
  background: linear-gradient(180deg, ${Colors.Primary} 0%, #0d5a8f 100%);
`;

export const CardInnerVertical = styled.div`
  padding: 24px 20px;
  text-align: center;
`;

export const AdSlot = styled.div`
  margin-top: 24px;
  width: 300px;
  min-width: 300px;
  height: 250px;
  min-height: 250px;
  background: ${Colors.BackgroundGray};
  border: 1px dashed ${Colors.Border};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: ${Colors.TextBlack};
  opacity: 0.8;
`;

export const SavedToast = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  background: ${Colors.TextBlack};
  color: ${Colors.TextWhite};
  font-size: 0.875rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1002;
`;
