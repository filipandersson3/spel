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
        this.text = this.add.text(0, (this.game.config.height / 2) - 64, 'buy my shit', {
            fontFamily: '"PressStart2P"',
            fontSize: '16px',
            fill: '#ff0000',
            align: 'center',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        });
    }

    // scenens uppdate metod, lyssnar på keyDown
    update() {
        
    }
}

export default PreloadScene;
