import levelSaveUtil from '../util/levelSaveUtil';
import replaySaveUtil from '../util/replaySaveUtil';
import { LevelData } from '../level/LevelData';
import { Grid } from '../level/Grid';
import { ChunkedLevel } from '../level/ChunkedLevel';
import { FullLevel } from '../level/FullLevel';
import { GhostPlayer } from '../entity/GhostPlayer';
import { LivePlayer } from '../entity/LivePlayer';
import { ReplayStream } from '../replay/ReplayStream';

// Easier way to create instances without importing a bunch of classes
const prefabs = {

    getLevelPrefab(code, gridSize, tileTypes) {
        const grid = new Grid(gridSize);
        const decoded = levelSaveUtil.decode(code);
        return {
            chunked() {
                const levelData = LevelData.fromDecoded(decoded);
                return new ChunkedLevel(levelData, grid, tileTypes);
            },
            full() {
                const levelData = LevelData.fromDecoded(decoded);
                return new FullLevel(levelData, grid, tileTypes);
            },
        };
    },

    getPlayerPrefab(x, y) {

        return {
            ghost(level, code) {
                const replayData = replaySaveUtil.decode(code);
                return new GhostPlayer(ReplayStream.fromDecoded(replayData, level), x, y);
            },
            live(level) {
                return new LivePlayer(level, x, y);
            },
        };  

    },

};

export default prefabs;