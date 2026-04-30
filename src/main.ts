import Phaser from 'phaser';
import { gameConfig } from './game/config/gameConfig';
import './style.css';

declare global {
  interface Window {
    __DRAW_DOG_GAME__?: Phaser.Game;
    __DRAW_DOG_RESULT__?: unknown;
  }
}

const game = new Phaser.Game(gameConfig);
window.__DRAW_DOG_GAME__ = game;
