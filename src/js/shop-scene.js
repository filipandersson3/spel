class PreloadScene extends Phaser.Scene {
    constructor() {
        super('ShopScene');
    }

    create() {
        // Det går att göra så att input lyssnar på spelet
        // nu är det på scenen, därför behöver vi skapa input igen
        this.keyObj = this.input.keyboard.addKey('E', true, false);

        // spelets config om vi behöver något från den, som width height
        // console.log(this.game.config)
        // skapa texten för PAUSED
        // använder en font som laddats i base.njk från Google fonts
        // fixedW/H används för  att kunna centrera texten på skärmen
        this.HUDBar = this.add.rectangle(450, 260, 480, 300, 0x303030);
        this.text = this.add.text(0, (this.game.config.height / 2) - 90, 'Penguin guy store', {
            fontFamily: '"PressStart2P"',
            fontSize: '18px',
            fill: '#ffffff',
            align: 'center',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        });
        this.text = this.add.text(230, (this.game.config.height / 2) - 32, 'Plank: 10 Z$', {
            fontFamily: '"PressStart2P"',
            fontSize: '16px',
            fill: '#ffffff',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        });
        this.text = this.add.text(230, (this.game.config.height / 2), 'Normal Skis: 20 Z$', {
            fontFamily: '"PressStart2P"',
            fontSize: '16px',
            fill: '#ffffff',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        });
        this.text = this.add.text(230, (this.game.config.height / 2) + 32, 'Bow-Flex 3000 Skis: 20 Z$', {
            fontFamily: '"PressStart2P"',
            fontSize: '16px',
            fill: '#ffffff',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        });
    }

    // scenens uppdate metod, lyssnar på keyDown
    update() {
        
    }
}

export default PreloadScene;
