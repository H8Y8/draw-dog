import Phaser from 'phaser';
import { SceneKeys } from '../types/game';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  create(): void {
    this.registry.set('audioEnabled', true);
    this.scene.start(SceneKeys.Menu);
  }
}
