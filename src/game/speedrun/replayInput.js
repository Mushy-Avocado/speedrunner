
function replayInput(stream) {

    return function(characterInput) {
        characterInput.set(...stream.getInput());
    }

}

export { replayInput };