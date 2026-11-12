class DebugUI {

    metrics = [];
    offsetY = 0;
    offsetX = 0;

    constructor(x = 10, y = 10) {
        this.x = x;
        this.y = y;
    }

    addMetric(metric) {
        this.metrics.push(metric);
    }

    renderMetric(ctx, metric) {
        const timerNames = Array.from(metric.timers.keys());
        ctx.fillStyle = "white";
        ctx.font = "6px sans-serif";
        ctx.fillText(metric.name + " | FPS: " + (1000 / metric.frameTime).toFixed(0) + " | Frame time: " + metric.frameTime.toFixed(3) + "ms", this.x, this.y + this.offsetY);
        if (metric.timers.size === 0) {
            return;
        }
        const totalTime = Array.from(metric.timers.values()).reduce((total, time) => total + time, 0);
        let offset = 0;
        for (let i = 0; i < timerNames.length; i++) {
            const time = metric.timers.get(timerNames[i]);
            const width = ((time * 1000) / (totalTime * 1000)) * 200;
            ctx.fillStyle = `hsl(${i / timerNames.length * 360}, 100%, 50%)`;
            ctx.fillRect(offset + this.x, this.y + this.offsetY + 5, width, 10);
            offset += width;
            ctx.fillText(timerNames[i] + ": " + metric.timers.get(timerNames[i]).toFixed(3) + "ms", this.x, i * 7 + this.y + this.offsetY + 22);
        }
        this.offsetY += 40;
    }

    render(ctx) {
        this.offsetX = 0;
        this.offsetY = 0;
        for (const metric of this.metrics) {
            this.renderMetric(ctx, metric);
        }
    }
}

export { DebugUI };