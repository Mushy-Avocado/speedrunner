
class Speedrun {

    constructor(recorder, playback) {
        this.recorder = recorder;
        this.playback = playback;
    }

    loadLevels(levelCodes, grid) {
        this.recorder.loadLevels(levelCodes, grid);
        if (this.playback) {
            this.playback.loadLevels(levelCodes, grid);
        }
    }

    update(deltaTime) {
        this.recorder.update(deltaTime);
        if (this.playback) {
            this.playback.update(deltaTime);
        }
    }

    fixedUpdate(deltaTime) {
        this.recorder.fixedUpdate(deltaTime);
        if (this.playback) {
            this.playback.fixedUpdate(deltaTime);
        }
    }

    render(ctx, alpha) {
        if (this.playback && this.recorder.levelIndex === this.playback.levelIndex) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            this.playback.render(ctx, alpha, this.recorder.camera);
            ctx.restore();
        }
        this.recorder.render(ctx, alpha, this.recorder.camera);   
    }

}

export { Speedrun };