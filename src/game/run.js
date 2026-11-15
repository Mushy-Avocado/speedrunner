import { Game } from "./Game";
import { LevelScene } from "./scenes/LevelScene";

window.replays = [
    "TVVTSFk=;4BBpDGBQkCICAsgQBQQBoCAogQXIEFyBBggQaQIBYBAtAgRQED0HAKCwDQQKQYVoGBgBQMBYDQ8BIFoGAgCQMCIDARAwEoGB0-g4IICGJkYIICGqj4IICMgbjYIICGsi4IICFtiYIICGOh4IICB-x4IICE_B4IICCfR4IICCfh4IICB_x4IICCoCIIICCeR4IICIAeB4IICCtx4IICCdh4IICB9R4IICCoz4IICLAg~8fpr2o"
];


function run() {
    (new Game({
        level: new LevelScene(),
    })).start("level");
}

export { run };