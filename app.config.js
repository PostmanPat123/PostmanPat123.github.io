//? state
import appState from "./shared/$app.state";

//? interfaces
import $interfaces from "./shared/$interfaces";

//? views
import $views from "./shared/$views";

//? config
export default {

  "name": "Test App",
  "version": "1.0.0",
  "build": "development",
  "description": "This is a test application",
  "baseView": "/",
  "appWrapper": "#app",
  "viewsFolder": "./views/",
  "compsFolder": "./components/",
  "systemTheme": "project-theme",
  "systemStyles": ['messages', 'anamations', 'views'],
  "interfaces": [...$interfaces],
  "model": appState,
  "views": $views,

}