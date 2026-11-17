
class LevelRun {

    levels = [];
    levelIndex = 0;
    player = null;
    output = null;

    get currentLevel() {
        return this.levels[this.levelIndex];
    }

    constructor(display, completeCallback, failCallback) {
        this.camera = new Camera(display);
        this.completeCallback = completeCallback;
        this.failCallback = failCallback;
    }

    getSave() {
        return null;
    }

    createTileBehavior() {
        const tileBehavior = createTileBehavior();

        tileBehavior.listen("goal", body => {
            if (body === this.player) {
                this.levelIndex++;
                if (this.currentLevel) {
                    this.player = new Player(this.currentLevel, 50, 50);
                } else {
                    this.levelIndex--;
                    this.output = this.getSave();
                    this.completeCallback(this.output);
                    this.isComplete = true;
                }
            }
        });
        
        return tileBehavior;
    }

    loadLevels(levelCodes, grid) {
        const tileBehavior = this.createTileBehavior();
        for (let data of levelCodes) {
            const levelData = LevelData.fromDecoded(levelSaveUtil.decode(data.code));
            this.levels.push(new ChunkedLevel(levelData, grid, tileBehavior));
        }
        this.player = new Player(this.currentLevel, 50, 50);
    }

    render(ctx, alpha, camera) {
        ctx.save();
        const { x, y } = this.player.getRenderPosition(alpha);
        this.camera.setCenter(x, y);
        camera.applyTransform(ctx);
        this.currentLevel.render(ctx, camera);
        this.player.render(ctx, alpha);
        ctx.restore();
    }

    update(deltaTime) {
        this.currentLevel.update(deltaTime, this.camera);
        this.player.update(deltaTime);
    }

    fixedUpdate(deltaTime) {
        this.currentLevel.fixedUpdate(deltaTime, this.camera);
        this.player.fixedUpdate(deltaTime);
    }

}