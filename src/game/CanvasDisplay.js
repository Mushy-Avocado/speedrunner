import { Display } from "./Display";

class CanvasDisplay extends Display {

    constructor(canvas, width, height) {
        super(width, height);
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    updateSize() {
        const tw = window.innerWidth;
        const th = window.innerHeight;
        const rawScale = Math.min(tw / this.width, th / this.height);
        this.scale = Math.floor(rawScale * 10) / 10;
        this.canvas.width = Math.round(this.width * this.scale);
        this.canvas.height = Math.round(this.height * this.scale);
    }

    applyScaling() {
        this.ctx.scale(this.scale, this.scale);
    }

}

export { CanvasDisplay };