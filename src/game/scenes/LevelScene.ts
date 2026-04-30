import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';
import { Dog } from '../objects/Dog';
import { DrawBarrier } from '../objects/DrawBarrier';
import { Platform } from '../objects/Platform';
import { AudioSystem } from '../systems/AudioSystem';
import { BeeSystem } from '../systems/BeeSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { InputLineSystem } from '../systems/InputLineSystem';
import { LevelLoader } from '../systems/LevelLoader';
import { GameEvents, type LevelSceneData, SceneKeys } from '../types/game';
import type { LevelData } from '../types/level';

export class LevelScene extends Phaser.Scene {
  private readonly levelLoader = new LevelLoader();
  private level!: LevelData;
  private dog?: Dog;
  private beeSystem?: BeeSystem;
  private inputLineSystem?: InputLineSystem;
  private collisionSystem?: CollisionSystem;
  private barrier?: DrawBarrier;
  private audioSystem?: AudioSystem;
  private platforms: Platform[] = [];
  private remainingSeconds = 0;
  private hasStarted = false;
  private isFinished = false;

  constructor() {
    super(SceneKeys.Level);
  }

  init(data: LevelSceneData): void {
    this.level = this.levelLoader.getLevel(data.levelId ?? this.levelLoader.getFirstLevelId());
    this.remainingSeconds = this.level.timer;
    this.hasStarted = false;
    this.isFinished = false;
  }

  create(): void {
    this.audioSystem = new AudioSystem(this);
    this.matter.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT, 32, true, true, true, true);
    this.matter.world.setGravity(0, 0);

    this.addBackground();
    this.createLevelObjects();

    this.scene.launch(SceneKeys.UI, {
      levelId: this.level.id,
      timer: this.level.timer,
      maxLineLength: this.level.maxLineLength
    });

    this.game.events.emit(GameEvents.LevelMessage, 'Draw a line to protect the dog.');
    this.game.events.emit(GameEvents.LevelTimer, this.remainingSeconds);
    this.game.events.emit(GameEvents.LineLength, this.level.maxLineLength);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  update(time: number, delta: number): void {
    this.beeSystem?.update(time, this.dog ?? { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });

    if (!this.hasStarted || this.isFinished) {
      return;
    }

    this.remainingSeconds = Math.max(0, this.remainingSeconds - delta / 1000);
    this.game.events.emit(GameEvents.LevelTimer, this.remainingSeconds);

    if (this.remainingSeconds <= 0) {
      this.finish('win');
    }
  }

  private addBackground(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xf8dda0);
    this.add.circle(92, 110, 70, 0xfff4c6, 0.65);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 88, GAME_WIDTH, 176, 0x8dcc78);
  }

  private createLevelObjects(): void {
    this.platforms = this.level.platforms.map((platform) => new Platform(this, platform));
    this.dog = new Dog(this, this.level.dog.x, this.level.dog.y);
    this.beeSystem = new BeeSystem(this, this.level.beehives);
    this.collisionSystem = new CollisionSystem(this, () => this.finish('lose'));
    this.inputLineSystem = new InputLineSystem(this, {
      dog: this.dog,
      maxLineLength: this.level.maxLineLength,
      onStart: () => this.audioSystem?.play('draw-start'),
      onComplete: (points) => {
        this.barrier = new DrawBarrier(this, points);
        this.hasStarted = true;
        this.beeSystem?.start();
        this.audioSystem?.play('draw-complete');
        this.game.events.emit(GameEvents.LevelMessage, 'Hold on.');
      }
    });
  }

  private finish(result: 'win' | 'lose'): void {
    if (this.isFinished) {
      return;
    }

    this.isFinished = true;
    this.hasStarted = false;
    this.dog?.setScared(result === 'lose');
    this.beeSystem?.stop();
    this.audioSystem?.play(result);
    this.game.events.emit(GameEvents.LevelResult, {
      result,
      levelId: this.level.id,
      nextLevelId: this.levelLoader.getNextLevelId(this.level.id),
      message: result === 'win' ? 'Saved!' : 'The dog got stung.'
    });
  }

  private shutdown(): void {
    this.inputLineSystem?.destroy();
    this.collisionSystem?.destroy();
    this.beeSystem?.destroy();
    this.barrier?.destroy(this);
    for (const platform of this.platforms) {
      this.matter.world.remove(platform.body);
      platform.destroy();
    }
    this.platforms = [];
    this.scene.stop(SceneKeys.UI);
  }
}
