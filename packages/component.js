import { Message } from "./message";
import { DOM } from "./DOM";
import { BIND } from "./BIND";

export class Component {

  constructor(compModel)
  {
    
    //* styles fileName
    this.style = (compModel.options.hasOwnProperty("style"))? compModel.options.style : "";

    //* folderName for current view
    this.folderName = (compModel.options.hasOwnProperty("folderName"))? compModel.options.folderName : "";

    //* model for the current component
    this.props = compModel.props;

    //* template for the current component
    this.template = null;

    //? Setup the model for the component
    this.buildModel(compModel);

  }

  Render(DATA) { this.template = DATA; }

  //? sets up the component properties on the controller
  buildModel(compModel) {

    //? if you have scoped data
    if (compModel.props) {

      Object.entries(compModel.props).forEach(property => {

        //? sets the scoped data on your current controller
        if (this.props[property[0]] == undefined) {
          this[property[0]] = property[1];
        }
  
      });
    }
    else {

      Message.log(
        "E",
        "SYSTEM :: Missing property in component model",
        "Your component model is missing the parameter 'props'"
      );

    }

  }  

}