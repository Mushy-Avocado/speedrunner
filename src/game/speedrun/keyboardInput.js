
function keyboardInput(keyboard) {
    
    return function(characterInput) {
        let left = false;
        let right = false;
        let up = false;
        if (keyboard.key("KeyA")) {
            left = true;
        }
        if (keyboard.key("KeyD")) {
            right = true;
        }
        if (keyboard.key("Space")) {
            up = true;
        }
        characterInput.set(left, right, up);
    };
}

export { keyboardInput };