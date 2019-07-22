import $components from "../shared/$components";

const $model = {
  components: $components,
  interfaces: [],
  DOMBinding: [],
  compMethods: {},
  events: {
    data: {
      crumb: null,
      routePath: null,
      emitters:{}
    },
    route: new Event("route"),
    goBack: new Event("goBack"),
    addCrumb: new Event("addCrumb"),
    checkRoutes: new Event("checkRoutes"),
    removeLastCrumb: new Event("removeLastCrumb"),
  }
};

export default $model;