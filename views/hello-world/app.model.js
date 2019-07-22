import appConfig from "../../app.config";

export default {

  //? these are setup options
  options: {
    ele: "#app",
    style: "/layout/styles.css",
    view: "/layout/view.html",
    folderName: "hello-world",
    components: [
      "navbar",
      "heading-sub",
      "heading-main",
      "heading-small",
      "link-comp",
      "img-comp",
    ]
  },

  state: {

    //? this data will be scoped to the view controller
    "scoped": {},

    //? this data can be accessed by other view controllers
    "global": {}

  },  

}