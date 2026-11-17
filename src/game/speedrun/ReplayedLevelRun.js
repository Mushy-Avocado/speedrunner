import { LevelRun } from "./LevelRun";
import { ReplayStream } from "./ReplayStream";
import { replayInput } from "./replayInput";
import replaySaveUtil from "../util/replaySaveUtil";

class ReplayedLevelRun extends LevelRun {

    constructor(replay, display) {
        super(display);
        this.replay = replay;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.applyReplayInput(this.player.input);
    }

    loadLevels(levelCodes, grid) {
        this.stream = ReplayStream.fromDecoded(replaySaveUtil.decode(this.replay));
        this.applyReplayInput = replayInput(this.stream);
        super.loadLevels(levelCodes, grid);
    }

    fixedUpdate(deltaTime) {
        this.stream.fixedUpdate(this.currentLevel);
        super.fixedUpdate(deltaTime);
        this.fixedDelta = deltaTime;
        if (this.stream.isFinished && !this.isComplete && Math.abs(this.player.velocityX) + Math.abs(this.player.velocityY) < 50) {
            throw new Error("Player did not reach the goal.");
        }
    }

    getSave() {
        return this.stream.totalFrames * 1000 * this.fixedDelta;
    }

}

export { ReplayedLevelRun };