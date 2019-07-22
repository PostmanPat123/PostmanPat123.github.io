import { View } from "../../packages/ViewClass";
import appConfig from "../../app.config";


//* Your VIEW MODEL
import _viewModel from "./app.model";

//* Your VIEW CONTROLLER
export class viewModel extends View {

  constructor(props)
  {
    //? always call super passing the view model first
    super(_viewModel);

    //? pass an HTML template
    this.render(
      appConfig.viewsFolder+
      _viewModel.options.folderName+
      _viewModel.options.view
    );
    
  }

  //* called each time the view is updated
  viewDidUpdate(props)
  {
       

  }

  //* called when the view has been initialized
  viewInitialized(props)
  {    
    
  }

  //* All your methods can go below -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=  

}