

// Tell webpack to use the style sheet
// No inclusion inside the HTML file itself
import "./style.css";
import run from "./game/run";

// Main entry point for webpack
// In VSCode its configured to build and run when F5 is pressed
// Webpack is configured to combine all files into a single one for the build

run();
