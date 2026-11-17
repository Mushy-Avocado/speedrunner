
const dateUtil = {
    formatMs(ms) {
        const d = new Date(ms);
        return `${d.getMinutes()}:${String(d.getSeconds()).padStart(2, "0")}.${String(d.getMilliseconds()).padStart(3, "0")}`;
    },
};

export default dateUtil;