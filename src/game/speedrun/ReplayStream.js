

class ReplayStream {

    inputFrameCount = 0;
    tileFrameCount = 0;
    currentInputIndex = 0;
    currentTileChangeIndex = 0;
    currentLevelIndex = 0;
    isLevelFinished = false;
    isInputFinished = false;
    isTilesFinished = false;

    static fromDecoded({ username, inputs, durations, tileChanges }, levels) {
        return new ReplayStream(username, inputs, durations, tileChanges, levels);
    }

    constructor(username, inputs, durations, tileChanges) {
        this.inputs = inputs;
        this.durations = durations;
        this.tileChanges = tileChanges;
        this.username = username;
        this.estimatedDuration = durations.reduce((a, b) => a + b, 0);
    }

    getInput() {
        if (this.currentInputIndex >= this.durations.length) {
            return [false, false, false, false];
        }
        return this.inputs[this.currentInputIndex];
    }

    get isFinished() {
        return this.isTilesFinished && this.isInputFinished;
    }

    totalFrames = 0;

    fixedUpdate(level) {
        if (!this.isFinished) {
            this.totalFrames++;
        }
        if (!this.isInputFinished) {
            this.inputFrameCount++;
            if (this.inputFrameCount >= this.durations[this.currentInputIndex]) {
                this.inputFrameCount -= this.durations[this.currentInputIndex];
                this.currentInputIndex++;
                if (this.currentInputIndex >= this.durations.length) {
                    this.isInputFinished = true;
                }
            }
        }
        if (!this.isTilesFinished) {
            this.tileFrameCount++;
            if (this.currentTileChangeIndex < this.tileChanges.length) {
                if (this.tileFrameCount >= this.tileChanges[this.currentTileChangeIndex][2]) {
                    const change = this.tileChanges[this.currentTileChangeIndex];
                    level.setTileAt(change[0], change[1]);
                    this.currentTileChangeIndex++;
                }
            } else {
                this.isTilesFinished = true;
            }
        }
    }
    

}

export { ReplayStream };