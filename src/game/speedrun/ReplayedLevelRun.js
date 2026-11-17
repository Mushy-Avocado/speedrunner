import { LevelRun } from "./LevelRun";
import { ReplayStream } from "./ReplayStream";
import { replayInput } from "./replayInput";
import { replaySaveUtil } from "./replaySaveUtil";

class ReplayedLevelRun extends LevelRun {

    constructor(replay, display, completeCallback = () => {}, failCallback = () => {}) {
        super(display, completeCallback, failCallback);
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
        if (this.stream.isFinished && !this.isComplete && Math.abs(this.player.velocityX) + Math.abs(this.player.velocityY) < 50) {
            this.failCallback(false);
        }
    }

    getSave() {
        return true;
    }

}

export { ReplayedLevelRun };