
// DO NOT CHANGE once in production
// Replay data relies on the same value to reproduce the same results
const FIXED_DELTA_TIME = 1 / 20;

class FixedIntervalCallback {
    deltaTime = FIXED_DELTA_TIME;
    previousFrameTime = performance.now();
    accumulatedFrameDebt = 0;

    // Makes sure physics dont run for too long
    maxFrameTime = 0.25;
    maxUpdates = 5;

    constructor(callback) {
        this.callback = callback;
    }

    // Returns true if the maximum number of updates was reached, usually caused by lag
    update(timestamp) {
        const currentTime = timestamp;
        const elapsed = (currentTime - this.previousFrameTime) / 1000;
        this.previousFrameTime = currentTime;

        this.accumulatedFrameDebt += Math.min(elapsed, this.maxFrameTime);

        let updates = 0;

        while (this.accumulatedFrameDebt >= this.deltaTime) {
            this.callback(this.deltaTime);
            this.accumulatedFrameDebt -= this.deltaTime;
            updates++;
            if (updates >= this.maxUpdates) {
                return true;
            }
        }

        return false;
    }
}

export { FixedIntervalCallback, FIXED_DELTA_TIME };