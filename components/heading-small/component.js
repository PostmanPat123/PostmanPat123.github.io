import { Component } from "../../packages/component";
import compModel from "./comp.model";

export class smallHeading extends Component {

  constructor()
  {
    
    super(compModel);

    this.Render(`
      <div id="heading_subSmall">
        <h2>{{heading}}</h2>
      </div>
    `);

  }

}