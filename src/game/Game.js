import { SceneManager } from './scenes/SceneManager';
import { MainLoop } from './MainLoop';
import { FixedLoop } from './FixedLoop';
import { CanvasDisplay } from './CanvasDisplay';
import { Keyboard, Mouse } from './Input';

class Game extends SceneManager {

    constructor(scenes) {
        super(scenes);
        this.canvas = document.getElementsByTagName("canvas")[0];
        this.display = new CanvasDisplay(this.canvas, 600, 400);
        this.keyboard = new Keyboard();
        this.mouse = new Mouse(this.canvas);
        this.ctx = this.display.ctx;
        this.display.updateSize();
        this.mainLoop = new MainLoop(() => {
            if (this.isPaused) this.mainLoop.deltaTime = 0;
            this.display.updateSize();
            this.update(this.mainLoop.deltaTime);
            this.ctx.save();
            this.display.applyScaling();
            this.ctx.fillStyle = "#264d8e";
            this.ctx.fillRect(0, 0, this.display.width, this.display.height);
            this.render(this.ctx);
            this.ctx.restore();
            this.keyboard.endFrame();
            this.mouse.endFrame();
        });
        this.fixedLoop = new FixedLoop(() => {
            this.fixedUpdate(this.fixedLoop.deltaTime);
        });
        this.isPaused = false;
    }

    load(sceneName) {
        this.mouse.setCamera(null);
        super.load(sceneName);
    }

    start(sceneName) {
        this.load(sceneName);
        this.mainLoop.start();
        this.fixedLoop.start();
    }

    stop() {
        this.mainLoop.stop();
        this.fixedLoop.stop();
    }

    pause() {
        this.isPaused = true;
        this.fixedLoop.stop();
    }

    resume() {
        this.isPaused = false;
        this.fixedLoop.start();
    }

}

export { Game };