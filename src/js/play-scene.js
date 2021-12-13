class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        // variabel för att hålla koll på kyla
        this.cold = 0;
        this.game.zeunerts = this.game.zeunerts > 0 ? this.game.zeunerts : 0;
        console.log(this.game);

        // ladda spelets bakgrundsbild, statisk
        // setOrigin behöver användas för att den ska ritas från top left
        //this.add.image(0, 0, 'background').setOrigin(0, 0);

        // skapa en tilemap från JSON filen vi preloadade
        const map = this.make.tilemap({ key: 'map' });
        // ladda in tilesetbilden till vår tilemap
        const tileset = map.addTilesetImage('jefrens_tilesheet', 'tiles');

        // initiera animationer, detta är flyttat till en egen metod
        // för att göra create metoden mindre rörig
        this.initAnims();

        // keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // Ladda lagret Platforms från tilemappen
        // och skapa dessa
        // sätt collisionen
        map.createLayer('background', tileset);
        map.createLayer('backgroundlayer2', tileset);
        this.platforms = map.createLayer('platforms', tileset);
        this.platforms.setCollisionByExclusion(-1, true);
        this.spawns = map.getObjectLayer('spawns');
        // platforms.setCollisionByProperty({ collides: true });
        // this.platforms.setCollisionFromCollisionGroup(
        //     true,
        //     true,
        //     this.platforms
        // );
        // platforms.setCollision(1, true, true);

        this.shop = this.physics.add.sprite(70, this.game.config.height - 136, 'shop').setScale(3);
        this.physics.add.collider(this.shop, this.platforms);
        this.shop.body.immovable = true;
        this.shop.body.moves = false;

        // skapa en spelare och ge den studs
        this.player = this.physics.add.sprite(this.spawns.objects[0].x, this.spawns.objects[0].y, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(false);

        this.zeunertsCounter = 0;

        // skapa en fysik-grupp
        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        // från platforms som skapats från tilemappen
        // kan vi ladda in andra lager
        // i tilemappen finns det ett lager Spikes
        // som innehåller spikarnas position
        console.log(this.platforms);
        map.getObjectLayer('spikes').objects.forEach((spike) => {
            // iterera över spikarna, skapa spelobjekt
            const spikeSprite = this.spikes
                .create(spike.x, spike.y, 'spike')
                .setOrigin(0);
            spikeSprite.body
                .setSize(spike.width, spike.height - 20)
                .setOffset(0, 20);
        });
        // lägg till en collider mellan spelare och spik
        // om en kollision sker, kör callback metoden playerHit
        this.physics.add.collider(
            this.player,
            this.spikes,
            this.playerHit,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.foe,
            this.playerHitFoe,
            null,
            this
        );

        // krocka med platforms lagret
        this.physics.add.collider(this.player, this.platforms);

        // skapa text på spelet, texten är tom
        // textens innehåll sätts med updateText() metoden
        this.text = this.add.text(16, 16, '', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.text.setScrollFactor(0);

        // lägg till en keyboard input för W
        this.keyObj = this.input.keyboard.addKey('W', true, false);
        this.eKeyObj = this.input.keyboard.addKey('E', true, false);
        this.fKeyObj = this.input.keyboard.addKey('F', true, false);

        // exempel för att lyssna på events
        this.events.on('pause', function () {
            console.log('Play scene paused');
        });
        this.events.on('resume', function () {
            console.log('Play scene resumed');
        });

//        this.timerEvent = this.time.addEvent({ delay: 500, repeat: 0 });
        this.rampSwitch = false;

        this.HUDBar = this.add.rectangle(450, 35, 900, 70, 0x303030).setScrollFactor(0);

        this.HUDBar2 = this.add.rectangle(350, 33, 205, 20, 0x545454).setScrollFactor(0);

        this.HUDColdText = this.add.text(40, 25, 'Temperature:', { fontFamily: '"PressStart2P"' }).setScrollFactor(0);

        this.coldMeter = this.add.rectangle(350, 33, 200, 10, 0x9966ff).setScrollFactor(0);

        this.maxColdMeterWidth = 0.2;

        this.HUDZeunertsText = this.add.text(500, 25, 'Zeunerts:', { fontFamily: '"PressStart2P"' }).setScrollFactor(0);

        this.HUDDistanceText = this.add.text(720, 25, '0 m', { fontFamily: '"PressStart2P"' }).setScrollFactor(0);

        this.updateText();

        if (this.game.maxdistance > 500) {
            this.sign = this.physics.add.sprite(this.game.maxdistance, this.game.config.height - 96, 'sign').setScale(2);
            this.physics.add.collider(this.sign, this.platforms);
            this.sign.body.immovable = true;
            this.sign.body.moves = false;
            this.signText = this.add.text(0, this.game.config.height - 192, `${Math.round(this.game.maxdistance/32)} m`, { fontFamily: '"PressStart2P"' });
            this.signText.x = (this.game.maxdistance - this.signText.width/2);
        }

        this.shopText = this.add.text(5, 220, `purchase my wares \n press 'E'`, { fontFamily: '"PressStart2P"' });
        this.isShopOpen = false;

        this.shopGuy = this.physics.add.sprite(70, this.game.config.height-136, 'shopGuy').setScale(3);
        this.shopGuy.body.immovable = true;
        this.shopGuy.body.moves = false;
        this.shopGuy.play('shopGuyIdle', true);
    }

    // play scenens update metod
    update() {
        console.log(this.game.speed);
        // för pause
        if (this.keyObj.isDown) {
            // pausa nuvarande scen
            this.scene.pause();
            // starta menyscenene
            this.scene.launch('MenuScene');
        }
        if (this.player.x < 250) {
            if (Phaser.Input.Keyboard.JustDown(this.eKeyObj)) {
                if (this.isShopOpen) {
                    this.scene.pause('ShopScene');
                    this.scene.setVisible(false, 'ShopScene');
                    this.isShopOpen = false;
                } else {
                    this.scene.launch('ShopScene');
                    this.isShopOpen = true;
                }
            }
            this.shopText.alpha = 1;
        } else {
            this.shopText.alpha = 0;
            this.scene.pause('ShopScene');
            this.scene.setVisible(false, 'ShopScene');
            this.isShopOpen = false;
        }
        if (this.isShopOpen) {
            if (Phaser.Input.Keyboard.JustDown(this.fKeyObj) && this.game.zeunerts >= 10) {
                this.game.speed += 10;
                this.game.zeunerts -= 10;
            }
        }

        // följande kod är från det tutorial ni gjort tidigare
        // Control the player with left or right keys
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown && !this.flipFlop) {
            this.player.setVelocityX(this.player.body.velocity.x+this.game.speed);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
            this.flipFlop = true;
        } else {
            // If no keys are pressed, the player glides :)
            this.player.setVelocityX(this.player.body.velocity.x*0.99);
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (this.player.body.onFloor() && this.player.body.velocity.x < 25) {
                this.player.play('idle', true);
                this.player.body.velocity.x = 0;
            }
            if (this.cursors.right.isUp) {
                this.flipFlop = false;
            }
        }

        // Player can jump while walking any direction by pressing the space bar
        // or the 'UP' arrow
        if (
            (this.cursors.space.isDown || this.cursors.up.isDown) &&
            this.player.body.onFloor()
        ) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            // otherwise, make them face the other side
            this.player.setFlipX(true);
        }
        let playerMiddle = this.player.x - this.game.config.width/2 + this.player.body.width;
        if ((playerMiddle + 50) > 0) {
            //en röra som gör att kameran följer spelaren om den går för långt åt vänster eller höger
            //vet inte riktigt hur det fungerar för att jag testade mig fram tills det funkade
            if ((playerMiddle - 50) > this.cameras.main.scrollX) { 
                this.cameras.main.scrollX = playerMiddle - 50;
            } else if ((playerMiddle + 50) < this.cameras.main.scrollX) {
                this.cameras.main.scrollX = playerMiddle + 50;
            }
        }
        if (this.player.x > 500) {
            this.cold++;
        }
        this.coldMeter.width = (1000-this.cold)*this.maxColdMeterWidth;
        this.updateText();
        if (this.cold >= 1000) {
            this.player.setVelocityX(0);
            this.player.setVelocityY(300);
            this.coldMeter.width = 0;
            this.player.play('jump', true)
            this.time.addEvent({ delay: 5000, callback: this.restart, callbackScope: this});
        }
        if (this.player.body.velocity.x > 1000 && Math.round(this.cold)%Math.round(50000/this.player.body.velocity.x) == 0) {
            this.obstacle = this.physics.add.sprite(this.player.x+500, this.game.config.height - 96, 'foe');
            this.physics.add.collider(this.obstacle, this.platforms);
            this.physics.add.overlap(
                this.player,
                this.obstacle,
                this.playerHitFoe,
                null,
                this
            );
            this.obstacle.body.setVelocityX(-30);
            this.obstacle.setTint(0xFF0000);
        }
        if (this.player.body.velocity.x > 1000 && Math.round(this.cold)%Math.round(30000/this.player.body.velocity.x) == 0) {
            this.zeunerts = this.physics.add.sprite(this.player.x+500, this.game.config.height - 96, 'foe');
            this.physics.add.collider(this.zeunerts, this.platforms);
            this.physics.add.overlap(
                this.player,
                this.zeunerts,
                this.playerHitZeunerts,
                null,
                this
            );
            this.zeunerts.setTint(0xFFFF00);
        }
        if (this.player.body.velocity.x > 1000 && Math.round(this.cold)%Math.round(70000/this.player.body.velocity.x) == 0) {
            this.ramp = this.physics.add.sprite(this.player.x+500, this.game.config.height - 80, 'ramp').setScale(2);
            this.physics.add.collider(this.ramp, this.platforms);
            this.physics.add.overlap(
                this.player,
                this.ramp,
                this.playerHitRamp,
                null,
                this
            );
            this.ramp.body.immovable = true;
            this.ramp.body.moves = false;
        }
        if (this.player.body.velocity.x > 1000 && Math.round(this.cold)%Math.round(90000/this.player.body.velocity.x) == 0) {
            this.skyPlatform = this.physics.add.sprite(this.player.x+500, this.game.config.height - 300, 'skyPlatform').setScale(3);
            this.physics.add.collider(this.skyPlatform, this.player);
            this.skyPlatform.body.immovable = true;
            this.skyPlatform.body.moves = false;
            for (var i = 0; i<3; i++) {
                this.zeunerts = this.physics.add.sprite(this.player.x+452+(i*48), this.game.config.height - 360, 'foe');
                this.physics.add.collider(this.zeunerts, this.skyPlatform);
                this.physics.add.overlap(
                    this.player,
                    this.zeunerts,
                    this.playerHitZeunerts,
                    null,
                    this
                );
                this.zeunerts.setTint(0xFFFF00);
            }
        }
    }

    // metoden updateText för att uppdatera overlaytexten i spelet
    updateText() {
        this.text.setText(
            `Zeunerts: ${this.game.zeunerts} Cold: ${this.cold} Distance: ${Math.round(this.player.x/32)} Speed: ${Math.round(this.player.body.speed/10)}`
        );
        this.HUDZeunertsText.setText(
            `Zeunerts: ${this.game.zeunerts}`
        );
        if (Math.round(this.player.x/32) > 9) {
            this.HUDDistanceText.setText(
                `${Math.round(this.player.x/32)-9} m`
            );
        }
        
    }

    restart() {
        if (this.player.x > this.game.maxdistance) {
            this.game.maxdistance = this.player.x;
        }
        this.scene.restart();
    }

    // när spelaren landar på en spik, då körs följande metod
    playerHit(player, spike) {
        this.spiked++;
        player.setVelocity(0, 0);
        player.setX(this.spawns.objects[0].x);
        player.setY(this.spawns.objects[0].y);
        player.play('idle', true);
        let tw = this.tweens.add({
            targets: player,
            alpha: { start: 0, to: 1 },
            tint: { start: 0xff0000, to: 0xffffff },
            duration: 100,
            ease: 'Linear',
            repeat: 5
        });
        this.updateText();
    }

    playerHitFoe(player, foe) {
        player.setVelocityX(player.body.velocity.x*0.7);
        foe.setX(0);
    }

    playerHitRamp(player, ramp) {
        if (!this.rampSwitch && (player.x+player.width) > ramp.x+ramp.width/2 && (player.y+player.height) > ramp.y+ramp.height/2) {
            player.setVelocityX(player.body.speed*0.7);
            player.setVelocityY(player.body.speed*-0.7);
            this.rampSwitch = true;
            this.time.addEvent({ delay: 1000, callback: this.changeRampSwitch, callbackScope: this});
        }
        
    }

    changeRampSwitch() {
        this.rampSwitch = false;
    }

    playerHitZeunerts(player, zeunerts) {
        player.setVelocityX(player.body.velocity.x + 30);
        player.setVelocityY(player.body.velocity.y - 20);
        this.game.zeunerts++;
        zeunerts.setX(0);
    }

    // när vi skapar scenen så körs initAnims för att ladda spelarens animationer
    initAnims() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'jefrens_',
                start: 1,
                end: 4
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'shopGuyIdle',
            frames: this.anims.generateFrameNames('shopGuy', {
                prefix: '',
                start: 0,
                end: 5
            }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'jefrens_2' }],
            frameRate: 10
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'jefrens_5' }],
            frameRate: 10
        });

        this.anims.create({
            key: 'foeWalk',
            frames: this.anims.generateFrameNames('foe', {
                prefix: 'foe_',
                start: 1,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'foeIdle',
            frames: [{ key: 'foe', frame: 'foe_4'}],
            frameRate: 10
        });
    }
}

export default PlayScene;
