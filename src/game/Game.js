
import { MainLoop } from './MainLoop';
import { FixedIntervalCallback } from './FixedIntervalCallback';
import { CanvasDisplay } from './CanvasDisplay';
import { Keyboard, Mouse } from './Input';

class Game {

    constructor(scenes) {
        this.scenes = scenes;
        this.currentScene = null;
        this.canvas = document.getElementsByTagName("canvas")[0];
        this.display = new CanvasDisplay(this.canvas, 600, 400);
        this.keyboard = new Keyboard();
        this.mouse = new Mouse(this.canvas);
        this.ctx = this.display.ctx;
        this.display.updateSize();
        this.mainLoop = new MainLoop(timestamp => {
            this.display.updateSize();
            this.ctx.save();
            this.display.applyScaling();
            this.ctx.fillStyle = "#264d8e";
            this.ctx.fillRect(0, 0, this.display.width, this.display.height);
            this.update(this.mainLoop.deltaTime);
            this.fixedLoop.update(timestamp);
            const alpha = Math.min(Math.max(this.fixedLoop.accumulatedFrameDebt / this.fixedLoop.deltaTime, 0), 1);
            this.render(this.ctx, alpha);
            this.ctx.restore();
            this.keyboard.endFrame();
            this.mouse.endFrame();
        });
        this.fixedLoop = new FixedIntervalCallback(() => {
            this.fixedUpdate(this.fixedLoop.deltaTime);
        });
    }
    
    load(newScene) {
        this.mouse.setCamera(null);
        if (this.currentScene) {
            this.currentScene.unload();
        }
        this.currentScene = this.scenes[newScene];
        this.currentScene.game = this;
        this.currentScene?.load();
    }

    update(deltaTime) {
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    fixedUpdate(deltaTime) {
        if (this.currentScene) {
            this.currentScene.fixedUpdate(deltaTime);
        }
    }

    render(ctx, alpha) {
        if (this.currentScene) {
            this.currentScene.render(ctx, alpha);
        }
    }

    start(sceneName) {
        this.load(sceneName);
        this.mainLoop.start();
    }

    stop() {
        this.mainLoop.stop();
    }

}

export { Game };