import appConfig from "../app.config.js";
import $events from "./events";
import $model from "./model";
import { Message } from "./message";
import { DOM } from "./DOM";
import { BIND } from "./BIND";
import { Store } from "./store";

export class View {

  constructor(viewObj)
  {

    //* render ele
    this.ele = (viewObj.options.hasOwnProperty("ele"))? viewObj.options.ele : this.defaultParamRequired("ele");
    
    //* styles fileName
    this.style  = (viewObj.options.hasOwnProperty("style"))? viewObj.options.style : "";

    //* folderName for current view
    this.folderName  = (viewObj.options.hasOwnProperty("folderName"))? viewObj.options.folderName : "";

    //* components for current view
    this.components  = (viewObj.options.hasOwnProperty("components"))? viewObj.options.components : "";

    //* current views template URL or HTML string
    this.template = null;

    //* project events
    this.$events = {
      emit: $events.emit,
      accept: $events.accept,
      goBack: $events.goBackEvent,
      route: $events.routeEvent,
      addCrumb: $events.addCrumbEvent,
      removeLastCrumb: $events.removeLastCrumbEvent,
    };

    //* loaded interfaces
    this.interface = {
      get(interfaceName) {
        if (appConfig.interfaces.length > 0) {
          let data = appConfig.interfaces.filter(int => {
            if (int.ref == interfaceName) {
              return int;
            }
          })[0];
          if (data) {            
            return data.interface;
          }
          else {
            return Message.log(
              "E",
              "SYSTEM :: Error while getting Interface",
              "'"+interfaceName+"' does not exist, or is not a valid interface"
            );
          }
        }
        else {
          return Message.log(
            "E",
            "SYSTEM :: Error while getting Interface",
            "You do not currently have any interfaces loaded"
          );
        }
      }
    };

    //* buildUp model
    this.buildModel(viewObj.state);

    //* projects state
    this.$state = $model.model.store;    

    //* setup the state callback method
    this.castViewUpdateCallback();
    
  }

  //? call this passing a URL or HTML template
  render(data) {
    this.template = data;
  }

  //? this allows the state to notify the view when it's updated
  castViewUpdateCallback()
  {

    const _this = this;
    this.$state.handler = 
    {
      loadData(props, updatedVal=false) {
        
        //? calls the view update method
        _this.viewDidUpdate(props);

        // //? get all interpolation
        // DOM.getAllInterpolation(document);
        
        //? check if let exists in data
        DOM.insertDOMValue(document.body, _this, updatedVal); 

        //? check for binding Reflect
        BIND.Reflect(_this);

        //? check for binding Bind
        BIND.Bind(_this);

        //? check for binding If
        BIND.If(_this);

        //! This does not need to be called because new methods cannot be added
        //! to your controller from state
        // BIND.On(this);

        // // update the DOM with the correct values
        // DOM.buildView(_this, () => {
        //   //? this makes sure all the route attributes work correctly       
        //   document.dispatchEvent($model.events.checkRoutes);
        // }, false);
      }
    };

  }  

  //? sets up the global and scoped properties on the controller
  buildModel(viewModel) {

    //? if you have scoped data
    if (viewModel.scoped) {

      Object.entries(viewModel.scoped).forEach(property => {

        //? sets the scoped data on your current controller
        if (this[property[0]] != undefined) {
          
        }
        else {
          this[property[0]] = property[1];
        }
  
      });
    }
    
    //? if you have global data
    if (viewModel.global) {

      Object.entries(viewModel.global).forEach(property => {

        //? checks if you have scoped data within your global data
        if (property[0] == "scoped") {
          appConfig.model.state[this.folderName] = {};    
          Object.entries(property[1]).forEach(scopedProp => {   
            appConfig.model.state[this.folderName][scopedProp[0]] = scopedProp[1];
          });          
        }
        
        //? sets the global data on your current controller
        if (appConfig.model.state[property[0]] == undefined && this[property[0]] == undefined) {          
          this[property[0]] = property[1];
        }
        
        //? sets the global data in the application state
        if (appConfig.model && appConfig.model.state[property[0]] == undefined) {
          if (property[0] != "scoped") {
            appConfig.model.state[property[0]] = property[1];
          }
        }
        //? if the property already exists in state set it in the controller
        else if (appConfig.model.state[property[0]] != undefined) {
          this[property[0]] = appConfig.model.state[property[0]];
        }
  
      });

    }

    //? if state is passed, initialize it
    if (appConfig.model) {
      $model.model = new Store(appConfig.model);
    }    

  }

  //? logs an error for missing params
  defaultParamRequired(missingParam)
  {   
    console.log("Your view was initialized without the "+missingParam+" parameter");    
  }

  //? sets the property provided to a value
  setState(UPDATE_OBJ, calledFromUpdateMethod=false) {

    Object.entries(UPDATE_OBJ).forEach(property => {

      const propertyName = property[0];
      const propertyValue = property[1];

      let schema = this;  // a moving reference to internal objects within obj
      let pList = propertyName.split('.');
      let len = pList.length;
      for(let i = 0; i < len-1; i++) {
          let elem = pList[i];
          if( !schema[elem] ) schema[elem] = {}
          schema = schema[elem];
      }   
  
      if (isNaN(Number(propertyValue))) {
        schema[pList[len-1]] = propertyValue;
      }
      else if (!isNaN(Number(propertyValue))) {
        schema[pList[len-1]] = propertyValue;
      }
      else {
        schema[pList[len-1]] = Number(propertyValue);
      } 
  
      if (calledFromUpdateMethod == false) {
        this.$state.handler.loadData(this.$state.state, propertyName);
      } 

    });
  }

  checkForComponentsInUse(CONTROLLER_TEMP, CONTROLLER, cb) {

    //? check if a component is in use
    if (this.components.length > 0) {      
      let count = 0;
      this.components.forEach(COMP_REF => {

        $model.components.forEach(COMP_OBJ => {

          if (COMP_REF == COMP_OBJ.ref) {            
            count++;
            //? component matched
            BIND.Component(new COMP_OBJ.component(), COMP_OBJ.ref, CONTROLLER_TEMP, count, (count) => {
              //? carry on with the view template              
              if (count == this.components.length) {
                cb();
                count = 0;
              }              
            });

          }
          // else {
          //   Message.log(
          //     "W",
          //     "WARNING :: Use of unregistered component ("+COMP_REF+")",
          //     COMP_REF+" is not a registered component in your application"
          //   );
          // }

        });

      });

    }
    //? no components used so just return back
    else {

      //* if callback is passed call it
      if (typeof cb == 'function') cb();

    }

  }

  

  //! DEPRICATED =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  //// this will call the setup method for components
  // setupComponents(HTML_TEMP)
  // {
  //   if (this.components.length > 0) {
  //     this.components.forEach(VIEW_COMP => {
        
  //       $model.components.forEach(LOADED_COMP => {
          
  //         if (LOADED_COMP.ID == VIEW_COMP) {
  //           DOM.buildComponents(LOADED_COMP, HTML_TEMP);
  //         }

  //       });      

  //     });
  //   }

  // }

}