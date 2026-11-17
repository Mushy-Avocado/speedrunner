
import { MainLoop } from './MainLoop';
import { FixedIntervalCallback } from './FixedIntervalCallback';
import { CanvasDisplay } from './CanvasDisplay';
import { Keyboard, Mouse } from './Input';

class Game {

    keyboard = new Keyboard();
    currentScene = null;

    constructor(scenes) {
        this.scenes = scenes;

        this.canvas = document.getElementsByTagName("canvas")[0];
        this.display = new CanvasDisplay(this.canvas, 600, 400);
        this.mouse = new Mouse(this.canvas);
        this.ctx = this.display.ctx;
        this.display.updateSize();
        
        // Updates inside the main loop at a fixed interval
        this.fixedLoop = new FixedIntervalCallback(() => {
            this.fixedUpdate(this.fixedLoop.deltaTime);
        });

        // Updates at the monitor refresh rate
        this.mainLoop = new MainLoop(timestamp => {
            this.display.updateSize();
            this.ctx.save();
            this.display.applyScaling();

            // Background
            this.ctx.fillStyle = "#264d8e";
            this.ctx.fillRect(0, 0, this.display.width, this.display.height);

            // Update (usually for input handling)
            this.update(this.mainLoop.deltaTime); 

            // Fixed update (usually for physics)
            this.fixedLoop.update(timestamp);

            // Rendering (calculate alpha value for smoothing)
            const alpha = Math.min(Math.max(this.fixedLoop.accumulatedFrameDebt / this.fixedLoop.deltaTime, 0), 1);
            this.render(this.ctx, alpha);

            this.ctx.restore();
            this.keyboard.endFrame();
            this.mouse.endFrame();
        });
    }
    
    load(newScene, data) {
        this.mouse.setCamera(null);
        if (this.currentScene) {
            this.currentScene.unload();
        }
        this.currentScene = this.scenes[newScene];
        if (this.currentScene) {
            this.currentScene.game = this;
            this.currentScene.load(data);
        }
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

    start(sceneName, data) {
        this.load(sceneName, data);
        this.mainLoop.start();
    }

    stop() {
        this.mainLoop.stop();
    }

}

export { Game };