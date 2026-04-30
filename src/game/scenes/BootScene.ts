import Phaser from 'phaser';
import { AssetKeys } from '../config/assetKeys';
import { SceneKeys } from '../types/game';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  preload(): void {
    this.load.image(AssetKeys.DogIdle, '/assets/images/dog-idle.jpg');
    this.load.image(AssetKeys.DogScared, '/assets/images/dog-scared.jpg');
    this.load.image(AssetKeys.DogHappy, '/assets/images/dog-happy.jpg');
    this.load.image(AssetKeys.Bee, '/assets/images/bee-01.jpg');
    this.load.image(AssetKeys.Hive, '/assets/images/hive-01.jpg');
    this.load.image(AssetKeys.PlatformShort, '/assets/images/platform-short.jpg');
    this.load.image(AssetKeys.PlatformLong, '/assets/images/platform-long.jpg');
    this.load.image(AssetKeys.UiStartButton, '/assets/images/ui-start-button.jpg');
    this.load.image(AssetKeys.UiReplayButton, '/assets/images/ui-replay-button.jpg');
    this.load.image(AssetKeys.UiNextButton, '/assets/images/ui-next-button.jpg');
    this.load.image(AssetKeys.UiResultPanel, '/assets/images/ui-result-panel.jpg');
  }

  create(): void {
    this.registry.set('audioEnabled', true);
    this.scene.start(SceneKeys.Menu);
  }
}
