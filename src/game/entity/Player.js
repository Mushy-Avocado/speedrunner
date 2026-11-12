import { ReplayRecorder } from "../replay/ReplayRecorder";
import { SimpleBody } from "./SimpleBody";

class Player extends SimpleBody {
    constructor(levelData, grid) {
        super(50, 0, 20, 30);
        this.levelData = levelData;
        this.grid = grid;
        this.replayRecorder = new ReplayRecorder();
    }

    fixedUpdate(deltaTime) {
        this.replayRecorder.fixedUpdate();
        
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
        super.fixedUpdate(deltaTime, this.levelData, this.grid);
    }

    updateControls(keyboard) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        if (keyboard.key("KeyA")) {
            this.isMovingLeft = true;
        }
        if (keyboard.key("KeyD")) {
            this.isMovingRight = true;
        }
        if (keyboard.keyDown("Space") && this.isGrounded) {
            this.isQueuedJumping = true;
        }
        this.replayRecorder.setInput(this.isMovingLeft, this.isMovingRight, this.isQueuedJumping, false);

    }
    
    render(ctx) {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}



export { Player };