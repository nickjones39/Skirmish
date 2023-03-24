import kaboom, { DrawTextOpt, GameObj } from "kaboom"
import "kaboom/global"
import { Entity } from './entity';
import { Engine } from './engine';
import { GameMap } from "./game-map";
import { MessageLog } from './message-log';
import { Colors } from './colors';


import { Configuration, OpenAIApi } from "openai";
import { kDrawModel } from "./kDrawModel";

import {env} from './types/environment'

const key = env.OPENAI_API_KEY

const configuration = new Configuration({
    organization: "org-OXqdu7b2onTGvEGGepy5TB0X",
    apiKey: key,
});

const openai = new OpenAIApi(configuration);



declare global {
  interface Window {
    engine: Engine;
    //messageLog: MessageLog;
  }
}

const e = new Engine();

window.addEventListener('DOMContentLoaded', () => {
  
  //window.messageLog = new MessageLog();
  //e = new Engine();
  window.engine = e;
  // wwindow.messageLog.addMessage(
  //   'Hello and welcome, adventurer, to yet another dungeon!',
  //   Colors.WelcomeText,
  // );
  //window.engine.screen.render();


});

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
//   e = engine
// });




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
  '.': {
      x: 0,
      y: 0,
      width: 256,
      height: 368,
      sliceX: 16,
      sliceY: 23,
      anims: {
          floor: { from: 16, to: 16, loop: false },
          void: { from: 0, to: 0, loop: false },
          wall: { from: 60, to: 60, loop: false }
      },
  },
})


loadSpriteAtlas('assets/tileset.png', {
  '#': {
      x: 0,
      y: 48,
      width: 256,
      height: 144,
      sliceX: 16,
      sliceY: 9
      //anims: {
      //    idle: { from: 0, to: 0, loop: true },
      //},
  },
})


scene('game', () => {

  var moveX: number
  var moveY: number
  var scale: number = 16;
  var chatGPT: GameObj

  var level: Array<GameObj> = new Array<GameObj>;

    const pikeman = add([
        sprite('humansPikeman'),
        pos(e.player.x * scale, e.player.y * scale), 
        moveX = e.player.x,
        moveY = e.player.y,
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
      

    // kDrawModel.levelMap.forEach((item) => {
    //   add([
    //     sprite(' '),
    //     pos(item.x * 16, item.y * 16),
    //     play('floor')
    //   ])
    // })
      
      
    // kDrawModel.levelMap.forEach((item) => {
    //   var tile = add([
    //     sprite(' '),
    //     pos(item.x * 16, item.y * 16),
    //   ])
    //   tile.play('floor');
    //   level.push(tile);
    // })
          
    
   

    onUpdate(() => {

      e.screen.render()

      readd(pikeman)

      kDrawModel.levelMap.forEach((item) => {
        if (item.tile.visible || item.tile.seen) {
          if (item.char == '#') {
            drawSprite({
              sprite: '#',
              pos: vec2(item.x * 16, item.y * 16),
            })
          }
          if (item.char == '.') {
            drawSprite({
              sprite: '.',
              pos: vec2(item.x * 16, item.y * 16),
              frame: 16,
            })
          }
        }
      })
          

      if(moveX !== e.player.x) {
        pikeman.pos.x = e.player.x * scale;
      }

      if(moveY !== e.player.y) {
        pikeman.pos.y = e.player.y * scale;
      }

      // pikeman.onAnimEnd((animName) => {
      //   if (animName === "walk") {
      //       pikeman.play("idle")
      //   }
      // });

      // if (pikeman.curAnim() !== "idle" && pikeman.pos.x == engine.player.x * scale && pikeman.pos.y == engine.player.y * scale) {
      //   pikeman.play("idle")
      // }

      moveX = e.player.x
      moveY = e.player.y

    });

    onClick(() => addKaboom(mousePos()))

});


go('game')



