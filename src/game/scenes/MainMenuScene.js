import { Scene } from "./Scene";
import { validateReplay } from "../speedrun/validateReplay";
import { Grid } from "../level/Grid";
import dateUtil from "../util/dateUtil";

class MainMenuScene extends Scene {

    load(data) {
        const sceneUI = this.game.ui.sceneUI;
        this.sceneUI = sceneUI;
        sceneUI.events.listen("start-validate-replay", () => {
            const replay = sceneUI.data.getInput("replay-validation-data");
            const levelCodes = data.levelCodes;
            this.validateTask = validateReplay(replay, this.game.display, levelCodes, new Grid(30));
            this.validateTask.promise.then(ms => {
                sceneUI.data.setOutput("replay-validation-result", `Replay by ${this.validateTask.username} is valid.\r\nTime: ${dateUtil.formatMs(ms)}`);
            }).catch(e => {
                sceneUI.data.setOutput("replay-validation-result", `Replay by ${this.validateTask.username} is invalid.\r\nReason: ` + e.message);
            });
        });
        sceneUI.events.listen("play", () => {
            this.game.load("level");
        });
    }

    render(ctx, alpha) {
        if (this.validateTask) {
            this.sceneUI.data.setOutput("replay-validation-percent", Math.floor(this.validateTask.progress * 100));
            this.sceneUI.data.setOutput("replay-validation-progress", this.validateTask.progress);
        }
    }

}

export { MainMenuScene };