
export type SpeakerType = 'sarah' | 'rex' | 'rob' | 'clau24' | 'leo' | 'mia' | 'tommy' | 'luna' | 'trollzor' | 'you';

export interface Choice {
  kind: 'prosocial' | 'mild' | 'negative';
  text: string;
  attributes: string[];
  toxic: boolean;
  severity: string;
  likes: number;
  target: string;
  feelings: {
    who: string;
    text: string;
  };
}

export interface Exchange {
  speaker: string;
  who: SpeakerType;
  line: string;
  post: {
    attributes: string[];
    toxic: boolean;
    severity?: string;
    target?: string;
  };
  prosocial: Choice;
  mild: Choice;
  negative: Choice;
}

export interface Scenario {
  id: number;
  title: string;
  exchangePool: Exchange[];
}

export interface TranscriptEntry {
  scenario: string;
  scenarioId: number;
  exchange: number;
  user: string;
  comment: string;
  direction: 'Post' | 'Reply';
  attributes: string[];
  toxic: boolean;
  severity: string | null;
  likes?: number;
  target: string | null;
  feeling: string | null;
  mappedAttrs?: string[];
}

export interface PlayerMetrics {
  rows: TranscriptEntry[];
  counts: Record<string, number>;
  totalTagged: number;
  negativeRows: TranscriptEntry[];
  totalLikes: number;
  maxPossibleLikes: number;
}

export interface BehavioralAnalysis {
  kindnessScore: number;
  positiveCount: number;
  mildNegativeCount: number;
  severeNegativeCount: number;
  totalComments: number;
  totalScore: number;
  prosocialComments: number;
  negativeComments: number;
  topNegative: string[];
  topStrengths: string[];
  needsWork: boolean;
}

export interface StrategyItem {
  id: string;
  label: string;
  tip: string;
  type: 'good' | 'bad';
  emoji: string;
}
