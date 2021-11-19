class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        // variabel för att hålla koll på hur många gånger vi spikat oss själva
        this.spiked = 0;

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

        // skapa en spelare och ge den studs
        this.player = this.physics.add.sprite(this.spawns.objects[0].x, this.spawns.objects[0].y, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(false);

        this.foe = this.physics.add.sprite(this.spawns.objects[0].x, this.spawns.objects[0].y, 'foe');
        this.physics.add.collider(this.foe, this.platforms);

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
        this.updateText();

        // lägg till en keyboard input för W
        this.keyObj = this.input.keyboard.addKey('W', true, false);

        // exempel för att lyssna på events
        this.events.on('pause', function () {
            console.log('Play scene paused');
        });
        this.events.on('resume', function () {
            console.log('Play scene resumed');
        });
    }

    // play scenens update metod
    update() {
        // för pause
        if (this.keyObj.isDown) {
            // pausa nuvarande scen
            this.scene.pause();
            // starta menyscenene
            this.scene.launch('MenuScene');
        }

        // följande kod är från det tutorial ni gjort tidigare
        // Control the player with left or right keys
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown && !this.flipFlop) {
            this.player.setVelocityX(this.player.body.velocity.x+30);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
            this.flipFlop = true;
        } else {
            // If no keys are pressed, the player keeps still
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
        this.foe.setVelocityX(300);
        this.foe.play('foeWalk', true);
        this.foe.setFlipX(true);

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
        this.spiked++;
        this.updateText();
        if (this.spiked >= 2000) {
            this.scene.pause();
        }
        if (Math.round(this.player.x) > 100) {
            this.obstacle = this.physics.add.sprite(this.player.x+500, this.player.y, 'foe');
            this.physics.add.collider(this.obstacle, this.platforms);
            this.physics.add.overlap(
                this.player,
                this.obstacle,
                this.playerHitFoe,
                null,
                this
            );
        }
    }

    // metoden updateText för att uppdatera overlaytexten i spelet
    updateText() {
        this.text.setText(
            `Arrow keys to move. Space to jump. W to pause. Spiked: ${this.spiked} Distance: ${Math.round(this.player.x/32)}`
        );
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
        player.setVelocityX(player.body.velocity.x + 200)
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
