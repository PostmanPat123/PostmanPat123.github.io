import { Component } from "../../packages/component";
import compModel from "./comp.model";

export class mainHeading extends Component {

  constructor()
  {
    
    super(compModel);

    this.Render(`
      <div id="main_heading">
        <h1>{{heading}}</h1>
      </div>
    `);

  }

}