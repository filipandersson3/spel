class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // säg åt phaser att lägga till /assets i alla paths
        this.load.setBaseURL('/assets');
        //this.load.image('background', '/images/background.png');
        this.load.image('spike', '/images/spike.png');
        this.load.image('sign', '/images/sign.png');
        this.load.image('ramp', '/images/ramp.png');
        this.load.image('shop', '/images/shop.png');
        this.load.image('skyPlatform', '/images/skyPlatform.png');
        this.load.atlas(
            'player',
            '/images/jefrens_hero.png',
            '/images/jefrens_hero.json'
        );
        this.load.atlas(
            'foe',
            '/images/jefrens_foe.png',
            '/images/jefrens_foe.json'
        );
        this.load.image('tiles', '/tilesets/jefrens_tilesheet.png');
        this.load.atlas('shopGuy', '/images/shopGuy.png', '/images/shopGuy.json')
        // här laddar vi in en tilemap med spelets "karta"
        this.load.tilemapTiledJSON('map', '/tilemaps/link.json');
        this.add.text(0, 0, '', { fontFamily: '"PressStart2P"' });
        this.game.maxdistance = 0;
        this.game.speed = 90;
        this.game.upgrades = [false,false,false,false];
        this.game.zeunerts = 90;
    }

    create() {
        this.scene.start('PlayScene');
    }
}

export default PreloadScene;