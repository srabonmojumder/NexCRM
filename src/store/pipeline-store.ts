import { create } from "zustand";
import { deals as initialDeals } from "@/data/mock";
import type { Deal, DealStage } from "@/types";

interface PipelineState {
  deals: Deal[];
  moveDeal: (dealId: string, stage: DealStage) => void;
  addDeal: (deal: Deal) => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
  deals: initialDeals,
  moveDeal: (dealId, stage) =>
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === dealId ? { ...d, stage, probability: stage === "won" ? 100 : stage === "lost" ? 0 : d.probability } : d
      ),
    })),
  addDeal: (deal) => set((state) => ({ deals: [deal, ...state.deals] })),
}));
