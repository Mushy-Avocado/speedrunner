import { Scene } from './Scene';
import { PerformanceMetric } from '../PerformanceMetric';
import { DebugUI } from '../ui/DebugUI';
import { Grid } from "../level/Grid";

// Data
import { levelCodes } from '../data/levelCodes';
import { TILE_ID } from "../data/tileBehavior";

// Util
import tileDataUtil from "../util/tileDataUtil";
import dateUtil from "../util/dateUtil";

import { Speedrun } from "../speedrun/Speedrun";
import { ReplayedLevelRun } from "../speedrun/ReplayedLevelRun";
import { RecordedLevelRun } from "../speedrun/RecordedLevelRun";



class LevelScene extends Scene {

    createSession() {

        const recorder = new RecordedLevelRun(this.game.keyboard, this.game.display);
        const playback = new ReplayedLevelRun("TVVTSFk=;LApEmHBNBWHR0CEoBAZGwA~1qmhtfe", this.game.display);
        const speedrun = new Speedrun(recorder, playback);
        speedrun.loadLevels(levelCodes, new Grid(30));

        return {
            speedrun,
        };

    }

    load(session) {

        session = session ?? this.createSession();
        this.speedrun = session.speedrun; 

        this.performanceMetric = new PerformanceMetric("Performance");
        this.debugUI = new DebugUI();
        this.debugUI.addMetric(this.performanceMetric);
        
        this.selectedTile = tileDataUtil.setId(TILE_ID.EMPTY, TILE_ID.GRASS);
        this.game.mouse.setCamera(this.speedrun.recorder.camera);
    }

    render(ctx, alpha) {
        this.speedrun.render(ctx, alpha);
        this.debugUI.render(ctx);
    }

    update(deltaTime) {
        this.performanceMetric.startFrame();

        this.speedrun.update(deltaTime);

        if (this.game.keyboard.keyDown("KeyR")) {
            console.log(this.speedrun.recorder.getSave());
        }
    }

    fixedUpdate(deltaTime) {
        this.speedrun.fixedUpdate(deltaTime);
    }

}

export { LevelScene };