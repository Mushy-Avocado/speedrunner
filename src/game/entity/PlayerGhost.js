import { Player } from "./Player";

// Overrides the controls from Player to use replay stream input instead of keyboard
// TODO: Add a LivePlayer, renamed this one to GhostPlayer. Make Player more basic
// Potentially add a Character class with simple movement methods
class PlayerGhost extends Player {

    constructor(replayStream, grid) {
        super(replayStream.levelData, grid);
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
        if (this.replayStream.isFinished) return;
        super.render(ctx);
    }

}

export { PlayerGhost };