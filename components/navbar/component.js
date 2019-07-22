import { Component } from "../../packages/component";
import compModel from "./comp.model";

export class navbar extends Component {

  constructor()
  {

    super(compModel);

    this.Render(`
      <div id="navbar_wrapper" class="shadow-sm">
        <div class="nav_header d-flex flex-col flex-center flex-align">
          <h2 class="text-xl-boldest">Quantum JS</h2>
        </div>
        <div class="nav_options">
          <div class="nav_option d-flex flex-align">
            <div class="opt_icon text-lg">
              <i class="fas fa-play"></i>
            </div>
            <div class="opt_view text-left" route="/getting-started">Getting Started</div>
          </div>
          <div class="nav_option d-flex flex-align">
            <div class="opt_icon text-lg">
              <i class="fas fa-indent"></i>
            </div>
            <div class="opt_view text-left" route="/adding-quantum">Adding Quantum JS</div>
          </div>
          <div class="nav_option d-flex flex-align">
            <div class="opt_icon text-lg">
              <i class="fas fa-road"></i>
            </div>
            <div class="opt_view text-left" route="/routing">Routing</div>
          </div>
          <div class="nav_option d-flex flex-align">
            <div class="opt_icon text-lg">
              <i class="fas fa-cube"></i>
            </div>
            <div class="opt_view text-left" route="/hello-world">Hello World</div>
          </div>
          <div class="nav_option d-flex flex-align">
            <div class="opt_icon text-lg">
              <i class="fas fa-gamepad"></i>
            </div>
            <div class="opt_view text-left" route="/view-controller">View Controller</div>
          </div>
          <div class="nav_option d-flex flex-align">
            <div class="opt_icon text-lg">
              <i class="fas fa-box-open"></i>
            </div>
            <div class="opt_view text-left" route="/view-model">View Model</div>
          </div>
          <div class="nav_option d-flex flex-align">
            <div class="opt_icon text-lg">
              <i class="fas fa-file-contract"></i>
            </div>
            <div class="opt_view text-left" route="/data-binding">Data Binding</div>
          </div>
          <div class="nav_option d-flex flex-align">
            <div class="opt_icon text-lg">
              <i class="fas fa-boxes"></i>
            </div>
            <div class="opt_view text-left" route="/state-management">State Management</div>                     
          </div>
          <div class="nav_option d-flex flex-align">
            <div class="opt_icon text-lg">
              <i class="fas fa-puzzle-piece"></i>
            </div>
            <div class="opt_view text-left" route="/components">Components</div>
          </div>
        </div>
      </div>
    `);

  }

}
