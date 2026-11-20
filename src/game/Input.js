
const keys = new Set();

window.addEventListener("keydown", e => {
    keys.add(e.code);
});

window.addEventListener("keyup", e => {
    keys.delete(e.code);
});

class Keyboard {

    keys = new Set();
    pressedKeys = new Set();
    releasedKeys = new Set();

    startFrame() {
        for (let key of this.releasedKeys) {
            if (!this.keys.has(key)) {
                this.releasedKeys.delete(key);       
            }
        }
        for (let key of this.keys) {
            if (this.pressedKeys.has(key)) {
                this.pressedKeys.delete(key);
            }
            if (!keys.has(key)) {
                this.releasedKeys.add(key);
            }
        }
        this.keys.clear();
        for (let key of keys) {
            if (!this.keys.has(key)) {
                this.pressedKeys.add(key);
            }
            this.keys.add(key);
        }
    }

    key(key) {
        return this.keys.has(key);
    }

    keyDown(key) {
        return this.pressedKeys.has(key);
    }

    keyUp(key) {
        return this.releasedKeys.has(key);
    }
}

let screenX = 0;
let screenY = 0;
const buttons = new Set();

window.addEventListener("mousemove", e => {{
    screenX = e.clientX;
    screenY = e.clientY;
}});

window.addEventListener("mousedown", e => {
    buttons.add(e.button);
});

window.addEventListener("mouseup", e => {
    buttons.delete(e.button);
});

class Mouse {

    x = 0;
    y = 0;
    camera = null;
    buttons = new Set();
    pressedButtons = new Set();
    releasedButtons = new Set();

    constructor(canvas) {
        this.canvas = canvas;
        canvas.oncontextmenu = e => e.preventDefault();
    }

    updatePosition() {
        const rect = this.canvas.getBoundingClientRect();
        const sx = (screenX - rect.left) * (this.canvas.width / rect.width);
        const sy = (screenY - rect.top) * (this.canvas.height / rect.height);
        const cam = this.camera;
        if (!cam) {
            this.x = sx;
            this.y = sy;
            return;
        }
        const pos = cam.screenToWorld(sx, sy);
        this.x = pos.x;
        this.y = pos.y;
    }

    startFrame() {
        for (let button of this.releasedButtons) {
            if (!this.buttons.has(button)) {
                this.releasedButtons.delete(button);
            }
        }
        for (let button of this.buttons) {
            if (this.pressedButtons.has(button)) {
                this.pressedButtons.delete(button);
            }
            if (!buttons.has(button)) {
                this.releasedButtons.add(button);
            }
        }
        this.buttons.clear();
        for (let button of buttons) {
            if (!this.buttons.has(button)) {
                this.pressedButtons.add(button);
            }
            this.buttons.add(button);
        }
        this.updatePosition(); 
    }

    button(button = 0) {
        return this.buttons.has(button);
    }

    buttonDown(button = 0) {
        return this.pressedButtons.has(button);
    }

    buttonUp(button = 0) {
        return this.releasedButtons.has(button);
    }

    setCamera(camera) {
        this.camera = camera;
    }

    removeCamera() {
        this.camera = null;
    }
}

export { Keyboard, Mouse };