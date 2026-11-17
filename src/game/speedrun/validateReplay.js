import { ReplayedLevelRun } from "./ReplayedLevelRun";
import { FIXED_DELTA_TIME } from "../FixedIntervalCallback";

function validateReplay(replay, display, levelCodes, grid) {
    let playback = null;
    return {
        get progress() {
            if (!playback || !playback.stream) {
                return 0;
            }
            return playback.stream.totalFrames / playback.stream.estimatedDuration;
        },
        get username() {
            return playback?.stream?.username ?? "Unknown User";
        },
        promise: new Promise((resolve, reject) => {
            playback = new ReplayedLevelRun(replay, display);
            playback.loadLevels(levelCodes, grid);
            const update = () => {
                try {
                    for (let i = 0; i < 5; i++) {
                        playback.update(0);
                        playback.fixedUpdate(FIXED_DELTA_TIME);
                        if (playback.output !== null) {
                            resolve(playback.output);
                            return;
                        }
                    }
                } catch(e) {
                    reject(e);
                    return;
                }
                requestAnimationFrame(() => update());
            };
            update();
        })
    };

}

export { validateReplay };