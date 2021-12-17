class PreloadScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    create() {
        // Det går att göra så att input lyssnar på spelet
        // nu är det på scenen, därför behöver vi skapa input igen

        // spelets config om vi behöver något från den, som width height
        // console.log(this.game.config)
        // skapa texten för PAUSED
        // använder en font som laddats i base.njk från Google fonts
        // fixedW/H används för  att kunna centrera texten på skärmen
        this.text = this.add.text(0, (this.game.config.height / 2) - 100, 'your are winner', {
            fontFamily: '"PressStart2P"',
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        });
        this.text2 = this.add.text(210, (this.game.config.height / 2) - 40, `unfortunately the penguin drank \nall ${7000+this.game.zeunerts} liters of Zenarts and \ndied 45 years young. \nmay he rest in peace. \n\nCEO of Zenarts, Petter Goldman \nage 58, gave himself up to the \nauthorities after the incident. \nhe is now serving a life sentence`, {
            fontFamily: '"PressStart2P"',
            fontSize: '14px',
            fill: '#ffffff',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        })
    }

    // scenens uppdate metod, lyssnar på keyDown
    update() {
        
    }
}

export default PreloadScene;
