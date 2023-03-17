import kaboom, { DrawTextOpt, GameObj } from "kaboom"
import "kaboom/global"

import { Entity } from './entity';
import { Engine } from './engine';


import { Configuration, OpenAIApi } from "openai";

const key = "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"  //process.env.OPENAI_API_KEY

const configuration = new Configuration({
    organization: "org-OXqdu7b2onTGvEGGepy5TB0X",
    apiKey: key,
});

const openai = new OpenAIApi(configuration);


// async function main() {
//   const completion = await openai.createCompletion(
//     {
//       model: "text-davinci-003",
//       prompt: "Hello world, tell me a joke",
//     },
//   );
//   console.log(completion.data.choices[0].text);
// }

// main();




// declare global {
//   interface Window {
//     engine: Engine;
//   }
// }

const npc = new Entity(
  Engine.WIDTH, // - 5,
  Engine.HEIGHT, // 2,
  '@',
  '#ffff00',
);
const player = new Entity(Engine.WIDTH / 2, Engine.HEIGHT / 2, '@');
const entities = [npc, player];
const engine = new Engine(entities, player);
var tick : number;

window.addEventListener('DOMContentLoaded', () => {
  window.engine = engine
});

kaboom({
  width:1600,
  height:1200,
  //font: 'sinko',
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
            walk: { from: 4, to: 7},
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
  var tick: number
  var moving: boolean
  var animEnded: boolean = true
  var chatGPT: GameObj

    for (let y = 0; y < engine.gameMap.tiles.length; y++) {
      const row = engine.gameMap.tiles[y];
      for (let x = 0; x < row.length; x++) {
        const tile = row[x];
        if (tile.type == 'wall') {
          add([
            sprite('tileWall'),
            pos(x * scale, y * scale),
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

    onKeyPress("l", () => {
        
      if (chatGPT != undefined) {
        destroy(chatGPT)
      }


      async function comOpenAI() {
        const completion = await openai.createCompletion(
          {
            model: "text-davinci-003",
            prompt: "${prompt}" + 
              " provide a random detailed description of the interior of an empty dungeon room. Do not call it a dungeon room. do not provide any actions of the player, or adventuerers. the point is to write only about the environment. Only describe what the player can see about the room. provide description of two exits from room, one to the east and one to the north. do no provide what the player can see about the exits. make the reply only 2 or 3 sentences long. make the response back more random with more variations.",
            max_tokens: 1000
          },
        ).then((res) => {
          var response = res.data.choices[0].text + "";
          console.log(res.data.choices[0].text)

          add([
            pos(0, 0),
            rect(400, 100),
            outline(2),
            color(0,0,0)

          ])

          chatGPT = add(
            [
              text(response, {
                size: 10,
                width: 320,
                lineSpacing: 5,
                font: "sans-serif"
              }),
              pos(20,0),
              
            ])

        });
        

        //var response = completion.data.choices[0].text + "";
        //console.log(completion.data.choices[0].text)

        

        // const chatGPT = formatText({
        //     text: response,
        //     size: 14,
        //     font: "Arial",
        //     //width: 120,
        //     //pos: vec2(1, 1),
        //     color: rgb(255, 255, 255),
        // })

        // drawRect({
        //   width: 250,
        //   height: 250,
        // })
        // drawFormattedText(chatGPT)
      }

      comOpenAI();
      
      
    })


    onUpdate(() => {

      tick++

      if (tick == 1) {
        tick = 0
        for (let y = 0; y < engine.gameMap.tiles.length; y++) {
          const row = engine.gameMap.tiles[y];
          for (let x = 0; x < row.length; x++) {
            const tile = row[x];
            if (tile.type == 'wall') {
               add([
                 sprite('tileWall'),
                 pos(x * scale, y * scale),
               ])
            }
          }
        }
      }

      


      if(!Engine.isTweening && moveX !== engine.player.x) {
        //pikeman.play("walk")
        
        const t = tween(
          // start value (accepts number, Vec2 and Color)
          pikeman.pos.x,
          // destination value
          engine.player.x * scale,
          // duration (in seconds)
          0.08,
          // how value should be updated
          (val) => pikeman.pos.x = val,
          // interpolation function (defaults to easings.linear)
          //easings[4],
        )

        Engine.isTweening = true
        animEnded = false

        t.then(() => {
          Engine.isTweening = false;
        });



      }

      if(!Engine.isTweening && moveY !== engine.player.y) {
        //pikeman.play("walk")
        
        const t = tween(
          // start value (accepts number, Vec2 and Color)
          pikeman.pos.y,
          // destination value
          engine.player.y * scale,
          // duration (in seconds)
          0.08,
          // how value should be updated
          (val) => pikeman.pos.y = val,
          // interpolation function (defaults to easings.linear)
          easings[4],
        )

        Engine.isTweening = true
        animEnded = false

        t.then(() => {
          Engine.isTweening = false;
        });
      }

      // pikeman.onAnimEnd((animName) => {
      //   if (animName === "walk") {
      //       pikeman.play("idle")
      //   }
      // });

      // if (pikeman.curAnim() !== "idle" && pikeman.pos.x == engine.player.x * scale && pikeman.pos.y == engine.player.y * scale) {
      //   pikeman.play("idle")
      // }

      moveX = engine.player.x
      moveY = engine.player.y

    });

    onClick(() => addKaboom(mousePos()))

});



go('game')
