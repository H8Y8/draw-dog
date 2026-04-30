import Phaser from 'phaser';

interface MatterCollisionEvent {
  pairs: Array<{
    bodyA: MatterJS.BodyType;
    bodyB: MatterJS.BodyType;
  }>;
}

export class CollisionSystem {
  constructor(
    private readonly scene: Phaser.Scene,
    private readonly onDogHit: () => void
  ) {
    scene.matter.world.on('collisionstart', this.handleCollisionStart, this);
  }

  destroy(): void {
    this.scene.matter.world.off('collisionstart', this.handleCollisionStart, this);
  }

  private handleCollisionStart(event: MatterCollisionEvent): void {
    for (const pair of event.pairs) {
      const labels = [pair.bodyA.label, pair.bodyB.label];
      if (labels.includes('dog') && labels.includes('bee')) {
        this.onDogHit();
        return;
      }
    }
  }
}
