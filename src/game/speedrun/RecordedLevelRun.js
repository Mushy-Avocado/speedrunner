
import { LevelRun } from "../level/LevelRun";
import { ReplayRecorder } from "./ReplayRecorder";
import { keyboardInput } from "./keyboardInput";

class RecordedLevelRun extends LevelRun {

    recorder = new ReplayRecorder();

    constructor(keyboard, display, completeCallback = () => {}, failCallback = () => {}) {
        super(display, completeCallback, failCallback);
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