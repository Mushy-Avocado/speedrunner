const TILE_ID = {
    EMPTY: 0,
    GRASS: 1,
    DIRT: 2,
    GOAL: 3,
};

function createTileBehavior() {

    const events = {};

    function invoke(event, ...args) {
        events[event]?.forEach((callback) => callback(...args));
    }

    return {
        [TILE_ID.GRASS]: {
            render(tile, ctx, x, y, width, height) {
                ctx.fillStyle = "green";
                ctx.fillRect(x, y, width, height);
            },
        },
        [TILE_ID.DIRT]: {
            render(tile, ctx, x, y, width, height) {
                ctx.fillStyle = "brown";
                ctx.fillRect(x, y, width, height);
            },
        },
        [TILE_ID.GOAL]: {
            isTrigger: true,
            trigger(body, x, y, tile) {
                invoke("goal", body);
            },
            render(tile, ctx, x, y, width, height) {
                ctx.fillStyle = "yellow";
                ctx.fillRect(x, y, width, height);
            },
        },
        listen(event, callback) {
            events[event] = events[event] || [];
            events[event].push(callback);
        },
    };

}

export { TILE_ID, createTileBehavior };