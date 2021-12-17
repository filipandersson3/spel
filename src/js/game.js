// importera alla scener
import PlayScene from './play-scene';
import PreloadScene from './preload-scene';
import MenuScene from './menu-scene';
import ShopScene from './shop-scene';
import EndScene from './end-scene';

const eventsCenter = new Phaser.Events.EventEmitter()

// spelets config
const config = {
    type: Phaser.AUTO,
    width: 896,
    height: 448,
    pixelArt: true,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: [PreloadScene, PlayScene, MenuScene, ShopScene, EndScene],
    parent: 'game'
};

// initiera spelet
let game = new Phaser.Game(config);
