
import kaboom, { DrawTextOpt, GameObj } from "kaboom"
import "kaboom/global"

import { Entity } from './entity';
import { Engine } from './engine';
import { GameMap } from "./game-map";
import { MessageLog } from './message-log';
import { Colors } from './colors';

import { Configuration, OpenAIApi } from "openai";

const key = "" //process.env.OPENAI_API_KEY

const configuration = new Configuration({
    organization: "org-OXqdu7b2onTGvEGGepy5TB0X",
    apiKey: key,
});

const openai = new OpenAIApi(configuration);



declare global {
  interface Window {
    engine: Engine;
    messageLog: MessageLog;
  }
}


// declare global {
//   interface Window {
//     engine: Engine;
//   }
// }

// const npc = new Entity(
//   Engine.WIDTH, // - 5,
//   Engine.HEIGHT, // 2,
//   '@',
//   '#ffff00',
// );
// const player = new Entity(Engine.WIDTH / 2, Engine.HEIGHT / 2, '@');
// const entities = [npc, player];

//var e = new Engine();

// var tick : number;

// window.addEventListener('DOMContentLoaded', () => {
//   window.engine = engine
// });

window.addEventListener('DOMContentLoaded', () => {
  



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

    const pikeman = add([
        sprite('humansPikeman'),
        pos(window.engine.player.x * scale, window.engine.player.y * scale), 
        moveX = window.engine.player.x,
        moveY = window.engine.player.y,
        //pos(0,0),

    ])

    pikeman.play("idle")

    
      
    onKeyPress("`", () => {
        
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

      }

      comOpenAI();
      
      
    })
      
    


    onUpdate(() => {

      readd(pikeman)

      // tick++

      // if (tick == 1) {
      //   tick = 0
      //   for (let y = 0; y < window.engine.gameMap.tiles.length; y++) {
      //     const row = engine.gameMap.tiles[y];
      //     for (let x = 0; x < row.length; x++) {
      //       const tile = row[x];
      //       if (tile.type == 'wall') {
      //          add([
      //            sprite('tileWall'),
      //            pos(x * scale, y * scale),
      //          ])
      //       }
      //     }
      //   }
      // }

      


      



      if(!window.engine.isTweening && moveX !== window.engine.player.x) {
        //pikeman.play("walk")
        
        const t = tween(
          // start value (accepts number, Vec2 and Color)
          pikeman.pos.x,
          // destination value
          window.engine.player.x * scale,
          // duration (in seconds)
          0.08,
          // how value should be updated
          (val) => pikeman.pos.x = val,
          // interpolation function (defaults to easings.linear)
          //easings[4],
        )

        window.engine.isTweening = true
        animEnded = false

        t.then(() => {
          window.engine.isTweening = false;
        });



      }

      if(!window.engine.isTweening && moveY !== window.engine.player.y) {
        //pikeman.play("walk")
        
        const t = tween(
          // start value (accepts number, Vec2 and Color)
          pikeman.pos.y,
          // destination value
          window.engine.player.y * scale,
          // duration (in seconds)
          0.08,
          // how value should be updated
          (val) => pikeman.pos.y = val,
          // interpolation function (defaults to easings.linear)
          //easings[4],
        )

        window.engine.isTweening = true
        animEnded = false

        t.then(() => {
          window.engine.isTweening = false;
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

      moveX = window.engine.player.x
      moveY = window.engine.player.y

    });

    onClick(() => addKaboom(mousePos()))

});



go('game')


window.messageLog = new MessageLog();
  window.engine = new Engine();
  //e = window.engine;
  window.messageLog.addMessage(
    'Hello and welcome, adventurer, to yet another dungeon!',
    Colors.WelcomeText,
  );
  window.engine.screen.render();


});
