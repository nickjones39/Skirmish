import kaboom from "kaboom"
import "kaboom/global"

kaboom({
  font: 'sinko',
  scale: 4,
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
    
    const pikeman = add([
        sprite('humansPikeman'),  
    ])

    pikeman.play("idle")
    
    //onUpdate(() => {
        //pikeman.play("idle")
    //});

    onClick(() => addKaboom(mousePos()))
  
});


go('game')

