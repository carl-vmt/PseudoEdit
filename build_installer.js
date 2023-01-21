const { MSICreator } = require("electron-wix-msi");
const path = require("path");

const APP_DIR = path.resolve(__dirname, "./PseudoEdit-win32-x64");
const OUT_DIR = path.resolve(__dirname, "./windows_installer");

const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,
  description: "CodeEditor for PseudoCode",
  exe: "PseudoEdit",
  name: "PseudoEdit",
  manufacturer: "Carl Mutius",
  version: "1.0.0",
  icon: path.join(
    "C:",
    "Users",
    "mutiu",
    "repos",
    "PseudoEdit",
    "src",
    "resources",
    "icon.ico"
  ),

  ui: {
    chooseDirectory: true,
  },
});

msiCreator.create().then(function () {
  msiCreator.compile();
});
