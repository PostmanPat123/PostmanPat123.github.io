import { Component } from "../../packages/component";
import compModel from "./comp.model";

export class linkComp extends Component {

  constructor()
  {
    
    super(compModel);

    this.Render(`
      <button
      id="link_comp"
      class="text-white"
      route="{{router}}">
        {{label}}
      </button>
    `);

  }

}