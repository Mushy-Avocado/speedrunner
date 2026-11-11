

class Keyboard {
    keys = {};
    pressedKeys = {};
    releasedKeys = {};

    constructor(target = window) {
        target.addEventListener("keydown", e => {
            if (!this.keys[e.code]) {
                this.pressedKeys[e.code] = true;
            }
            this.keys[e.code] = true;
        });

        target.addEventListener("keyup", e => {
            this.keys[e.code] = false;
            this.releasedKeys[e.code] = true;
        });
    }

    endFrame() {
        this.pressedKeys = {};
        this.releasedKeys = {};
    }

    key(key) {
        return !!this.keys[key];
    }

    keyDown(key) {
        return !!this.pressedKeys[key];
    }

    keyUp(key) {
        return !!this.releasedKeys[key];
    }
}

class Mouse {

    x = 0;
    y = 0;
    camera = null;
    screenX = 0;
    screenY = 0;
    buttons = {};
    pressedButtons = {};
    releasedButtons = {};

    constructor(canvas) {
        this.canvas = canvas;

        window.addEventListener("mousemove", (e) => {
            this.screenX = e.clientX;
            this.screenY = e.clientY;
        });

        window.addEventListener("mousedown", (e) => {
            if (!this.buttons[e.button]) {
                this.pressedButtons[e.button] = true;
            }
            this.buttons[e.button] = true;
        });

        window.addEventListener("mouseup", (e) => {
            this.buttons[e.button] = false;
            this.releasedButtons[e.button] = true;
        });

        canvas.addEventListener("contextmenu", e => e.preventDefault());
    }

    updatePosition() {

        const rect = this.canvas.getBoundingClientRect();
        const sx = (this.screenX - rect.left) * (this.canvas.width / rect.width);
        const sy = (this.screenY - rect.top) * (this.canvas.height / rect.height);
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

    endFrame() {
        this.pressedButtons = {};
        this.releasedButtons = {};
        this.updatePosition(); 
    }

    button(button = 0) {
        return !!this.buttons[button];
    }

    buttonDown(button = 0) {
        return !!this.pressedButtons[button];
    }

    buttonUp(button = 0) {
        return !!this.releasedButtons[button];
    }

    setCamera(camera) {
        this.camera = camera;
    }

    removeCamera() {
        this.camera = null;
    }
}

export { Keyboard, Mouse };