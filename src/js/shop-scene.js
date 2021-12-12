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
        this.shopWindow = this.add.rectangle(450, 260, 480, 300, 0x303030);
        this.textTitle = this.add.text(0, (this.game.config.height / 2) - 90, 'Penguin guy store', {
            fontFamily: '"PressStart2P"',
            fontSize: '18px',
            fill: '#ffffff',
            align: 'center',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        });
        this.textItem1 = this.add.text(230, (this.game.config.height / 2) - 32, 'Plank: 10 Z$', {
            fontFamily: '"PressStart2P"',
            fontSize: '16px',
            fill: '#ffffff',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        })
        .setData("cost","10");

        this.textItem2 = this.add.text(230, (this.game.config.height / 2), 'Normal Skis: 20 Z$', {
            fontFamily: '"PressStart2P"',
            fontSize: '16px',
            fill: '#ffffff',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        })
        .setData("cost","20");

        this.textItem3 = this.add.text(230, (this.game.config.height / 2) + 32, 'Bow-Flex 3000 Skis: 40 Z$', {
            fontFamily: '"PressStart2P"',
            fontSize: '16px',
            fill: '#ffffff',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        })
        .setData("cost","30");

        this.itemList = [this.textItem1,this.textItem2,this.textItem3];
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shopCursor = this.add.rectangle(220, 198, 5, 5, 0xffffff);
        this.cursorPos = 0;
    }

    // scenens uppdate metod, lyssnar på keyDown
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            if (this.cursorPos < this.itemList.length-1) {
                this.cursorPos++;
            }
            
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            if (this.cursorPos > 0) {
                this.cursorPos--;
            }
        }
        this.shopCursor.y = 198+this.cursorPos*32
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            if (this.game.zeunerts >= this.itemList[this.cursorPos].getData("cost")) {
                this.itemList[this.cursorPos].setTint(0x969696);
                console.log("item " + this.cursorPos + " bought");
                this.game.zeunerts -= this.itemList[this.cursorPos].getData("cost");
            }
        }
    }
}

export default PreloadScene;
