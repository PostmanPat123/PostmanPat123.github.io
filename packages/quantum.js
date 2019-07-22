import appConfig from "../app.config.js";
import $model from "./model";
import { Message } from "./message";
import { Router } from "./router";
import { DOM } from "./DOM";

class quantum {

  constructor()
  {

    //? makes sure the required options are passed
    const check = this.validateOptions();

    //? add the model to the window
    if (check) {
      this.setupModel();
    }

    //? initialize project
    if (check) {
      this.initializeProject();
    }

    //? quantum has initialized
    if (check) {      
      this.quantumHasInitialized();
    }

  }

  //* Checks that your config file contains all the right settings
  validateOptions()
  {

    if (!appConfig.hasOwnProperty("name")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'name' parameter");
      return false;
    }

    if (!appConfig.hasOwnProperty("version")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'version' parameter");
      return false;
    }

    if (!appConfig.hasOwnProperty("build")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'build' parameter");
      return false;
    }

    if (!appConfig.hasOwnProperty("description")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'desciption' parameter");
      return false;
    }
    
    if (!appConfig.hasOwnProperty("baseView")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'baseView' parameter");
      return false;
    }
    
    if (!appConfig.hasOwnProperty("appWrapper")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'appWrapper' parameter");
      return false;
    }
    
    if (!appConfig.hasOwnProperty("viewsFolder")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'viewsFolder' parameter");
      return false;
    }

    if (!appConfig.hasOwnProperty("systemTheme")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'systemTheme' parameter");
      return false;
    }

    if (!appConfig.hasOwnProperty("systemStyles")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'systemStyles' parameter");
      return false;
    }

    if (!appConfig.hasOwnProperty("interfaces")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'interfaces' parameter");
      return false;
    }

    if (!appConfig.hasOwnProperty("model")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'model' parameter");
      return false;
    }

    if (!appConfig.hasOwnProperty("views")) {
      Message.log("E","SYSTEM :: missing option in appConfig", "Your appConfig file is missing the 'views' parameter");
      return false;
    }

    return true;

  }

  //* adds the model to the window object
  setupModel()
  {

    let m = $model;
    //? add interfaces to the model
    if (appConfig.interfaces.length != 0) {
      appConfig.interfaces.forEach(inter => {
        m.interfaces.push(inter);
      });        
    }

  }

  //* instantiates the router and initializes the project
  initializeProject()
  {    

    new Router(appConfig.views);

    DOM.SYSTEM_STYLES();

  }

  //* called once the project has initialized and displays an imformative log
  quantumHasInitialized()
  {

    const styles1 = "font-size:90%;padding: 2px;color:#fff;background-color:lightslategrey;border-radius: 3px 0 0 3px";
    const styles2 = "font-size:90%;padding: 2px;color:#fff;background-color:lightskyblue;border-radius:0 3px 3px 0;";

    const styles3 = "color:#fff;font-size:90%;padding: 2px;color:#fff;background-color:green;border-radius:3px;";
    const styles4 = "color:green;";
    const styles5 = "color:blue;";

    console.groupCollapsed("%c "+appConfig.name+" ("+appConfig.build+") %c V"+appConfig.version+" ", styles1, styles2);

    console.info("%c INFO ", styles3);    

    console.log("%cInitial View: "+"%c ["+appConfig.baseView+"]", styles4,styles5);      

      console.groupCollapsed("%cInterfaces Loaded: "+"%c ("+appConfig.interfaces.length+")", styles4,styles5);
      appConfig.interfaces.forEach(int => {
        console.groupCollapsed("%c- "+int.ref, styles5);
        console.dir(int.interface);
        console.groupEnd();
      });
      console.groupEnd();

      console.groupCollapsed("%cRoutes Loaded: "+"%c ("+appConfig.views.length+")", styles4,styles5);
      appConfig.views.forEach(route => {
        console.groupCollapsed("%c- "+route.path, styles5);
        console.dir(route.handler);
        console.groupEnd();
      });
      console.groupEnd();

      console.groupCollapsed("%cProject Description: ", styles4);
        console.info(appConfig.description);
      console.groupEnd();

      console.groupEnd();
    console.groupEnd();   

  }

}

//? wait till the document is ready
document.addEventListener("DOMContentLoaded", function() {

  try {    

    //?
    const _APPFILE_ = document.getElementById("_APPFILE_");

    if (appConfig.build == "development") {
      _APPFILE_.src = "./build/development/app.bundle.js";
    }
    else if (appConfig.build == "production") {
      _APPFILE_.src = "./build/production/app.bundle.js";
    }
    else {
      throw "The app 'build' type is an incorrect type. Types: ('production', 'development')";      
    }

    new quantum();

  } 
  catch (error) {
    Message.log("E","Initialization Failed", error);
  }

});

