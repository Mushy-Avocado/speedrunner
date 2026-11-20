
function keyboardInput(keyboard) {
    
    return function(characterInput) {
        let left = false;
        let right = false;
        let up = false;
        let down = false;
        if (keyboard.key("KeyA")) {
            left = true;
        }
        if (keyboard.key("KeyD")) {
            right = true;
        }
        if (keyboard.key("Space")) {
            up = true;
        }
        if (keyboard.key("ShiftLeft")) {
            down = true;
        }
        characterInput.set(left, right, up, down);
    };
}

export { keyboardInput };