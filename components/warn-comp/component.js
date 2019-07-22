import { Component } from "../../packages/component";
import compModel from "./comp.model";

export class warnComp extends Component {

  constructor()
  {
    
    super(compModel);

    this.Render(`
      <div id="warn_comp" class="">
        <h1>{{head}}</h1>
        <p>{{text}}</p>
      </div>
    `);

  }

}