import levelsJson from '../data/levels.json';
import type { LevelData } from '../types/level';

export class LevelLoader {
  private readonly levels = levelsJson as LevelData[];

  getLevel(levelId: number): LevelData {
    return this.levels.find((level) => level.id === levelId) ?? this.levels[0];
  }

  getFirstLevelId(): number {
    return this.levels[0]?.id ?? 1;
  }

  getNextLevelId(levelId: number): number {
    const currentIndex = this.levels.findIndex((level) => level.id === levelId);
    const next = this.levels[currentIndex + 1];
    return next?.id ?? this.getFirstLevelId();
  }
}
