

class ReplayStream {

    inputFrameCount = 0;
    tileFrameCount = 0;
    currentInputIndex = 0;
    currentTileChangeIndex = 0;
    isInputFinished = false;
    isTilesFinished = false;

    static fromDecoded({ username, inputs, durations, tileChanges }, level) {
        return new ReplayStream(level, username, inputs, durations, tileChanges);
    }

    constructor(level, username, inputs, durations, tileChanges) {
        this.level = level;
        this.inputs = inputs;
        this.durations = durations;
        this.tileChanges = tileChanges;
        this.username = username;
    }

    getInput() {
        if (this.currentInputIndex >= this.durations.length) {
            return [false, false, false, false];
        }
        return this.inputs[this.currentInputIndex];
    }

    getUsername() {
        return this.username;
    }

    get isFinished() {
        return this.isTilesFinished && this.isInputFinished;
    }

    fixedUpdate() {
        this.inputFrameCount++;
        if (this.inputFrameCount >= this.durations[this.currentInputIndex]) {
            this.inputFrameCount -= this.durations[this.currentInputIndex];
            if (this.currentInputIndex < this.durations.length - 1) {
                this.currentInputIndex++;
            } else {
                this.isInputFinished = true;
            }
        }
        this.tileFrameCount++;
        if (this.currentTileChangeIndex < this.tileChanges.length) {
            if (this.tileFrameCount >= this.tileChanges[this.currentTileChangeIndex][2]) {
                const change = this.tileChanges[this.currentTileChangeIndex];
                this.level.setTileAt(change[0], change[1]);
                this.currentTileChangeIndex++;
            }
        } else {
            this.isTilesFinished = true;
        }
    }
    

}

export { ReplayStream };