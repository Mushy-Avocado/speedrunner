import { SimpleBody } from "./SimpleBody";
import { CharacterInput } from "./CharacterInput";

class Character extends SimpleBody {
    constructor(level, x, y, width, height) {
        super(x, y, width, height);
        this.level = level;
        this.input = new CharacterInput();
    }

    isMovingLeft = false;
    isMovingRight = false;
    isQueuedJumping = false;

    fixedUpdate(deltaTime) {
        this.input.applyCharacter(this);

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
        super.fixedUpdate(deltaTime, this.level);
    }

}

export { Character };