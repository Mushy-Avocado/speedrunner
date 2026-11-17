
import { LevelRun } from "./LevelRun";
import { ReplayRecorder } from "./ReplayRecorder";
import { keyboardInput } from "./keyboardInput";
import replaySaveUtil from "../util/replaySaveUtil";

class RecordedLevelRun extends LevelRun {

    recorder = new ReplayRecorder();

    constructor(keyboard, display) {
        super(display);
        this.applyKeyboardInput = keyboardInput(keyboard);
    }

    update(deltaTime) {
        this.applyKeyboardInput(this.player.input);
        this.recorder.updateInput(this.player.input);
        super.update(deltaTime);
    }

    fixedUpdate(deltaTime) {
        super.fixedUpdate(deltaTime);
        this.recorder.fixedUpdate();
    }

    getSave() {
        this.recorder.finish(this.recorder.frameCount + 1);
        return replaySaveUtil.encode("MUSHY", this.recorder);
    }

}

export { RecordedLevelRun };