import replaySaveUtil from "../util/replaySaveUtil";

class ReplayRecorder {
    inputs = [];
    durations = [];
    tileChanges = [];
    currentInput = 0;
    currentInputTimestamp = 0;
    frameCount = 0;

    setInput(left, right, up, down) {
        const newInput = replaySaveUtil.encodeInput(left, right, up, down);
        if (newInput !== this.currentInput) {
            const duration = this.frameCount - this.currentInputTimestamp;
            if (duration > 0) {
                this.inputs.push(this.currentInput);
                this.durations.push(duration);
            }
            this.currentInputTimestamp = this.frameCount;
            this.currentInput = newInput;
        }
    }

    recordTile(index, newTile) {
        this.tileChanges.push([index, newTile, this.frameCount]);
    }

    fixedUpdate() {
        this.frameCount++;
    }
}

export default ReplayRecorder;