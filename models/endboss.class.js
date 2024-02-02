class Endboss extends MoveableObject {

    width = 300;
    height = 300;
    y = 0;
    offset = {
        top: 140,
        right: 55,
        bottom: 55,
        left: 20
    };

    IMAGES_WALKING = [
        '../img/2. Enemy/3 Final Enemy/2.floating/1.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/2.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/3.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/4.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/5.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/6.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/7.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/8.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/9.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/10.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/11.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/12.png',
        '../img/2. Enemy/3 Final Enemy/2.floating/13.png',
    ];


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 4380 - 100 // (Endboss Width - Character Width); 
        this.animate();
    }


    /**
     * Checks endboss state to play animations in a loop
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);
    }
}

// TODO: Add come in animation
// TODO: Add endboss lifebar
// TODO: Add endboss following logic