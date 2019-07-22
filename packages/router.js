import { Message } from "./message";
import { BreadCrumbs } from "./breadcrumbs";
import { DOM } from "./DOM";
import $model from "./model";
import appConfig from "../app.config.js";

export class Router {

  constructor(validRoutes)
  {

    this.routes = [];
    this.lastRoute = {last: window.location.pathname};
    this.BreadCrumbs = new BreadCrumbs();

    validRoutes.forEach(route => {
      this.routes.push(route);
    });

    this.addEvents();
    this.checkCurrentURL();

  }

  //? This is called when a route event is called
  push(route, params=null)
  {
    
    //? returns a matched route
    const matched = this.routes.filter(r => {

      return r.path == route;

    })[0];
    //? checks if route was matched
    if (matched) {
      
      this.match(matched, route, params);

    }
    else {
      return Message.log("E", "SYSTEM :: Error with route", route+" Invalid route passed to router");
    }
    
  }

  //? This will start building up the view
  match(_view, route, params)
  {

    //? now start the build view life cycle
    try {

      //? iset the URL      
      window.history.replaceState("", route, route);
      window.scrollTo(0, 0);
      
      //? pass the view to the buildView method
      DOM.buildView(new _view.handler(params), () => {        
        
        //? check for route attributes
        this.checkForRoutes();

        //? setup breadcrumbs
        this.setupBreadCrumbs(route)

      }, true);      

    } catch (error) {
      Message.log(
        "E",
        "Failed to Build View",
        error
      );
    }

  }

  //? Checks if the url is a valid route
  checkCurrentURL()
  {

    //? get current path and params if any
    const currentPATH = window.location.pathname.split(":")[0];
    const currentPARAMS = window.location.pathname.split(":")[1];
    
    //? check if current path is the root, if so, route
    if (currentPATH === "/") { this.push("/"); }
    else {

      //? if the url passed has params
      if (window.location.pathname.indexOf(":") > -1) {
        
        let route = this.routes.filter(r => {    

          if ((r.path.indexOf(":") > -1) && (r.path.slice(0, r.path.indexOf(":")) == currentPATH)) {
            return r;
          }

        })[0];
        
        //? check that route was matched
        if (route) {

          //? get the identifier from the path
          let paramsIdentifier = route.path.split(":")[1];

          //? build up the props object
          let props = {};
          props[paramsIdentifier] = currentPARAMS;

          //? route with props
          this.push(route.path, props);
  
        }
        else {
          return Message.log("E", "SYSTEM :: 404", "['"+window.location.pathname+"'] Is not a valid route");
        }        

      }
      //? the url passed no params
      else {

        let route = this.routes.filter(r => {
          return r.path == currentPATH;
        })[0];
        
        //? check that route was matched
        if (route) this.push(route.path);
        else return Message.log("E", "SYSTEM :: 404", "['"+window.location.pathname+"'] Is not a valid route");

      }

    }

  }

  //? sets up all events needed
  addEvents()
  {

    //? detect the back/forward button
    window.onpopstate = (e) => {       
      this.checkCurrentURL();
    };

    //? goBack Event
    document.addEventListener("goBack", () => {
      if (this.lastRoute.last != "/") {
        this.BreadCrumbs.back();
        this.push(this.lastRoute.last);        
      }      
    });
    
    //? route Event
    document.addEventListener("route", (e) => {      
      this.push($model.events.data.routePath, $model.events.data.routeData);
    });
    
    //? route Event
    document.addEventListener("checkRoutes", (e) => {      
      this.checkForRoutes();
    });

  }

  //? Sets up the Breadcrumbs
  setupBreadCrumbs(route)
  {
    //? gets the lastRoute object
    this.lastRoute = this.BreadCrumbs.addNew(route);    
  }

  //? Checks for the route attr on a element and adds a click event listener to it
  checkForRoutes()
  {

    //? get all elements with the route attr
    let routeAttr = document.body.querySelectorAll('[route]');    

    //? get each ones route value
    routeAttr.forEach(value => {
      
      let element = value;
      let self = this;
      let attrVal = element.attributes.route.value;

      //? If attrVal is a route
      if ( (element.hasAttribute("event") == false) && (attrVal != "back") ) {
        element.setAttribute("event","route-handler");
        element.style = "cursor:pointer;";
        element.addEventListener("click", function() {
          
          //? get current path and params if any
          const currentPATH = attrVal.split(":")[0];
          const currentPARAMS = attrVal.split(":")[1];

          //? check if current path is the root, if so, route
          if (currentPATH === "/") { self.push("/"); }
          else {
            //? if the url passed has params
            if (window.location.pathname.indexOf(":") > -1) {
              
              let route = self.routes.filter(r => {    

                if ((r.path.indexOf(":") > -1) && (r.path.slice(0, r.path.indexOf(":")) == currentPATH)) {
                  return r;
                }

              })[0];
              
              //? check that route was matched
              if (route) {

                //? get the identifier from the path
                let paramsIdentifier = route.path.split(":")[1];

                //? build up the props object
                let props = {};
                props[paramsIdentifier] = currentPARAMS;

                //? route with props
                self.push(route.path, props);

              }
              else {
                return Message.log("E", "SYSTEM :: 404", "['"+currentPATH+"'] Is not a valid route");
              }        

            }
            //? the url passed no params
            else {
              
              let route = self.routes.filter(r => {
                return r.path == currentPATH;
              })[0];
              
              //? check that route was matched
              if (route) self.push(route.path);
              else return Message.log("E", "SYSTEM :: 404", "['"+currentPATH+"'] Is not a valid route");

            }
          }
        });
      }
      //? If attrVal is to go back
      else if ( (element.hasAttribute("event") == false) && (attrVal == "back") ) {        
        element.setAttribute("event","back-handler");
        element.style = "cursor:pointer;";
        element.addEventListener(
          "click",
          function() {
            if (self.lastRoute.last != appConfig.baseView) {
              self.BreadCrumbs.back();
              self.push(self.lastRoute.last);
            }           
          }
        );
      }        

    });

  }  

  //? Checks for the back attr on a element and adds a click event listener to it
  checkForBack()
  {

    // get all elements with the route attr
    document.body.querySelectorAll('[return]').forEach(value => {

      let element = value;
      let self = this;
      let attrVal = element.attributes.route.value;

      if (element.hasAttribute("event") == false) {
        element.setAttribute("event","back-handler");
        element.addEventListener("click",() => self.push(attrVal));
      }         

    });

  }

}