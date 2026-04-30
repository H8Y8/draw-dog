export const SceneKeys = {
  Boot: 'BootScene',
  Menu: 'MenuScene',
  Level: 'LevelScene',
  UI: 'UIScene'
} as const;

export const GameEvents = {
  LevelTimer: 'level:timer',
  LineLength: 'line:length',
  LevelResult: 'level:result',
  LevelMessage: 'level:message'
} as const;

export type LevelResult = 'win' | 'lose';

export interface LevelSceneData {
  levelId?: number;
}

export interface LevelResultPayload {
  result: LevelResult;
  levelId: number;
  nextLevelId: number;
  message: string;
}
