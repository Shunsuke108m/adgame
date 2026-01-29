import { useState, useCallback } from "react";
import type { GameRow } from "../../../types/GameRow";
import {ActionButtons} from "../../features/ActionButtons";
import { GameTable } from "../../features/GameTable";
import { GameDescriptions } from "../../features/GameDescriptions";
import { Modal } from "../../common/Modal";
import styled from "styled-components";

const initialRow: GameRow = {
  week: "1週目",
  cost: "¥5,000,000",
  cpm: "¥5,000",
  imp: "1,000,000",
  ctr: "0.32%",
  cvr: "2.25%",
  cv: "72CV",
  cpa: "¥69,444"
};

const parseNum = (str: string) => parseFloat(str.replace(/[^\d.]/g, ""));

export const GamePage: React.FC = () => {
    const [rows, setRows] = useState<GameRow[]>([initialRow]);
      const [active, setActive] = useState<string[]>([]);
    
      const handleToggle = (id: string) => {
        setActive((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
      };
    
      const handleExecute = useCallback(() => {
        const prev = rows[0];
        let week = (parseInt(prev.week.replace("週目", "")) + 1) + "週目";
        let cost = parseNum(prev.cost);
        let cpm = parseNum(prev.cpm);
        let ctr = parseNum(prev.ctr);
        let cvr = parseNum(prev.cvr);
    
        if (active.includes("CPNBtn")) {
          cpm = cpm >= 6000
            ? cpm * ((Math.random() * 0.3) + 0.5)
            : cpm >= 3000
            ? cpm * ((Math.random() * 0.75) + 0.5)
            : cpm >= 2000
            ? cpm * ((Math.random() * 0.75) + 0.75)
            : cpm * ((Math.random() * 1.0) + 1.0);
        }
        if (active.includes("CRBtn")) {
          ctr = ctr >= 1.2
            ? ctr * ((Math.random() * 0.75) + 0.5)
            : ctr >= 0.6
            ? ctr * ((Math.random() * 0.75) + 0.75)
            : ctr * ((Math.random() * 1.0) + 1.0);
        }
        if (active.includes("LPBtn")) {
          cvr = cvr >= 3
            ? cvr * ((Math.random() * 0.75) + 0.5)
            : cvr >= 1.5
            ? cvr * ((Math.random() * 0.75) + 0.75)
            : cvr * ((Math.random() * 1.0) + 1.0);
        }
        if (active.includes("increaseBtn")) {
          cost = cost * 1.2;
          ctr = ctr * ((Math.random() * 0.25) + 0.75);
          cvr = cvr * ((Math.random() * 0.25) + 0.75);
          cpm = cpm * ((Math.random() * 0.25) + 1.0);
        }
    
        const imp = Math.round(cost / cpm * 1000);
        const cv = Math.round(imp * ctr * cvr * 0.0001);
        const cpa = cv > 0 ? Math.round(cost / cv) : 0;
    
        setRows([
          {
            week,
            cost: "¥" + Math.round(cost).toLocaleString(),
            cpm: "¥" + Math.round(cpm).toLocaleString(),
            imp: imp.toLocaleString(),
            ctr: ctr.toFixed(2) + "%",
            cvr: cvr.toFixed(2) + "%",
            cv: cv + "CV",
            cpa: "¥" + cpa.toLocaleString()
          },
          ...rows
        ]);
        setActive([]);
      }, [rows, active]);
    
    
  return (
    <Root>
      <Title>CV数を増やせ！広告運用ゲーム</Title>
      <Modal />
      <GameDescriptions />
      <GameTable rows={rows} />
      <ActionButtons
        active={active}
        onToggle={handleToggle}
        onExecute={handleExecute}
      />
    </Root>
  );
};

const Root = styled.div`
  padding: 8px;
  margin: 0;
  `;

const Title = styled.h1`
  margin: 0;
  line-height: 1;
  margin-bottom: 4px;
`