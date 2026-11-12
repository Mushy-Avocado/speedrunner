class MainLoop {

    deltaTime = 0;
    previousFrameTime = performance.now();

    constructor(callback) {
        this.callback = callback;
    }

    start() {
        this.frame = requestAnimationFrame(() => {
            this.start();
        });
        this.deltaTime = (performance.now() - this.previousFrameTime) / 1000;
        this.previousFrameTime = performance.now();
        this.callback();
    }

    stop() {
        cancelAnimationFrame(this.frame);
    }

}

export { MainLoop };