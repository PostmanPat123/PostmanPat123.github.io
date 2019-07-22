import { Component } from "../../packages/component";
import compModel from "./comp.model";

export class imgComp extends Component {

  constructor()
  {
    
    super(compModel);

    this.Render(`
      <div class="imgTab">
        <div class="buttons"></div>
        <div class="buttons"></div>
        <div class="buttons"></div>
      </div>
      <div id="img_comp">        
        <img src="{{src}}">
      </div>
    `);

  }

}