import { Component } from "../../packages/component";
import compModel from "./comp.model";

export class subHeading extends Component {

  constructor()
  {
    
    super(compModel);

    this.Render(`
      <div id="sub_heading">
        <h1>{{heading}}</h1>
      </div>
    `);

  }

}