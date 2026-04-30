import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';
import { GameEvents, type LevelResultPayload, SceneKeys } from '../types/game';

interface UISceneData {
  levelId: number;
  timer: number;
  maxLineLength: number;
}

export class UIScene extends Phaser.Scene {
  private levelId = 1;
  private timerText?: Phaser.GameObjects.Text;
  private lineText?: Phaser.GameObjects.Text;
  private messageText?: Phaser.GameObjects.Text;
  private overlay?: Phaser.GameObjects.Container;

  constructor() {
    super(SceneKeys.UI);
  }

  init(data: UISceneData): void {
    this.levelId = data.levelId;
  }

  create(): void {
    this.timerText = this.addHudText(44, 40, 'Time 0.0');
    this.lineText = this.addHudText(GAME_WIDTH - 44, 40, 'Line 0').setOrigin(1, 0);
    this.messageText = this.add.text(GAME_WIDTH / 2, 112, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '26px',
      color: '#5c432d',
      align: 'center'
    }).setOrigin(0.5, 0);

    this.add.text(GAME_WIDTH / 2, 40, `Level ${this.levelId}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      color: '#3a2b1f',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.game.events.on(GameEvents.LevelTimer, this.updateTimer, this);
    this.game.events.on(GameEvents.LineLength, this.updateLineLength, this);
    this.game.events.on(GameEvents.LevelMessage, this.updateMessage, this);
    this.game.events.on(GameEvents.LevelResult, this.showResult, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  private addHudText(x: number, y: number, text: string): Phaser.GameObjects.Text {
    return this.add.text(x, y, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#3a2b1f',
      fontStyle: 'bold'
    }).setDepth(20);
  }

  private updateTimer(seconds: number): void {
    this.timerText?.setText(`Time ${seconds.toFixed(1)}`);
  }

  private updateLineLength(remaining: number): void {
    this.lineText?.setText(`Line ${Math.ceil(remaining)}`);
  }

  private updateMessage(message: string): void {
    this.messageText?.setText(message);
  }

  private showResult(payload: LevelResultPayload): void {
    this.overlay?.destroy();

    const backing = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 500, 390, 0xffffff, 0.96)
      .setStrokeStyle(5, 0x3a2b1f);
    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 130, payload.result === 'win' ? 'Success' : 'Try Again', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '48px',
      color: '#3a2b1f',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    const message = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 58, payload.message, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#604a34'
    }).setOrigin(0.5);

    const retry = this.createButton(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 38, 'Retry', () => {
      this.scene.stop(SceneKeys.UI);
      this.scene.start(SceneKeys.Level, { levelId: payload.levelId });
    });
    const next = payload.result === 'win'
      ? this.createButton(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 142, 'Next', () => {
          this.scene.stop(SceneKeys.UI);
          this.scene.start(SceneKeys.Level, { levelId: payload.nextLevelId });
        })
      : undefined;

    this.overlay = this.add
      .container(0, 0, [backing, title, message, retry, ...(next ? [next] : [])])
      .setDepth(50);
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): Phaser.GameObjects.Container {
    const rect = this.add
      .rectangle(x, y, 260, 76, 0xf9cf5d)
      .setStrokeStyle(4, 0x3a2b1f)
      .setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      color: '#3a2b1f',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    rect.on('pointerdown', onClick);
    return this.add.container(0, 0, [rect, text]);
  }

  private shutdown(): void {
    this.game.events.off(GameEvents.LevelTimer, this.updateTimer, this);
    this.game.events.off(GameEvents.LineLength, this.updateLineLength, this);
    this.game.events.off(GameEvents.LevelMessage, this.updateMessage, this);
    this.game.events.off(GameEvents.LevelResult, this.showResult, this);
  }
}
