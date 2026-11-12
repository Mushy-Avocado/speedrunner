import { Bounds } from "./Bounds.js";

class Camera {

    zoom = 1;

    centerX = 0;
    centerY = 0;

    constructor(display) {
        this.display = display;
    }

    get viewport() {
        return new Bounds(
            this.centerX - this.display.width / (2 * this.zoom),
            this.centerY - this.display.height / (2 * this.zoom),
            this.display.width / this.zoom,
            this.display.height / this.zoom
        );
    }

    translate(x, y) {
        this.centerX += x;
        this.centerY += y;
    }

    setCenter(x, y) {
        this.centerX = x;
        this.centerY = y;
    }

    setZoom(zoom) {
        this.zoom = zoom;
    }

    worldToScreen(x, y) {
        const cx = this.display.width / 2;
        const cy = this.display.height / 2;
        return {
            x: ((x - this.centerX) * this.zoom + cx) * this.display.scale,
            y: ((y - this.centerY) * this.zoom + cy) * this.display.scale
        };
    }

    screenToWorld(x, y) {
        const cx = this.display.width / 2;
        const cy = this.display.height / 2;
        return {
            x: (x / this.display.scale - cx) / this.zoom + this.centerX,
            y: (y / this.display.scale - cy) / this.zoom + this.centerY
        };
    }

    applyTransform() {
        const cx = this.display.width / 2;
        const cy = this.display.height / 2;
        this.display.ctx.scale(this.zoom, this.zoom);
        this.display.ctx.translate(Math.floor(cx / this.zoom - this.centerX), Math.floor(cy / this.zoom - this.centerY));
    }
}

export { Camera };