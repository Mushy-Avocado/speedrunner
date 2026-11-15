class FixedIntervalCallback {
    deltaTime = 1 / 30;
    maxFrameTime = 0.25;
    maxUpdates = 5;
    previousFrameTime = performance.now();
    accumulatedFrameDebt = 0;

    constructor(callback) {
        this.callback = callback;
    }

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

export { FixedIntervalCallback };