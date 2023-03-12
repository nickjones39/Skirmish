import * as ROT from 'rot-js';
import kaboom from "kaboom"
import "kaboom/global"
import { Entity } from './entity';
import { Engine } from './engine';

declare global {
  interface Window {
    engine: Engine;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const npc = new Entity(
    Engine.WIDTH / 2 - 5,
    Engine.HEIGHT / 2,
    '@',
    '#ffff00',
  );
  const player = new Entity(Engine.WIDTH / 2, Engine.HEIGHT / 2, '@');
  const entities = [npc, player];
  window.engine = new Engine(entities, player);
});




kaboom({
    font: 'sinko',
    scale: 3,
  })
  
  loadSpriteAtlas('assets/HumansSpriteSheet.png', {
      'humansPikeman': {
          x: 32,
          y: 16,
          width: 320,
          height: 16,
          sliceX: 20,
          anims: {
              idle: { from: 0, to: 3, loop: true },
              walk: { from: 4, to: 7, loop: true },
              attack: { from: 8, to: 11 },
              hit: { from: 12, to: 15 },
              death: { from: 16, to: 20 },
          },
      },
  })
  
  scene('game', () => {

    var moveX: number
    var moveY: number
    var scale: number = 4;

    const npc = new Entity(
        Engine.WIDTH / 2 - 5,
        Engine.HEIGHT / 2,
        '@',
        '#ffff00',
      );
      const player = new Entity(Engine.WIDTH / 2, Engine.HEIGHT / 2, '@');
      const entities = [npc, player];
      var e = new Engine(entities, player);
        
      const pikeman = add([
          sprite('humansPikeman'),
          pos(e.player.x * 4, e.player.y * scale), 
          moveX = e.player.x,
          moveY = e.player.y 
      ])
  
      pikeman.play("idle")
      
      onUpdate(() => {
          //pikeman.play("idle")
          //if(moveX !== e.player.x) {
            pikeman.pos.x = e.player.x * scale
          //}
          //if(moveY !== e.player.y) {
            pikeman.pos.y = e.player.y * scale
          //}
          //moveX = e.player.x
          //moveY = e.player.y
      });
  
      onClick(() => addKaboom(mousePos()))

      
    
  });
  
  
  go('game')