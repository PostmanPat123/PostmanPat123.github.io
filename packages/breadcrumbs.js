import $model from "./model";
export class BreadCrumbs {

  constructor()
  {
    this.crumbs = [];
    this.last;
    this.mode;
    this.crumbsObj = {};

    this.setupCrumbs();
  }

  setupCrumbs()
  {

    //? Adds a crumb to the breadcrumbs Event
    document.addEventListener("addCrumb", () => {
      this.addNew($model.events.data.crumb, true);
    });

    //? Adds a crumb to the breadcrumbs Event
    document.addEventListener("removeLastCrumb", () => {
      this.removeLast();
      this.previousRoute();      
    });

  }

  //? adds a route to the crumbs
  addNew(route, isString=false)
  {
    if (isString == false) {
      this.crumbs.push(route);
      return this.previousRoute();
    }
    else {
      this.crumbs.push(route.path);
      return this.previousRoute();
    }
  }

  //? sets up the previous route
  previousRoute()
  {    
    //? Setup the last route
    if (this.crumbs.length > 1) {
      this.crumbsObj.last = this.crumbs[this.crumbs.length - 1];
    }
    else {
      this.crumbsObj.last = this.crumbs[0];
    }
    
    return this.crumbsObj;
  }

  /*
   ? Removes the last crumb from breadcrumbs
  */
  removeLast()
  {
    this.crumbs.pop();
  }

  //? removes last route from crumbs and sets up the previous route
  back()
  {
    this.removeLast();
    this.previousRoute();        
  }

}