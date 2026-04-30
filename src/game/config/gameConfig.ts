import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { LevelScene } from '../scenes/LevelScene';
import { MenuScene } from '../scenes/MenuScene';
import { UIScene } from '../scenes/UIScene';

export const GAME_WIDTH = 720;
export const GAME_HEIGHT = 1280;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#f6d98b',
  scene: [BootScene, MenuScene, LevelScene, UIScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
      enableSleeping: false,
      debug: false
    }
  },
  input: {
    activePointers: 2
  }
};
