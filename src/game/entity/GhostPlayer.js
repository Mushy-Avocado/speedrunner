import { Player } from "./Player";

class GhostPlayer extends Player {

    constructor(replayStream, x, y) {
        super(replayStream.level, x, y);
        this.replayStream = replayStream;
    }

    updateControls() {
        if (this.replayStream.isFinished) return;
        const input = this.replayStream.getInput();
        this.isMovingLeft = input[0];
        this.isMovingRight = input[1];
        this.isQueuedJumping = input[2];
    }

    fixedUpdate(deltaTime) {
        if (this.replayStream.isFinished) return;
        super.fixedUpdate(deltaTime);
        this.replayStream.fixedUpdate();
    }

    render(ctx) {
        super.render(ctx);
    }

}

export { GhostPlayer };