
class UIData {
    input = {};
    output = {};

    addInput(key, element) {
        this.input[key] = element;
    }

    addOutput(key, element) {
        this.output[key] = element;
    }

    getInput(key) {
        return this.input[key]?.value;
    }

    setOutput(key, value) {
        if (this.output[key]) {
            if ("value" in this.output[key]) {
                this.output[key].value = String(value);
            } else {
                this.output[key].textContent = value;
            }
        }
    }
}

class UIEvents {
    listeners = {};

    listen(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }   
        this.listeners[event].push(callback);
    }

    unlisten(event, callback) {
        if (this.listeners[event]) {
            const index = this.listeners[event].indexOf(callback);
            if (index !== -1) {
                this.listeners[event].splice(index, 1);
            }
        }
    }

    invoke(event, ...args) {
        if (this.listeners[event]) {
            for (let callback of this.listeners[event]) {
                callback(...args);
            }
        }
    }
}

class UIMenu {
    
    data = new UIData();
    events = new UIEvents();

    constructor(container) {
        this.container = container;
        this.modals = {};
        const inputs = Array.from(container.querySelectorAll("[data-input]"));
        for (let input of inputs) {
            this.data.addInput(input.dataset.input, input);
        }
        const outputs = Array.from(container.querySelectorAll("[data-output]"));
        for (let output of outputs) {
            this.data.addOutput(output.dataset.output, output);
        }
        const modals = Array.from(container.querySelectorAll("[data-modal]"));
        for (let modal of modals) {
            this.modals[modal.dataset.modal] = modal;
            this.closeModal(modal.dataset.modal);
        }
        const buttons = Array.from(container.querySelectorAll("[data-action]"));
        for (let button of buttons) {
            const action = button.dataset.action;
            const mode = button.dataset.mode;
            button.addEventListener("click", () => {
                if (this.modals[action]) {
                    if (mode.startsWith("open")) {
                        if (mode === "open-overwrite") {
                            this.closeModal(button.closest("[data-modal]").dataset.modal);
                        }
                        this.openModal(action);
                    }
                    else if (mode === "close") {
                        this.closeModal(action);
                    }
                }
                this.events.invoke(action);
            });
        }
        this.close();
    }

    query(str) {
        return this.container.querySelector(str);
    }

    openModal(modal) {
        this.modals[modal].showModal();
        return this.modals[modal];
    }

    closeModal(modal) {
        this.modals[modal].close();
        return this.modals[modal];
    }

    open() {
        this.container.classList.remove("ui-closed");
        this.container.classList.add("ui-open");
    }

    close() {
        this.container.classList.add("ui-closed");
        this.container.classList.remove("ui-open");
    }

}

class UIManager {
    
    currentSceneName = null;

    constructor() {
        this.container = document.getElementById("ui");
        for (let element of this.container.querySelectorAll("[data-modal]")) {
            const dialogue = document.createElement("dialog");
            dialogue.dataset.modal = element.dataset.modal;
            delete element.dataset.modal;
            element.parentElement.appendChild(dialogue);
            element.remove();
            dialogue.appendChild(element);
            dialogue.closedBy = "any";
        }
        this.menus = {};
        
        const menus = Array.from(this.container.querySelectorAll(":scope > [data-scene]"));
        for (let menu of menus) {
            this.menus[menu.dataset.scene] = new UIMenu(menu);
        }
    }

    openScene(scene) {
        this.sceneUI?.close();
        this.currentSceneName = scene;
        this.sceneUI?.open();
    }

    get sceneUI() {
        return this.menus[this.currentSceneName];
    }

    getSceneUI(name) {
        return this.menus[name];
    }

    applyScaling(display) {
        this.container.style.width = display.width + "px";
        this.container.style.height = display.height + "px";
        const scaleInfluence = 0.5;
        const scale = 1 + (display.scale - 1) * scaleInfluence;
        this.container.style.transform = `scale(${scale})`;
        this.container.style.transformOrigin = "top left";
        this.container.style.position = "absolute";
        this.container.style.left = display.x + "px";
        this.container.style.top = display.y + "px";
    }

}
        

export { UIManager };