//space ship prefab
class Specialship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        this.points = pointValue + 50
        this.moveSpeed = game.settings.spaceshipSpeed
    }
    update(){
        this.x -= this.moveSpeed + 1
        if(this.x <= 0 - this.width){
            this.x = game.config.width
        }
    }

    reset(){
        this.x = game.config.width
    }
}