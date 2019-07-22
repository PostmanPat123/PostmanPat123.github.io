import appConfig from "../../app.config";

export default {

  //? these are setup options
  options: {
    ele: "#app",
    style: "/layout/styles.css",
    view: "/layout/view.html",
    folderName: "getting-started",
    components: [
      "navbar",
      "heading-sub",
      "heading-main",
      "link-comp",
    ]
  },

  state: {

    //? this data will be scoped to the view controller
    "scoped": {
      viewName: "Getting Started"
    },

    //? this data can be accessed by other view controllers
    "global": {

    }

  },  

}