class SceneManager {
    constructor(scenes) {
        this.scenes = scenes;
        this.currentScene = null;
    }

    load(newScene) {
        if (this.currentScene) {
            this.currentScene.unload();
        }
        this.currentScene = this.scenes[newScene];
        this.currentScene?.load(this);
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

    render(ctx) {
        if (this.currentScene) {
            this.currentScene.render(ctx);
        }
    }
}

export { SceneManager };