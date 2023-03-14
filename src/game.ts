import kaboom from "kaboom"
import "kaboom/global"
import { FLOOR_TILE, WALL_TILE, Tile } from './tile-types';

import { Entity } from './entity';
import { Engine } from './engine';

declare global {
  interface Window {
    engine: Engine;
  }
}

const npc = new Entity(
  Engine.WIDTH, // - 5,
  Engine.HEIGHT, // 2,
  '@',
  '#ffff00',
);
const player = new Entity(Engine.WIDTH / 2, Engine.HEIGHT / 2, '@');
const entities = [npc, player];
const engine = new Engine(entities, player);

window.addEventListener('DOMContentLoaded', () => {
  
  window.engine = engine //new Engine(entities, player);

});


kaboom({
  width:1600,
  height:1200,
  font: 'sinko',
  scale: 2,
  background: [ 40, 40, 40, ],
})


loadSpriteAtlas('assets/HumansSpriteSheet.png', {
    'humansPikeman': {
        x: 32,
        y: 16,
        width: 352,
        height: 272,
        sliceX: 22,
        sliceY: 17,
        anims: {
            idle: { from: 0, to: 3, loop: true },
            walk: { from: 4, to: 7, loop: true },
            attack: { from: 8, to: 11 },
            hit: { from: 12, to: 15 },
            death: { from: 16, to: 20 },
        },
    },
})

loadSpriteAtlas('assets/Dungeon-Tileset.png', {
  'tileWall': {
      x: 0,
      y: 16,
      width: 256,
      height: 368,
      sliceX: 16,
      sliceY: 23
      //anims: {
      //    idle: { from: 0, to: 0, loop: true },
      //},
  },
})



scene('game', () => {

  var moveX: number
  var moveY: number
  var scale: number = 16;

  // const npc = new Entity(
  //     Engine.WIDTH,
  //     Engine.HEIGHT,
  //     '@',
  //     '#ffff00',
  //   );
  //   const player = new Entity(Engine.WIDTH, Engine.HEIGHT, '@');
  //   const entities = [npc, player];
    //var engine = new Engine(entities, player);
    
    //var wall = add([
     // sprite('tileWall'),
     // pos(0, 0)
    //])

    for (let y = 0; y < engine.gameMap.tiles.length; y++) {
      const row = engine.gameMap.tiles[y];
      for (let x = 0; x < row.length; x++) {
        const tile = row[x];
        if (tile.type == 'wall') {
          add([
            sprite('tileWall'),
            pos(x * scale, y * scale),
            //rect(16,16),
            //outline(4),
          ])
        }
      }
    }

    const pikeman = add([
        sprite('humansPikeman'),
        pos(engine.player.x * scale, engine.player.y * scale), 
        moveX = engine.player.x,
        moveY = engine.player.y,
    ])

    pikeman.play("idle")

    onUpdate(() => {
        //pikeman.play("idle")
        if(moveX !== engine.player.x) {
          pikeman.pos.x = engine.player.x * scale
        }
        if(moveY !== engine.player.y) {
          pikeman.pos.y = engine.player.y * scale
        }

        moveX = engine.player.x
        moveY = engine.player.y

    });

    onClick(() => addKaboom(mousePos()))

});


go('game')
