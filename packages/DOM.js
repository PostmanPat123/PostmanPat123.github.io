import { viewDirectives, bindDirective, onDirective } from "./directives";
import appConfig from "../app.config.js";
import { BIND } from "./BIND";
import { Message } from "./message";
import { Lib } from "./lib";
import $model from "./model";

export const DOM = {
  
  //* This is the setup method which builds up your views
  //? params (HANDLER, callback) - View Controller, callback method, calls the update method
  buildView(HANDLER, callback)
  {

    //? cast the view to a global variable for global access
    window.$scope = HANDLER;
    
    //? determins if a URL or HTML was passed to the render method
    DOM.getTemplate(HANDLER.template, (HTML_TEMP) => {      

      //? checks if you have any components in use
      HANDLER.checkForComponentsInUse(HTML_TEMP, HANDLER, async () => {
        
        //? get all interpolation in the template and make sure a valid template is passed
        if (HTML_TEMP.activeElement) await DOM.getAllInterpolation(HTML_TEMP);
        else {
          Message.log("E", "SYSTEM BUILD :: Invalid Template", "An invalid HTML Document was passed")
        }      

        //* Check that you have a viewDidUpdate method in your controller
        if (HANDLER.viewDidUpdate == undefined) Message.log("E", "SYSTEM :: Error while building view", "Your view Controller does not contain a viewDidUpdate() Method");

        //* Initialise View      
        if (HANDLER.viewInitialized != undefined) HANDLER.viewInitialized(HANDLER.$state.state);
        else Message.log("E", "SYSTEM :: Error while building view", "Your view Controller does not contain a viewInitialized() Method");

        //? check if let exists in data
        // DOM.insertDOMValue(HTML_TEMP, HANDLER);

        DOM.insertDOMValue(HTML_TEMP, HANDLER);

        //* Render your view
        DOM.RENDER(HANDLER, HTML_TEMP);      

        //? check for binding Reflect
        BIND.Reflect(HANDLER);

        //? check for binding Bind
        BIND.Bind(HANDLER);

        //? check for binding If
        BIND.If(HANDLER);

        //? check for binding on
        BIND.On(HANDLER);

        //* After View has Initialised
        if (HANDLER.viewDidInitialize != undefined) HANDLER.viewDidInitialize(HANDLER.$state.state);      

        //* if callback is passed call it
        if (typeof callback == 'function') callback();

      });      

    });    

  },  

  //* Returns an HTML Document based on a URL or template string
  //? @params (HANDLER_TEMP, HANDLER_NAME, callback)
  //?           - URL or string HTML
  //?           - The name of your view handler
  //?           - a callback function
  getTemplate(HANDLER_TEMP, callback, isComp=false)
  {

    //? URL passed
    if (HANDLER_TEMP.indexOf("<") == -1) {
      
      Lib.getFileContents({url:HANDLER_TEMP, type: "document"}, (err, html) => {

        if (err) {
          Message.log(
            "E", 
            "Error while getting HTML Document", 
            "Make sure the folder name in your View Controller matches the folder your view is in <error> -> "+html
          )
        }
        else {
          if (isComp == false) {
            this.replaceDirective(html);
          }
          callback(html);
        }

      });

    }
    //? HTML passed
    else {      
      let parser = new DOMParser();
      let HTML_TEMPLATE = parser.parseFromString(HANDLER_TEMP, "text/html");
      if (isComp == false) {
        this.replaceDirective(HTML_TEMPLATE);
      }
      callback(HTML_TEMPLATE);

    }

  },

  //* Replaces all viewDirectives with a predifined attributes
  //? @params (template) - HTML Document
  replaceDirective(template)
  {
    /*
    ? loop through the viewDirectives and replace all
    ? accurances of that directive with the value
    */ 

    let allEle = template.body.getElementsByTagName("*");    
    for (let element = 0; element < allEle.length; element++) {
      let ele = allEle[element];      
      let innerhtml = allEle[element].innerHTML;
      
      Object.entries(viewDirectives).forEach(directive => {

        let key = directive[0];
        let value = directive[1];

        if (ele.hasAttribute(key)) {       
          //? get attr value
          let attrVal = ele.attributes[key].value;

          //? set new attribute
          ele.removeAttribute(key)
          ele.setAttribute(value, attrVal);

        }
      });

    }
    
  },

  //* Gets all elements with {{variable}} and adds an attribute with 'variable' as it's value
  //? @params (template) - HTML Document
  getAllInterpolation(template)
  {

    let regex = /{{([^}]+)}}/g;
    let rxp = regex;
    let varMatch;    
    
    let allEle = template.body.getElementsByTagName("*");

    //? this makes sure that all inputs get updated as well
    for (let element = 0; element < allEle.length; element++) {
      let ele = allEle[element];
      let REF = BIND.getRandowString(7);  
      let innerhtml = allEle[element].innerHTML;

      if (ele.hasAttribute("vm-wOUrX40")) {
        let attrVal = allEle[element].attributes["vm-wOUrX40"].value;
        let newEle = {
          el: ele, 
          binding: attrVal.replace(/ /g,''),
          ref: "qm-"+REF,
          type: "html"
        };
        $model.DOMBinding.push(newEle);
      }

      //? this gets all the elements with interpolation in the attributes
      Object.entries(ele.attributes).forEach(attr => {
        while( varMatch = rxp.exec( attr[1].nodeValue ) ) {
          //? make sure the element is not a container
          if (!ele.firstElementChild) {
            let newEle = {
              el: ele, 
              binding: varMatch[1].replace(/ /g,''),
              ref: "qm-"+REF,
              type: "attribute",
              attrName: attr[1].nodeName,
              attrValue: attr[1].nodeValue
            };
            $model.DOMBinding.push(newEle);          
          }  
        }

      });

      //? this gets all the elements with interpolation inside
      while( varMatch = rxp.exec( innerhtml ) ) {
        //? make sure the element is not a container
        if (!ele.firstElementChild) {
          let newEle = {
            el: ele, 
            binding: varMatch[1].replace(/ /g,''),
            ref: "qm-"+REF,
            type: "html"
          };
          $model.DOMBinding.push(newEle);          
        }  
      }          
      
    }

    //? set the "qm" attribute with the property as a value
    $model.DOMBinding.forEach(eleObj => {
      if (eleObj.type == "html") {
        eleObj.el.setAttribute(eleObj.ref, "");
        eleObj.el.innerHTML = ""; 
      }
      else if (eleObj.type == "attribute") {
        eleObj.el.setAttribute(eleObj.ref, "");
        eleObj.el.attributes[eleObj.attrName].value = ""; 
      } 
    });

  },  
  
  //* Gets all interpolation and sets an attribute to bind
  //? @params (template, HANDLER) - HTML Document, View Controller
  setBracketVal(attrVal, element, HANDLER, isAttr=false, attribute=false)
  {
    
    if (attrVal.indexOf(".") > -1) {
      
      let keys = attrVal.split(".");
      let script = eval("(HANDLER."+attrVal+")");
      
      if (script != undefined) {

        //? check if its an input
        if (element.localName == "input") {
          //? set inputs value
          if (isAttr == false) {
            element.defaultValue = script;
            element.value = script;
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = script;
          }          
        }
        else if (element.localName == "img") {
          //? set img value
          element.src = script;            
        }
        else if (element.localName == "textarea") {
          //? set img value
          element.defaultValue = script;            
        }
        else {
          //? set elements innerHTML
          if (isAttr == false) {
            element.innerHTML = script;
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = script;
          }          
        }
        
      }
      else {
        return Message.log(
          "E" ,
          "Error While Replacing {{"+attrVal.replace(/ /g,'')+"}}", 
          "Property '"+keys[0].replace(/ /g,'')+"."+keys[1].replace(/ /g,'')+"' is not defined on your View Controller"
        );
      }

    }
    else {
      
      if (HANDLER[attrVal] != undefined) {
      
        //? check if its an input
        if (element.localName == "input") {
          //? set inputs value
          if (isAttr == false) {
            element.value = HANDLER[attrVal];
            element.defaultValue = HANDLER[attrVal];
            //! element.placeholder = $model.view[attrVal];
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = HANDLER[attrVal];
          }
          
        }
        else {
          //? set elements innerHTML
          if (isAttr == false) {
            element.innerHTML = HANDLER[attrVal];
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = HANDLER[attrVal];
          }          
        }

      }
      else if (HANDLER[attrVal+"_comp"] != undefined) {
      
        //? check if its an input
        if (element.localName == "input") {
          //? set inputs value
          if (isAttr == false) {
            element.value = HANDLER[attrVal+"_comp"];
            element.defaultValue = HANDLER[attrVal+"_comp"];
            //! element.placeholder = $model.view[attrVal];
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = HANDLER[attrVal+"_comp"];
          }
        }
        else {
          console.log(element);
          
          //? set elements innerHTML
          if (isAttr == false) {
            element.innerHTML = HANDLER[attrVal+"_comp"];
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = HANDLER[attrVal+"_comp"];
          } 
        }

      }
      else {
        return Message.log(
          "E", 
          "Error While Replacing {{"+attrVal.replace(/ /g,'')+"}}", 
          "Property '"+attrVal.replace(/ /g,'')+"' is not defined on your View Controller"
        );
      }
    }

  },

  //* Gets all element bindings in the template and only applies an update to them when the controller value changes
  //? @params (template, HANDLER, updatedProp) - HTML Document, View Controller, Controller Property
  insertDOMValue(template, HANDLER, updatedProp=false) {
    
    //? if the updated element was passed
    if (updatedProp != false) {
      //? get element bindings which update "updatedProp"
      const ELE_BINDING = $model.DOMBinding.filter(BINDING => {

        return BINDING.binding == updatedProp;

      });      
      
      if (ELE_BINDING.length > 0) {
        ELE_BINDING.forEach(binding => {          
          
          document.querySelectorAll("["+binding.ref+"]").forEach(element => {

            if (binding.type == "html") {
              DOM.setBracketVal(binding.binding, element, HANDLER);
            }
            else if (binding.type == "attribute")  {
              DOM.setBracketVal(binding.binding, element, HANDLER, true, binding.attrName);
            }
  
          });

        });
      }
      
    }
    //? set all values
    else {

      //? loop through all bindings on the current View
      $model.DOMBinding.forEach(eleBinding => {

        //? start looping through the View template
        template.querySelectorAll("["+eleBinding.ref+"]").forEach(element => {          
          
          if (eleBinding.type == "html") {
            DOM.setBracketVal(eleBinding.binding, eleBinding.el, HANDLER);
          }
          else if (eleBinding.type == "attribute")  {
            DOM.setBracketVal(eleBinding.binding, eleBinding.el, HANDLER, true, eleBinding.attrName);
          }

        });

      });

    }    

  },

  //* Renders your view to the element passed from the controller
  //? @params (HANDLER, HTML_DOCUMENT) - View Controller, HTML Document
  RENDER(HANDLER, HTML_DOCUMENT) {

    const RENDER_ELE = document.getElementById(HANDLER.ele.replace("#", ""));

    if (RENDER_ELE) {
      
      try {
        let viewStyle = document.createElement("style");
        viewStyle.innerHTML = `@import url("${appConfig.viewsFolder}${HANDLER.folderName}${HANDLER.style}");`;

        let viewWrapper = document.createElement("div");
        let view = document.createElement("div");
        view.id = HANDLER.folderName;
        view.innerHTML = HTML_DOCUMENT.body.innerHTML;
        view.append(viewStyle);
        viewWrapper.append(view);
        
        RENDER_ELE.innerHTML = viewWrapper.innerHTML;
      } 
      catch (e) {
        Message.log(
          "E",
          "SYSTEM ERROR :: Error while appling view styles",
          "The system failed to apply your view stylesheet"
        )
      }

    }
    else {
      Message.log(
        "E",
        "SYSTEM ERROR :: Error in render()",
        "Element passed from controller is not a valid HTML element"
      )
    }

  },

  //* Sets up the system styles
  SYSTEM_STYLES()
  {

    let systemStyle = document.createElement("style");
    systemStyle.innerHTML = `@import url("src/theme/${appConfig.systemTheme}.css");`;
    appConfig.systemStyles.forEach((style)=>{
      systemStyle.innerHTML += `@import url("src/css/${style}.css");`;
    });

    let head = document.getElementsByTagName("head")[0].append(systemStyle);

  },




  

  //! DEPRICATED =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  // buildComponents(COMPONENT, VIEW_TEMP) {

  //   //? Get the template for the component
  //   // DOM.getTemplate(COMPONENT.template, (HTML_TEMP) => {

  //   //   //? Check if the view template contains the component
  //   //   VIEW_TEMP.querySelectorAll(COMPONENT.ID).forEach(DOCUMENT_ELE => {

  //   //     //? get all components props and set them
  //   //     COMPONENT.$props = DOM.getComponentsAttr(DOCUMENT_ELE);
        
  //   //   });

  //   // });

  // },

  //// Gets components props and returns a props object
  //// params (ELE) - Component Element
  // getComponentsAttr(ELE) {

  //   const ATTRIBUTES = ELE.attributes;
  //   let propsObj = {};

  //   //? Make sure that props passed are registered
  //   //for (let att, i = 0, atts = ATTRIBUTES, n = ATTRIBUTES.length; i < n; i++)
  //   //{
  //     //? current attribute
  //     //att = atts[i];

  //     //if (isNaN(Number(att.nodeValue))) {
  //     //  propsObj[att.nodeName] = att.nodeValue;
  //     //}
  //     //else {
  //     //  propsObj[att.nodeName] = Number(att.nodeValue);
  //     //}

  //   //}

  //   //return propsObj;

  //// },

}