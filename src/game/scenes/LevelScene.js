import { Scene } from './Scene';
import { PerformanceMetric } from '../PerformanceMetric';
import { DebugUI } from '../ui/DebugUI';
import { levels } from '../data/levels';
import { tileTypes, TILE_ID } from "../data/tileTypes";

import replaySaveUtil from "../util/replaySaveUtil";
import tileDataUtil from "../util/tileDataUtil";
import prefabs from "./prefabs";

import { Camera } from "../Camera";

class LevelScene extends Scene {

    load() {
        this.performanceMetric = new PerformanceMetric("Performance");
        this.debugUI = new DebugUI();
        this.debugUI.addMetric(this.performanceMetric);
        
        this.selectedTile = tileDataUtil.setId(TILE_ID.EMPTY, TILE_ID.GRASS);
        
        const levelFactory = prefabs.getLevelPrefab(levels[0].code, 30, tileTypes);
        this.level = levelFactory.chunked();
        this.ghostLevel = levelFactory.chunked();
        
        const playerFactory = prefabs.getPlayerPrefab(50, 50);
        this.player = playerFactory.live(this.level);
        this.ghost = playerFactory.ghost(this.ghostLevel, window.replays[0]);
        
        this.camera = new Camera(this.game.display);
        this.camera.setCenter(this.game.display.width / 2, this.game.display.height / 2);
        this.game.mouse.setCamera(this.camera);
    }

    render(ctx, alpha) {
        ctx.save();
        this.camera.applyTransform();

        if (this.ghost) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            this.ghostLevel.render(ctx, this.camera);
            this.ghost.render(ctx, alpha);
            ctx.restore();
            this.performanceMetric.timer("Replay render");
        }
        
        this.level.render(ctx, this.camera);
        this.player.render(ctx, alpha);
        this.performanceMetric.timer("Live render");

        ctx.restore();

        this.debugUI.render(ctx);
    }

    update(deltaTime) {
        this.performanceMetric.startFrame();

        this.ghost.updateControls();
        this.player.updateControls(this.game.keyboard);
        if (this.game.mouse.buttonDown(0)) {
            const gridX = this.level.grid.worldToCell(this.game.mouse.x);
            const gridY = this.level.grid.worldToCell(this.game.mouse.y);
            this.level.setTile(gridX, gridY, this.selectedTile);
            this.player.replayRecorder.recordTile(this.level.getIndex(gridX, gridY), this.selectedTile);
        }
        if (this.game.keyboard.keyDown("KeyS")) {
            console.log(replaySaveUtil.encode("MUSHY", this.player.replayRecorder));
        }

        this.performanceMetric.timer("Input");

        this.level.update(deltaTime, this.camera);
        this.ghostLevel.update(deltaTime, this.camera);
        this.performanceMetric.timer("Level update");

        this.player.update(deltaTime);
        this.performanceMetric.timer("Player update");
        if (this.ghost) {
            this.ghost.update(deltaTime);
        }
        this.performanceMetric.timer("Replay update");

    }

    fixedUpdate(deltaTime) {

        this.player.fixedUpdate(deltaTime);
        this.level.fixedUpdate(deltaTime, this.camera);
        
        this.performanceMetric.timer("Live fixed update");
        
        if (this.ghost) {
            this.ghost.fixedUpdate(deltaTime);
            this.ghostLevel.fixedUpdate(deltaTime, this.camera);
            this.performanceMetric.timer("Replay fixed update");
        }


    }

}

export { LevelScene };