import { ReplayRecorder } from "../replay/ReplayRecorder";
import { Player } from "./Player";

class LivePlayer extends Player {

    constructor(level, x, y) {
        super(level, x, y);
        this.replayRecorder = new ReplayRecorder();
    }

    fixedUpdate(deltaTime) {
        super.fixedUpdate(deltaTime);
        this.replayRecorder.fixedUpdate();
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
}

export { LivePlayer };