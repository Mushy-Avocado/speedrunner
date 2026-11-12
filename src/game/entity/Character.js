import { SimpleBody } from "./SimpleBody";

class Character extends SimpleBody {
    constructor(level, x, y, width, height) {
        super(x, y, width, height);
        this.level = level;
    }

    isMovingLeft = false;
    isMovingRight = false;
    isQueuedJumping = false;

    fixedUpdate(deltaTime) {
        if (this.isMovingLeft) {
            this.velocityX -= 2000 * deltaTime;
        }

        if (this.isMovingRight) {
            this.velocityX += 2000 * deltaTime;
        }

        this.applyFriction(5 * deltaTime, 0);
        
        if (this.isQueuedJumping) {
            this.isQueuedJumping = false;
            this.velocityY = -400;
        }
        super.fixedUpdate(deltaTime, this.level.data, this.level.grid);
    }

}

export { Character };