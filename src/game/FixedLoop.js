class FixedLoop {
    deltaTime = 1 / 30;
    maxFrameTime = 0.25;
    maxUpdates = 5;
    previousFrameTime = performance.now();
    accumulatedFrameDebt = 0;

    constructor(callback) {
        this.callback = callback;
    }

    start() {
        this.previousFrameTime = performance.now();
        this.interval = setInterval(() => {
            const currentTime = performance.now();
            const elapsed = (currentTime - this.previousFrameTime) / 1000;
            this.previousFrameTime = currentTime;

            this.accumulatedFrameDebt += Math.min(elapsed, this.maxFrameTime);

            let updates = 0;

            while (this.accumulatedFrameDebt >= this.deltaTime && updates < this.maxUpdates) {
                this.callback(this.deltaTime);
                this.accumulatedFrameDebt -= this.deltaTime;
                updates++;
            }
        }, this.deltaTime * 1000);
    }

    stop() {
        clearInterval(this.interval);
    }
}

export { FixedLoop };