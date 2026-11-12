
class PerformanceMetric {

    startTime = 0;
    startFrameTime = 0;
    frameTime = 0;
    timers = new Map();
    smoothing = 0.05;

    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    startFrame() {
        this.frameTime += (performance.now() - this.startFrameTime - this.frameTime) * this.smoothing;
        this.startFrameTime = performance.now();
        this.startTime = performance.now();
    }

    timer(name) {
        const elapsed = performance.now() - this.startTime;
        this.startTime = performance.now();
        if (!this.timers.has(name)) {
            this.timers.set(name, elapsed);
        } else {
            const previous = this.timers.get(name);
            this.timers.set(name, previous + (elapsed - previous) * this.smoothing);
        }
    }

}

export { PerformanceMetric };