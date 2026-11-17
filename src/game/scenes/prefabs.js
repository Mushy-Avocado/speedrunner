import levelSaveUtil from '../util/levelSaveUtil';
import replaySaveUtil from '../util/replaySaveUtil';
import { LevelData } from '../level/LevelData';
import { Grid } from '../level/Grid';
import { ChunkedLevel } from '../level/ChunkedLevel';
import { FullLevel } from '../level/FullLevel';
import { Player } from '../entity/Player';
import { ReplayStream } from '../speedrun/ReplayStream';

// Easier way to create instances without importing a bunch of classes
const prefabs = {

    getLevelPrefab(code, gridSize, tileBehavior) {
        const grid = new Grid(gridSize);
        const decoded = levelSaveUtil.decode(code);
        return {
            chunked() {
                const levelData = LevelData.fromDecoded(decoded);
                return new ChunkedLevel(levelData, grid, tileBehavior);
            },
            full() {
                const levelData = LevelData.fromDecoded(decoded);
                return new FullLevel(levelData, grid, tileBehavior);
            },
        };
    },

};

export default prefabs;