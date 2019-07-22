import { Message } from "./message"

export class Store {

  constructor(storeObj, handler)
  {

    this.store;
    this.getters;
    this.events;
    this.state;

    this.setupStore(storeObj);

  }

  /*
    Sets up the store
  */

  setupStore(store)
  {

    let _this = this;

    //? setup getters and setters
    this.state = store.state;
    this.getters = store.getters;

    //? setup events
    this.events = {
      $state: this.state,
      $mutations: store.mutations,
      $actions: store.actions,
      Commit(name, payload) {
        return _this.commit(_this.events, name, payload);
      },
      Dispatch(name, payload) {
        return _this.dispatch(_this.events, name, payload);
      },
    }

    //? setup store
    this.store = {
      handler: null,
      state: _this.state,
      Get(propName, payload) {
        return _this.get(_this.events.$state, propName, payload);
      },
      Commit(name, payload) {
        return _this.commit(_this.events, name, payload);
      },
      Dispatch(name, payload) {
        return _this.dispatch(_this.events, name, payload);
      },
    }
  }

  /*
   ? Notifies the view once the state has been changed
  */
  notifyView()
  {

    if (this.store.handler != null) {
      this.store.handler.loadData(this.store.state);
    }

  }

  /*
   ? Called when you want to exicute a getter
   @params keyName - "nameOfGetter"
  */
  get(previousState, keyName, payload)
  {

    // get getters from store and run it
    let getter = this.checkIfPropExists(keyName, this.getters, "Getters");

    if (typeof getter === "function") {
      return getter(previousState, payload);
    }

  }

  /*
   ? Called when you want to exicute a mutation
   @params (payload) - "Name OF Function", {UserId: 5425}
  */
  commit(context, name, payload)
  {

    // get mutation from store and run it
    let mutation = this.checkIfPropExists(name, this.events.mutations, "Mutations");
    let check;

    if (typeof mutation === "function") {
      check = mutation(context, payload);
      this.notifyView();
    }

    if (check) {
      return check;
    }

  }

  /*
   ? Called when you want to exicute a mutation Async
   @params (payload) - "Name OF Function", {UserId: 5425}
  */
  dispatch(context, name, payload)
  {

    // get mutation from store and run it
    let self = this;
    let dispatch = this.checkIfPropExists(name, this.events.actions, "Actions");

    if (typeof dispatch === "function") {
      return dispatch(context, payload, () => {
        self.notifyView();
      });
    }

  }

  /*
   ? Checks if a method exists inside the store
  */
  checkIfPropExists(prop, obj, type)
  {

    let x;

    if (obj.hasOwnProperty(prop)) {

      x = obj[prop];

    }
    else {

      return Message.log(
        "E",
        "Error in State",
        "Failed to find property '"+prop+"' in '"+type+"'"
      );

    }

    return x;

  }

}
