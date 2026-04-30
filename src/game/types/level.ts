export interface LevelData {
  id: number;
  timer: number;
  maxLineLength: number;
  dog: {
    x: number;
    y: number;
  };
  beehives: HiveData[];
  platforms: PlatformData[];
  hazards?: HazardData[];
}

export interface HiveData {
  x: number;
  y: number;
  beeCount: number;
}

export interface PlatformData {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HazardData {
  type: 'spike' | 'lava' | 'bomb' | 'water';
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export interface DrawPoint {
  x: number;
  y: number;
}

export interface BarrierSegment {
  x: number;
  y: number;
  length: number;
  angle: number;
  thickness: number;
}
