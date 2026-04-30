import Phaser from 'phaser';
import { AssetKeys } from '../config/assetKeys';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';
import { AudioSystem } from '../systems/AudioSystem';
import { LevelLoader } from '../systems/LevelLoader';
import { SceneKeys } from '../types/game';

export class MenuScene extends Phaser.Scene {
  private readonly levelLoader = new LevelLoader();
  private audioSystem?: AudioSystem;
  private audioLabel?: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.Menu);
  }

  create(): void {
    this.audioSystem = new AudioSystem(this);
    this.addBackground();

    this.add.text(GAME_WIDTH / 2, 260, 'Draw Dog', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '72px',
      color: '#3a2b1f',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 350, 'Draw one line. Protect the dog.', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      color: '#604a34'
    }).setOrigin(0.5);

    this.createButton(GAME_WIDTH / 2, 560, 'Start', () => {
      this.scene.start(SceneKeys.Level, { levelId: this.levelLoader.getFirstLevelId() });
    }, undefined, AssetKeys.UiStartButton);

    this.createButton(GAME_WIDTH / 2, 690, 'Sound: On', () => {
      const next = !this.audioSystem?.isEnabled();
      this.audioSystem?.setEnabled(next);
      this.audioLabel?.setText(`Sound: ${next ? 'On' : 'Off'}`);
    }, (label) => {
      this.audioLabel = label;
      label.setFontSize('30px');
    });
  }

  private addBackground(): void {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, AssetKeys.BackgroundMain)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(-10);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xffffff, 0.08)
      .setDepth(-9);
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    onTextCreated?: (label: Phaser.GameObjects.Text) => void,
    imageKey?: string
  ): void {
    const button = imageKey
      ? this.add.image(x, y, imageKey).setDisplaySize(300, 94)
      : this.add.rectangle(x, y, 300, 92, 0xffffff).setStrokeStyle(5, 0x3a2b1f);
    button.setInteractive({ useHandCursor: true });

    const label = this.add.text(x, y, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '34px',
      color: '#3a2b1f',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    button.on('pointerdown', onClick);
    onTextCreated?.(label);
  }
}
