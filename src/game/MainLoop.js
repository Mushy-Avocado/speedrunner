class MainLoop {

    deltaTime = 0;
    previousFrameTime = performance.now();

    constructor(callback) {
        this.callback = callback;
    }

    start(timestamp = null) {
        this.frame = requestAnimationFrame(timestamp => {
            this.start(timestamp);
        });
        if (timestamp === null) return;
        this.deltaTime = (timestamp - this.previousFrameTime) / 1000;
        this.previousFrameTime = timestamp;
        this.callback(timestamp);
    }

    stop() {
        cancelAnimationFrame(this.frame);
    }

}

export { MainLoop };