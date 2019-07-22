import { View } from "../../packages/ViewClass";
import appConfig from "../../app.config";


//* Your VIEW MODEL
import viewModel from "./app.model";

//* Your VIEW CONTROLLER
export class helloWorld extends View {

  constructor(props)
  {
    //? always call super passing the view model first
    super(viewModel);

    //? pass an HTML template
    this.render(
      appConfig.viewsFolder+
      viewModel.options.folderName+
      viewModel.options.view
    );
    
  }

  //* called each time the view is updated
  viewDidUpdate(props)
  {
       

  }

  //* called when the view has been initialized
  viewInitialized()
  {    

  }

  //* All your methods can go below -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=  

}