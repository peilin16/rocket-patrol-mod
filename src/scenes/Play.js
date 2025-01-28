class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    create() {
        this.total_second = 60
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4 + 30, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2 + 30, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4 + 30, 'spaceship', 0, 10).setOrigin(0,0)
        //add special ship
        this.special_ship = new Specialship(this, game.config.width + borderUISize*6, borderUISize*4 , 'specialship', 0, 30).setOrigin(0, 0)
        
        
        //var target = new Phaser.Math.Vector2();
        this.input.on('pointerdown', function (pointer) {
            this.p1Rocket.tofire()

        }, this);
        //var target = new Phaser.Math.Vector2();
        this.input.on('pointermove', function (pointer) {
            if (this.p1Rocket.isFiring == false){
                //alert(pointer.x )
                if(pointer.x > 33 && pointer.x < game.config.width - 33){
                    this.p1Rocket.x = pointer.x
                }
            }
            //
        }, this);

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        // initialize score
        this.p1Score = 0
        // display score
        
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        }
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, this.scoreConfig)

        
        //game over flag
        this.gameOver = false

        // 60-second play clock
        this.scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(60000, () => this.gameOver1(), null, this)

        //this.timeCross =5//this.clock.getElapsedSeconds()
        // new mod show the time 
        this.timeRight = this.add.text(  borderUISize + borderPadding +400 ,borderUISize + borderPadding*2, this.clock.getElapsedSeconds(),timeConfig);
    }
    gameOver1(){
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', this.scoreConfig).setOrigin(0.5)
        this.gameOver = true
    }
    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }

        // scroll starfield
        this.starfield.tilePositionX -= 3


        currentTime = this.clock.elapsed
        // update rocket and ships
        if (!this.gameOver) {
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
            this.special_ship.update()
        }
        this.clock.elapsed = currentTime


        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        if (this.checkCollision(this.p1Rocket, this.special_ship)) {
            this.p1Rocket.reset()
            this.shipExplode(this.special_ship)
        }
        // check for game over menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
                // reset on miss
 
        this.timeRight.text =this.total_second - Math.floor(this.clock.getElapsedSeconds()) //this.clock.elapsed //
        
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true
        } else {
          return false
        }
    }


    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        // score add and repaint
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score

        let explosion_list = Array()
        explosion_list=["sfx-explosion1","sfx-explosion2","sfx-explosion3","sfx-explosion4"]
        let n =Math.floor( Math.random() * 3);
        //alert(explosion_list[n])


        this.sound.play(explosion_list[n])
        //reset time
        if(ship.points == 60){
            this.clock.elapsed -= 18000
        }else{
            this.clock.elapsed -= 6000
        }
        
        //alert(this.clock.elapsed)
       // this.clock = this.time.delayedCall(this.clock.getElapsedSeconds() + ship.points , () => this.gameOver1(), null, this)

    }

  }