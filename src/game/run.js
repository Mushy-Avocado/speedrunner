import LevelData from "./level/LevelData";
import Grid from "./level/Grid";
import ChunkLoader from "./level/ChunkLoader";
import Player from "./entity/Player";
import CanvasDisplay from "./CanvasDisplay";
import Camera from "./Camera";
import { Keyboard, Mouse } from "./Input";
import MainLoop from "./MainLoop";
import FixedLoop from "./FixedLoop";
import tileDataUtil from "./util/tileDataUtil";
import { TILE_ID, tileData } from "./data/tileData";
import ReplayStream from "./replay/ReplayStream";
import PlayerGhost from "./entity/PlayerGhost";
import levelSaveUtil from "./util/levelSaveUtil";
import replaySaveUtil from "./util/replaySaveUtil";

class FrameTimeMetric {

    startTime = 0;
    startFrameTime = 0;
    frameTime = 0;
    timers = new Map();
    smoothing = 0.05;

    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    endFrame() {
        this.frameTime += (performance.now() - this.startFrameTime - this.frameTime) * this.smoothing;
        this.startFrameTime = performance.now();
    }

    startTimer() {
        this.startTime = performance.now();
    }

    endTimer(name) {
        const elapsed = performance.now() - this.startTime;
        if (!this.timers.has(name)) {
            this.timers.set(name, elapsed);
        } else {
            const previous = this.timers.get(name);
            this.timers.set(name, previous + (elapsed - previous) * this.smoothing);
        }
    }

}

class DebugUI {

    metrics = [];
    offsetY = 0;
    offsetX = 0;

    constructor(x = 10, y = 10) {
        this.x = x;
        this.y = y;
    }

    addMetric(metric) {
        this.metrics.push(metric);
    }

    renderMetric(ctx, metric) {
        const timerNames = Array.from(metric.timers.keys());
        ctx.fillStyle = "white";
        ctx.font = "6px sans-serif";
        ctx.fillText(metric.name + " | FPS: " + (1000 / metric.frameTime).toFixed(0) + " | Frame time: " + metric.frameTime.toFixed(3) + "ms", this.x, this.y + this.offsetY);
        if (metric.timers.size === 0) {
            return;
        }
        const totalTime = Array.from(metric.timers.values()).reduce((total, time) => total + time, 0);
        let offset = 0;
        for (let i = 0; i < timerNames.length; i++) {
            const time = metric.timers.get(timerNames[i]);
            const width = ((time * 1000) / (totalTime * 1000)) * 200;
            ctx.fillStyle = `hsl(${i / timerNames.length * 360}, 100%, 50%)`;
            ctx.fillRect(offset + this.x, this.y + this.offsetY + 5, width, 10);
            offset += width;
            ctx.fillText(timerNames[i] + ": " + metric.timers.get(timerNames[i]).toFixed(3) + "ms", this.x, i * 7 + this.y + this.offsetY + 22);
        }
        this.offsetY += 40;
    }

    render(ctx) {
        this.offsetX = 0;
        this.offsetY = 0;
        for (const metric of this.metrics) {
            this.renderMetric(ctx, metric);
        }
    }
}

function run() {

    const mainLoopMetrics = new FrameTimeMetric("Main Loop", 10, 10);
    const fixedLoopMetrics = new FrameTimeMetric("Fixed Loop", 10, 50);
    const debugUI = new DebugUI();
    debugUI.addMetric(mainLoopMetrics);
    debugUI.addMetric(fixedLoopMetrics);
    
    const levelCode = "60;AAAAAAAAAlgACAAAAAACWA~1802lis~1sjqxnu";
    const levelData = levelSaveUtil.decode(levelCode);
    const ghostLevelData = levelSaveUtil.decode(levelCode);
    
    const grid = new Grid(30);
    const chunks = new ChunkLoader(levelData, tileData, grid);
    const ghostChunks = new ChunkLoader(ghostLevelData, tileData, grid);
    const stream = ReplayStream.fromData(ghostLevelData, ghostChunks, replaySaveUtil.decode("TVVTSFk=;4BBpDGBQkCICAsgQBQQBoCAogQXIEFyBBggQaQIBYBAtAgRQED0HAKCwDQQKQYVoGBgBQMBYDQ8BIFoGAgCQMCIDARAwEoGB0-g4IICGJkYIICGqj4IICMgbjYIICGsi4IICFtiYIICGOh4IICB-x4IICE_B4IICCfR4IICCfh4IICB_x4IICCoCIIICCeR4IICIAeB4IICCtx4IICCdh4IICB9R4IICCoz4IICLAg~8fpr2o"));


    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");




    const display = new CanvasDisplay(canvas, 600, 400);
    const camera = new Camera(display);
    const keyboard = new Keyboard();
    const mouse = new Mouse(canvas);


    function loadChunks() {

        let totalTasks = 0;
        let startTime = Date.now();

        (async function() {
            const chunkLoad = chunks.queueLoadAll(camera.centerX, camera.centerY);
            totalTasks += chunks.loadQueue.length;
            await chunkLoad;
            console.log("Loading complete in " + (Date.now() - startTime) + "ms");
        })();

        return {
            update() {
                chunks.update();
            },
            get progress() {
                const completedTasks = totalTasks - chunks.loadQueue.length;
                const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
                return progress;
            },
        };
    }

    
    camera.setCenter(display.width / 2, display.height / 2);
    mouse.setCamera(camera);
    
    let selectedTile = tileDataUtil.setId(TILE_ID.EMPTY, TILE_ID.GRASS);
    
    const player = new Player(levelData, grid);
    let ghost = null;
    if (stream) {
        ghost = new PlayerGhost(stream, grid);
    }
    
    const chunkLoader = loadChunks();

    function loaderMain() {
        display.updateSize();

        ctx.save();
        display.applyScaling();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, display.width, display.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, display.width * chunkLoader.progress, display.height);
        ctx.restore();

        chunkLoader.update();

        if (chunkLoader.progress >= 1) {
            loaderLoop.stop();
            mainLoop.start();
            physicsLoop.start();
        }

    }

    function main() {

        display.updateSize();


        ctx.save();
        display.applyScaling();
        ctx.save();
        camera.applyTransform();

        ctx.fillStyle = "#264d8e";
        ctx.fillRect(0, 0, display.width, display.height);

        if (mouse.buttonDown(0)) {
            const gridX = grid.worldToCell(mouse.x);
            const gridY = grid.worldToCell(mouse.y);
            levelData.setTile(gridX, gridY, selectedTile);
            player.replayRecorder.recordTile(levelData.getIndex(gridX, gridY), selectedTile);
            chunks.setDirty(gridX, gridY);
        }

        if (keyboard.keyDown("KeyS")) {
            console.log(replaySaveUtil.encode("MUSHY", player.replayRecorder));
        }

        mainLoopMetrics.startTimer();

        ghostChunks.update(camera);
        ghostChunks.render(ctx, camera, 0.4);

        mainLoopMetrics.startTimer();
        chunks.render(ctx, camera);
        mainLoopMetrics.endTimer("Chunks");


        mainLoopMetrics.startTimer();
        player.updateControls(keyboard);
        player.render(ctx);
        
        if (ghost) {
            mainLoopMetrics.startTimer();
            ghost.updateControls();
            ghost.render(ctx);
        }
        mainLoopMetrics.endTimer("Player");
        
        ctx.restore();
        debugUI.render(ctx);
        ctx.restore();

        mouse.endFrame();
        keyboard.endFrame();
        
        
        mainLoopMetrics.endFrame();

    }

    function fixedUpdate() {

        player.fixedUpdate(physicsLoop.deltaTime);
        
        
        if (ghost) {
            ghost.fixedUpdate(physicsLoop.deltaTime);
        }
        
        fixedLoopMetrics.endFrame();
    }

    const mainLoop = new MainLoop(main);
    const physicsLoop = new FixedLoop(fixedUpdate);
    const loaderLoop = new MainLoop(loaderMain);
    loaderLoop.start();
    
}

export default run;