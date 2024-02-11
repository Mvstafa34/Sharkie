class Character extends MoveableObject {

    width = 200;
    height = 200;
    y = (480 / 2) - this.offset.top - ((this.height - this.offset.top - this.offset.bottom) / 2); // Mid of the canvas
    x = 4000;
    energy = 100;
    speed = 10;
    offset = {
        top: 95,
        right: 40,
        bottom: 50,
        left: 40
    };
    offsetNear = {
        top: 0,
        right: 66,
        bottom: 0,
        left: 0
    }
    offsets = {
        normal: {
            top: 95,
            right: 40,
            bottom: 50,
            left: 40
        },
        sleep: {
            top: 120,
            right: 38,
            bottom: 26,
            left: 40
        },
        poison: {
            top: 99,
            right: 53,
            bottom: 45,
            left: 51
        },
        shock: {
            top: 83,
            right: 53,
            bottom: 35,
            left: 64
        },
        finslap: {
            top: 100,
            right: 66,
            bottom: 50,
            left: 43
        },
        bubbletrap: {
            top: 75,
            right: 41,
            bottom: 51,
            left: 22
        }
    };
    hitBy;
    lastMovement = 0;
    isSlapping = false;
    isShooting = {
        NORMAL: false,
        POISON: false
    };
    isLongIDLE = false;
    hasDied = false;
    world;


    constructor() {
        super().loadImage('../img/1. Sharkie/3.Swim/1.png');
        this.loadImages(CHARACTER_IMAGES_IDLE);
        this.loadImages(CHARACTER_IMAGES_LONG_IDLE);
        this.loadImages(CHARACTER_IMAGES_SLEEP);
        this.loadImages(CHARACTER_IMAGES_SWIM);
        this.loadImages(CHARACTER_IMAGES_FINSLAP);
        this.loadImages(CHARACTER_IMAGES_BUBBLETRAP['NORMAL']);
        this.loadImages(CHARACTER_IMAGES_BUBBLETRAP['POISON']);
        this.loadImages(CHARACTER_IMAGES_HURT['POISON']);
        this.loadImages(CHARACTER_IMAGES_HURT['SHOCK']);
        this.loadImages(CHARACTER_IMAGES_DEAD['POISON']);
        this.loadImages(CHARACTER_IMAGES_DEAD['SHOCK']);

        this.animate();
    };


    /**
     * Checks pressed keys for character movement and sound in a loop
     * Checks characters state to play animations in a loop
     */
    animate() {

        // Movement
        setInterval(() => {
            CHARACTER_SOUND_SWIM.pause();
            //TODO: Fix playing after a fast keypress
            if (!this.isDead()) {
                if ((this.world.keyboard.RIGHT || this.world.keyboard.D) && !this.isAtLevelEnd(this, 'right')) {
                    this.x += this.speed;
                    this.otherDirection = false;
                    CHARACTER_SOUND_SWIM.play();
                }

                if ((this.world.keyboard.LEFT || this.world.keyboard.A) && !this.isAtLevelEnd(this, 'left')) {
                    this.x -= this.speed;
                    this.otherDirection = true;
                    CHARACTER_SOUND_SWIM.play();
                }

                if ((this.world.keyboard.UP || this.world.keyboard.W) && !this.isAtLevelEnd(this, 'up')) {
                    this.y -= this.speed;
                    CHARACTER_SOUND_SWIM.play();
                }

                if ((this.world.keyboard.DOWN || this.world.keyboard.S) && !this.isAtLevelEnd(this, 'down')) {
                    this.y += this.speed;
                    CHARACTER_SOUND_SWIM.play();
                }

                if (this.world.keyboard.SPACE) {
                    this.startFinSlap();
                }

                if (this.world.keyboard.H) {
                    this.startBubbleTrap();
                }

                if (this.world.keyboard.J) {
                    if (this.world.poisonBar.percentage >= 10)
                        this.startBubbleTrapPoison();
                }
            }
            this.world.camera_x = -this.x - this.offsets.normal.left + this.level_end_space;
        }, 1000 / 60)

        // Animation
        setInterval(() => {

            if (this.isDead()) {
                this.playDead();
                //TODO: Fix dead animation playing from currentImage ?
            } else if (this.isHurt()) {
                this.playHurt();

            } else if (this.isSlapping) {
                this.playFinSlap();

            } else if (this.isShooting.NORMAL) {
                this.playBubbleTrap();

            } else if (this.isShooting.POISON) {
                this.playBubbleTrapPoison();

            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN || this.world.keyboard.W || this.world.keyboard.A || this.world.keyboard.S || this.world.keyboard.D) {
                this.playSwim();

            } else if (this.lastMovement >= 60) {
                this.playSleep();

            } else if (this.lastMovement >= 50) {
                this.playLongIDLE();
            } else {
                this.playIDLE();
            };
        }, 100);
    }

    startFinSlap() {
        if (!this.isSlapping && !this.otherDirection) {
            this.isSlapping = true;
            this.currentImage = 0;
            this.offset = this.offsets.finslap;
        }
    }

    startBubbleTrap() {
        if (!this.isShooting.NORMAL && !this.otherDirection) {
            this.isShooting.NORMAL = true;
            this.currentImage = 0;
            this.offset = this.offsets.bubbletrap;
        }
    }

    startBubbleTrapPoison() {
        if (!this.isShooting.POISON && !this.otherDirection) {
            this.isShooting.POISON = true;
            this.currentImage = 0;
            this.offset = this.offsets.bubbletrap;
            console.log(this.world.poisonBar.percentage);
            this.world.poisonBar.setPercentage(this.world.poisonBar.percentage - 10);
        }
    }

    playSwim() {
        this.playAnimation(CHARACTER_IMAGES_SWIM);
        this.offset = this.offsets.normal;
        this.lastMovement = 0;
    }

    playIDLE() {
        this.playAnimation(CHARACTER_IMAGES_IDLE);
        this.offset = this.offsets.normal;
        this.lastMovement += 1;
    }

    playLongIDLE() {

        if (!this.isLongIDLE) {
            this.isLongIDLE = true;
            this.currentImage = 0;
        }

        this.playAnimation(CHARACTER_IMAGES_LONG_IDLE);

        if (this.currentImage >= CHARACTER_IMAGES_LONG_IDLE.length) {
            this.isLongIDLE = false;
            this.currentImage = 0;
        }

        this.lastMovement += 1;
    }

    playSleep() {
        this.playAnimation(CHARACTER_IMAGES_SLEEP);
        this.offset = this.offsets.sleep;
    }

    playFinSlap() {
        this.playAnimation(CHARACTER_IMAGES_FINSLAP);

        if (this.currentImage === 3) {
            this.world.level.enemies.forEach((enemy) => {
                if (enemy instanceof PufferFish && enemy.isNearby(this)) {
                    enemy.energy = 0;
                    CHARACTER_SOUND_FINSLAP.play()
                }
            });
        }

        if (this.currentImage >= CHARACTER_IMAGES_FINSLAP.length) {
            this.isSlapping = false;
        }

        this.lastMovement = 0;
    }

    playBubbleTrap() {
        this.playAnimation(CHARACTER_IMAGES_BUBBLETRAP['NORMAL']);
        CHARACTER_SOUND_BUBBLETRAP.play()

        if (this.currentImage >= CHARACTER_IMAGES_BUBBLETRAP['NORMAL'].length) {
            let bubble = new ShootableObject(this.x, this.y);
            this.world.shootableObjects.push(bubble);
            this.isShooting.NORMAL = false;
        }

        // TODO: if too easy (too fast shooting), add cooldown
        this.lastMovement = 0;
    }

    playBubbleTrapPoison() {
        this.playAnimation(CHARACTER_IMAGES_BUBBLETRAP['POISON']);
        CHARACTER_SOUND_BUBBLETRAP.play()

        if (this.currentImage >= CHARACTER_IMAGES_BUBBLETRAP['POISON'].length) {
            let bubble = new ShootableObject(this.x, this.y, 'poison');
            this.world.shootableObjects.push(bubble);
            this.isShooting.POISON = false;
        }

        // TODO: if too easy (too fast shooting), add cooldown
        this.lastMovement = 0;
    }

    playHurt() {
        if (this.hitBy === 'JellyFish') {
            this.playAnimation(CHARACTER_IMAGES_HURT['SHOCK']);
            this.offset = this.offsets.shock;

        } else {
            this.playAnimation(CHARACTER_IMAGES_HURT['POISON']);
            this.offset = this.offsets.poison;

        }

        this.lastMovement = 0;
    }

    playDead() {
        if (this.hitBy === 'JellyFish') {
            this.playAnimationOnce(CHARACTER_IMAGES_DEAD['SHOCK']);
            if (this.y <= 250) {
                this.y += 5
            }

        } else {
            this.playAnimationOnce(CHARACTER_IMAGES_DEAD['POISON']);
            if (this.hasDied === false) {
                CHARACTER_SOUND_DEAD.play();
            }
            this.y -= 5
            this.hasDied = true;
        }

        this.lastMovement = 0;
        // TODO: Perfect floating up speed
    }
}

