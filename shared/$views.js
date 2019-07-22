import { gettingStarted } from "../views/getting-started/app.controller.js";
import { addingQuantum } from "../views/adding-quantum/app.controller.js";
import { routing } from "../views/routing/app.controller.js";
import { helloWorld } from "../views/hello-world/app.controller.js";
import { viewController } from "../views/view-controller/app.controller.js";
import { viewModel } from "../views/view-model/app.controller.js";
import { dataBinding } from "../views/binding-data/app.controller.js";
import { stateManagement } from "../views/state-management/app.controller.js";

//* build up the routes here
//? @params (routeObject) {path: "", handler: Controller}
const $routes = [
  {path: "/", handler: gettingStarted},
  {path: "/getting-started", handler: gettingStarted},
  {path: "/adding-quantum", handler: addingQuantum},
  {path: "/routing", handler: routing},
  {path: "/hello-world", handler: helloWorld},
  {path: "/view-controller", handler: viewController},
  {path: "/view-model", handler: viewModel},
  {path: "/data-binding", handler: dataBinding},
  {path: "/state-management", handler: stateManagement},
];

export default $routes;
