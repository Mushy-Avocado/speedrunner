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

    load(game) {
        this.fixedUpdateMetric = new PerformanceMetric("Fixed Loop");
        this.mainLoopMetric = new PerformanceMetric("Main Loop");
        this.debugUI = new DebugUI();
        this.debugUI.addMetric(this.mainLoopMetric);
        this.debugUI.addMetric(this.fixedUpdateMetric);
        
        this.selectedTile = tileDataUtil.setId(TILE_ID.EMPTY, TILE_ID.GRASS);
        
        const levelFactory = prefabs.getLevelPrefab(levels[0].code, 30, tileTypes);
        this.level = levelFactory.chunked();
        this.ghostLevel = levelFactory.chunked();
        
        const playerFactory = prefabs.getPlayerPrefab(50, 50);
        this.player = playerFactory.live(this.level);
        this.ghost = playerFactory.ghost(this.ghostLevel, window.replays[0]);
        
        this.camera = new Camera(game.display);
        this.camera.setCenter(game.display.width / 2, game.display.height / 2);
        game.mouse.setCamera(this.camera);
        
        this.game = game;
    }

    render(ctx) {
        ctx.save();
        this.camera.applyTransform();

        if (this.ghost) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            this.ghostLevel.render(ctx, this.camera);
            this.ghost.render(ctx);
            ctx.restore();
            this.mainLoopMetric.timer("Replay render");
        }
        
        this.level.render(ctx, this.camera);
        this.player.render(ctx);
        this.mainLoopMetric.timer("Live render");

        ctx.restore();

        this.debugUI.render(ctx);
    }

    update(deltaTime) {
        this.mainLoopMetric.startFrame();

        this.level.update(deltaTime, this.camera);
        this.ghostLevel.update(deltaTime, this.camera);
        this.mainLoopMetric.timer("Level update");

        this.player.updateControls(this.game.keyboard);
        if (this.ghost) {
            this.ghost.updateControls();
        }
        this.mainLoopMetric.timer("Player update");

        if (this.game.mouse.buttonDown(0)) {
            const gridX = this.level.grid.worldToCell(this.game.mouse.x);
            const gridY = this.level.grid.worldToCell(this.game.mouse.y);
            this.level.setTile(gridX, gridY, this.selectedTile);
            this.player.replayRecorder.recordTile(this.level.getIndex(gridX, gridY), this.selectedTile);
        }
        if (this.game.keyboard.keyDown("KeyS")) {
            console.log(replaySaveUtil.encode("MUSHY", this.player.replayRecorder));
        }

    }

    fixedUpdate(deltaTime) {

        this.fixedUpdateMetric.startFrame();

        this.player.fixedUpdate(deltaTime);
        if (this.ghost) {
            this.ghost.fixedUpdate(deltaTime);
        }

        this.fixedUpdateMetric.timer("Player fixed update");

        this.level.fixedUpdate(deltaTime, this.camera);
        this.ghostLevel.fixedUpdate(deltaTime, this.camera);

        this.fixedUpdateMetric.timer("Level fixed update");

    }

}

export { LevelScene };