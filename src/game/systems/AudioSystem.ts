import Phaser from 'phaser';

export type AudioCue = 'draw-start' | 'draw-complete' | 'bee-bounce' | 'countdown' | 'win' | 'lose';

export class AudioSystem {
  constructor(private readonly scene: Phaser.Scene) {}

  isEnabled(): boolean {
    return this.scene.registry.get('audioEnabled') !== false;
  }

  setEnabled(enabled: boolean): void {
    this.scene.registry.set('audioEnabled', enabled);
  }

  play(cue: AudioCue): void {
    if (!this.isEnabled()) {
      return;
    }

    this.scene.events.emit('audio:cue', cue);
  }
}
