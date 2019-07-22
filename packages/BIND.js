import { viewDirectives, bindDirective, onDirective } from "./directives";
import { Message } from "./message";
import { DOM } from "./DOM";
import appConfig from "../app.config";

export const BIND = {
  
  //* Checks if any of the elements have a binding of @Reflect
  //? params (TEMPLATE, HANDLER) HTML Document
  Reflect(HANDLER)
  {
    // let bindKey = binding[0];
    // let bindVal = binding[1];

    document.querySelectorAll("[vm-wOUrX40]").forEach(value => {      
      
      let self = this;
      let element = value;
      let inputName = element.localName;
      let attrVal = element.attributes["vm-wOUrX40"].value;

      //? check if of type input
      if ( (inputName == "input") || (inputName == "select") || (inputName == "option") || (inputName == "button") || (inputName == "textarea") ) {
          
        element.addEventListener("input", (e) => {

          if (attrVal.indexOf(".") > 0) {

            if (HANDLER.hasOwnProperty(attrVal+"_comp")) {

              BIND.setNestedProp(attrVal, element.value, attrVal+"_comp", HANDLER);

            }
            else {
              BIND.setNestedProp(attrVal, element.value, attrVal, HANDLER);
            }            
            
          }
          else {  
            
            if ( HANDLER.hasOwnProperty(attrVal) ) {
              
              BIND.setSingleProperty(element, attrVal, inputName, value, HANDLER);

            }
            else if (HANDLER.hasOwnProperty(attrVal+"_comp")) {

              BIND.setSingleProperty(element, attrVal, inputName, value, HANDLER);

            }
            else {
              return Message.log(
                "E", 
                "Error in Template '@Reflect' Binding", 
                "Property '"+attrVal+"' is not defined on your View Controller",
              );
            }

          }

        });        

      }
      else {
        return Message.log(
          "E", 
          "Error in Template '@Reflect' Binding", 
          "You cannot bind to an element type of: "+element.localName,
        );
      }

    });   

  },
  
  //* Checks if any of the elements have a binding of @Bind
  //? params (TEMPLATE, HANDLER) HTML Document
  Bind(HANDLER)
  {

    Object.entries(bindDirective).forEach(binding => {

      let bindKey = binding[0];
      let bindVal = binding[1];      

      document.querySelectorAll("["+bindVal+"]").forEach(value => {      
      
        let self = this;
        let element = value;
        let inputName = element.localName;
        let attrVal = element.attributes[bindVal].value;

        //? checks if the attrVal exists in your data set
        function checkIfAttrValExists(index, val)
        {          
          if ( HANDLER[val] ) return 1;
          else if (HANDLER[val+"_comp"]) return 2;
          else {
            return Message.log(
              "E", 
              "Error in Template '"+index+"' Binding", 
              "Property '"+val+"' is not defined on your View Controller"
            );
            return false;
          }
        }

        let keys = Object.entries(bindDirective);
        
        //? Check what type of binding
        switch (bindVal) {
          case keys[0][1]:                       
            if (typeof HANDLER[attrVal] == "string") {
              let check = checkIfAttrValExists(bindKey, attrVal);
              if (check == 1) {               
                element.id = HANDLER[attrVal];
              }
              else if (check == 2) {
                element.id = HANDLER[attrVal+"_comp"];
              }
            }
            else {
              return Message.log(
                "E",
                "Error in Template '"+bindKey+"' Binding", 
                "Property '"+attrVal+"' is not of type String",
              );
            }
            break;
          case keys[1][1]: 
            if (typeof HANDLER[attrVal] == "string" || typeof HANDLER[attrVal+"_comp"] == "string") {
              let check = checkIfAttrValExists(bindKey, attrVal);             
              if (check == 1) {
                element.className = HANDLER[attrVal];
              }
              else if (check == 2) {
                element.className = HANDLER[attrVal+"_comp"];
              }
            }
            else {
              return Message.log(
                "E",
                "Error in Template '"+bindKey+"' Binding", 
                "Property '"+attrVal+"' is not of type String",
              );
            }
            break;
          case keys[2][1]:
            if (typeof HANDLER[attrVal] == "boolean" || typeof HANDLER[attrVal+"_comp"] == "boolean") {
              let check = checkIfAttrValExists(bindKey, attrVal);
              if (check == 1) {
                if (
                    element.localName == "button" ||
                    element.localName == "input" ||
                    element.localName == "select"
                  ) 
                {
                  element.disabled = HANDLER[attrVal];
                }
                else {
                  return Message.log(
                    "E",
                    "Error in Template '"+bindKey+"' Binding", 
                    "Unable to disable "+element.localName+" tag",
                  );
                }
              }
              else if (check == 2) {
                if (
                  element.localName == "button" ||
                  element.localName == "input" ||
                  element.localName == "select"
                ) 
                {
                  element.disabled = HANDLER[attrVal+"_comp"];
                }
                else {
                  return Message.log(
                    "E",
                    "Error in Template '"+bindKey+"' Binding", 
                    "Unable to disable "+element.localName+" tag",
                  );
                }
              }
            }
            else {
              return Message.log(
                "E",
                "Error in Template '"+bindKey+"' Binding", 
                "Property '"+attrVal+"' is not of type Boolean",
              );
            }
            
            break;
          case keys[3][1]:
            if (typeof HANDLER[attrVal] == "boolean" || typeof HANDLER[attrVal+"_comp"] == "boolean") {
              let check = checkIfAttrValExists(bindKey, attrVal);
              if (check == 1) {
                element.checked = HANDLER[attrVal];
              }
              else if (check == 2) {
                element.checked = HANDLER[attrVal+"_comp"];
              }
            }
            else {
              return Message.log(
                "E",
                "Error in Template '"+bindKey+"' Binding", 
                "Property '"+attrVal+"' is not of type Boolean",
              );              
            }
            
            break;
          case keys[4][1]:
            if (element.localName == "a") {
              let check = checkIfAttrValExists(bindKey, attrVal);
              if (check == 1) {
                element.href = HANDLER[attrVal];
              }
              else if (check == 2) {
                element.href = HANDLER[attrVal+"_comp"];
              }
            }
            else {
              return Message.log(
                "E",
                "Error in Template '"+bindKey+"' Binding", 
                element.localName+" is not an anchor tag",
              );
            }
            break;
        
          default:
              return Message.log(
              "E",
              "Error in Template '"+bindKey+"' Binding", 
              bindKey+" is not a valid Binding",
            );       
            break;
        }        

      });

    });

  },

  //* Checks if any of the elements have a binding of @If
  //? params (TEMPLATE, HANDLER) HTML Document
  If(HANDLER)
  {

    let bindings = document.querySelectorAll("[vm-A2xo7Jy]");
    bindings.forEach(value => {

      //? current element
      let element = value;
      let attrVal = element.attributes['vm-A2xo7Jy'].value;

      //? next element
      let elseEle = null;
      if (element.nextElementSibling != null) {
        if (element.nextElementSibling.hasAttribute("vm-Ajf67Jy")) {
          elseEle = element.nextElementSibling;
        } 
      }          

      let script;
      let newVal;

      //? Checks for JS expressions
      if (attrVal.indexOf("[") >= 0) {

        //? replaces 'this' with $scope.view
        newVal = attrVal
                    .replace("[", "")
                    .replace("]", "")
                    .replace(/this/g, "$scope");
        newVal = BIND.escapeString(newVal);
        
        //? sets the key word 'this' to point to the element
        if (newVal.indexOf("?") >= 0) {
          let found = [];
          let rxp = /\?([^:]+):/g;
          let curMatch;        

          while( curMatch = rxp.exec( newVal ) ) {
            
            if (found.indexOf(curMatch[1]) < 0) {
              found.push( curMatch[1] );
            }

          }

          newVal = found[0].replace(/\$scope.view/g, 'element');
          newVal = this.escapeString(newVal);
          
        }

        //? checks if expression is valid
        try {          
          script = eval("("+newVal+")");          
        }
        catch {
          attrVal
          .replace("[", "")
          .replace("]", "");

          Message.log(
            "E",
            "Error in Template '@If' Binding Expression", 
            "'"+attrVal+"' is not a valid JavaScript Expression or the values passed are of not the right format",
          );
        }
        
        if (elseEle != null) {
          if (script) {
            $(element).show();
            $(elseEle).hide();
          }
          else {
            $(element).hide();
            $(elseEle).show();
          }
        }
        else {
          if (script) {
            $(element).show();
          }
          else {
            $(element).hide();
          }
        }        
      }
      //? Checks for object tree
      else if (attrVal.indexOf(".") >= 0) {        
        script = eval("(HANDLER."+attrVal+")");
        script2 = eval("(HANDLER."+attrVal+"_comp)");
        if (elseEle != null) {
          if (script) {
            $(element).show();
            $(elseEle).hide();
          }
          else if (script2) {
            $(element).show();
            $(elseEle).hide();
          }
          else {
            $(element).hide();
            $(elseEle).show();
          }
        }
        else {
          if (script) {
            $(element).show();
          }
          else if (script2) {
            $(element).show();
          }
          else {
            $(element).hide();
          }
        }         
      }
      //? Checks if value is a boolean
      else if (attrVal == "true" || attrVal == "false") {        
        if (elseEle != null) {
          if (eval(attrVal)) {
            $(element).show();
            $(elseEle).hide();
          }
          else {
            $(element).hide();
            $(elseEle).show();
          }
        }
        else {
          if (eval(attrVal)) {
            $(element).show();
          }
          else {
            $(element).hide();
          }
        } 
      }
      //? Checks if the value exists in your View Controller
      else  {        
        
        if ( HANDLER.hasOwnProperty(attrVal) ) {
          
          if (typeof HANDLER[attrVal] == 'boolean') {
            
            if (elseEle != null) {
              if (HANDLER[attrVal]) {
                $(element).show();
                $(elseEle).hide();
              }
              else {
                $(element).hide();
                $(elseEle).show();
              }
            }
            else {
              if (HANDLER[attrVal]) {
                $(element).show();
              }
              else {
                $(element).hide();
              }
            } 

          }
          else {
            Message.log(
              "E",
              "Error in Template '@If' Binding", 
              "Property '"+attrVal+"' is not of type 'boolean'",
            );
          }
          

        }
        else {
          Message.log(
            "E",
            "Error in Template '@If' Binding", 
            "Property '"+attrVal+"' is not defined on your View Controller",
          );
        }
      }     

    });

  },

  //* Checks if any of the elements have a binding of @On
  //? params (TEMPLATE, HANDLER) HTML Document
  On(HANDLER)
  {
    
    Object.entries(onDirective).forEach(binding => {

      let bindKey = binding[0];
      let bindVal = binding[1];

      //? get all elements with the route attr
      let bindings = document.querySelectorAll("["+bindVal+"]");
      bindings.forEach(value => {     
        let element = value;
        let attrVal = element.attributes[bindVal].value;
        let index = attrVal.indexOf("(");
        let funcName = attrVal.slice(0, index);
        
        //? Getting content between braces
        let found = [];
        let rxp = /\(([^)]+)\)/g;
        let curMatch;

        while( curMatch = rxp.exec( attrVal ) ) {
          let values = curMatch[1].split(",");
          
          values.forEach(val => {

            if (/\d/.test(val)) {
              found.push(parseInt(val));
            }
            else {
              found.push(val);
            }

          });          
            
        }

        //? set the style
        if (element.localName != "input") {
          element.style.cursor = "pointer";
        }        

        let keys = Object.entries(onDirective);    
        /*
        "@On:Click": "vm-u67W2a8",
        "@On:Submit": "vm-dIbLGpz",
        "@On:Enter": "vm-rwAaot4",
        "@On:Change": "vm-8ikHgbc",
        "@On:Input": "vm-fbnsI6S",
        "@On:Scroll": "vm-ldN8dke",
        */
       
        const component_ = null;
        switch (bindVal) {
          case keys[0][1]:
            element.addEventListener("click", (e) => {
              let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
              if (check == 1) {                
                HANDLER[funcName](...found, e);
                //! DOM.insertDOMValue(document, HANDLER);
                BIND.If(HANDLER);
              }
              else if (check == 2) {                
                HANDLER[funcName+"_comp"](...found, e);
                DOM.insertDOMValue(document, HANDLER);
                BIND.If(HANDLER);
              }
            });
            break;
          case keys[1][1]:
            if (element.localName == "form") {
              element.addEventListener("submit", (e) => {
                e.preventDefault();               
                let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
                if (check == 1) {
                  HANDLER[funcName](...found, e);
                  //! DOM.insertDOMValue(document, HANDLER);
                  BIND.If(HANDLER);
                }
                else if (check == 2) {                
                  HANDLER[funcName+"_comp"](...found, e);
                  //! DOM.insertDOMValue(document, HANDLER);
                  BIND.If(HANDLER);
                }
              });
            }
            else {
              this.lib.newMsg(
                this.Constants.TYPE_ERROR, 
                "Error in Template <b>"+bindKey+"</b> Binding", 
                "You can only add the <b>'"+bindKey+"'</b> to a form element",
                false,
                {ele: element, attr: attrVal}             
              );
            }           
            break;
          case keys[2][1]:
            element.addEventListener("keypress", (e) => {                
              let key = e.which || e.keyCode;
              let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
              if (check == 1) {
                if (key === 13) {                
                  HANDLER[funcName](...found, e);
                  //! DOM.insertDOMValue(document, HANDLER);
                  BIND.If(HANDLER);
                }
              }
              else if (check == 2) {                
                if (key === 13) {                
                  HANDLER[funcName+"_comp"](...found, e);
                  //! DOM.insertDOMValue(document, HANDLER);
                  BIND.If(HANDLER);
                }
              }
            });
            break;
          case keys[3][1]:
            if ( (element.localName == "input") || (element.localName == "select") ) {                
              element.addEventListener("change", (e) => {
                let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
                if (check == 1) {                    
                  HANDLER[funcName](...found, e);
                  //! DOM.insertDOMValue(document, HANDLER);
                  BIND.If(HANDLER);
                }
                else if (check == 2) {                
                  HANDLER[funcName+"_comp"](...found, e);
                  //! DOM.insertDOMValue(document, HANDLER);
                  BIND.If(HANDLER);
                }
              });
            }
            else {
              this.lib.newMsg(
                this.Constants.TYPE_ERROR, 
                "Error in Template <b>"+bindKey+"</b> Binding", 
                "You can only add the <b>'"+bindKey+"'</b> to an input element",
                false,
                {ele: element, attr: attrVal} 
              );
            }
            break;
          case keys[4][1]:
            if (element.localName == "input") {                
              element.addEventListener("input", (e) => {
                let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
                if (check == 1) {                    
                  HANDLER[funcName](...found, e);
                  //! DOM.insertDOMValue(document, HANDLER);
                  BIND.If(HANDLER);
                }
                else if (check == 2) {                
                  HANDLER[funcName+"_comp"](...found, e);
                  //! DOM.insertDOMValue(document, HANDLER);
                  BIND.If(HANDLER);
                }
              });
            }
            else {
              this.lib.newMsg(
                this.Constants.TYPE_ERROR, 
                "Error in Template <b>"+bindKey+"</b> Binding", 
                "You can only add the <b>'"+bindKey+"'</b> to an input element",
                false,
                {ele: element, attr: attrVal} 
              );
            }
            break;
          case keys[5][1]:
            element.addEventListener("mousewheel", (e) => {
              let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
              if (check == 1) {                    
                HANDLER[funcName](...found, e);
                //! DOM.insertDOMValue(document, HANDLER);
                BIND.If(HANDLER);
              }
              else if (check == 2) {                
                HANDLER[funcName+"_comp"](...found, e);
                //! DOM.insertDOMValue(document, HANDLER);
                BIND.If(HANDLER);
              }
            });
            break;
          case keys[11][1]:
            element.addEventListener("mousewheel", (e) => {
              let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);                            
              if (check == 1) {
                HANDLER[funcName](...found, e);
                //! DOM.insertDOMValue(document, HANDLER);
                BIND.If(HANDLER);
              }
              else if (check == 2) {                
                HANDLER[funcName+"_comp"](...found, e);
                //! DOM.insertDOMValue(document, HANDLER);
                BIND.If(HANDLER);
              }
            });
            break;
        
          default:
            Message.log(
              "E",
              "SYSTEM :: Invalid @On directive",
              bindKey+" is an invalid binding and does not exist. Make sure the viewDirectives have support for the key: "+bindVal
            );
            break;
        }        

      });

    });    

  },

  //* Checks if any elements have a @For attr and will loop that element according to the data
  //? params (HANDLER, TEMPLATE)
  For(HANDLER, HTML_TEMP)
  {

    HTML_TEMP.querySelectorAll('[vm-gtSXBIq]').forEach(value => {
      
      let element = value;
      let attrVal = element.attributes['vm-gtSXBIq'].value;
      let toLoopArr = attrVal.split(" in ")[1];
      let iterator = attrVal.split(" in ")[0];
      
      //? makes sure you only loop on a container element
      if (element.innerHTML.length == 0) {
        Message.log(
          "E",
          "Error in Template '@For' Binding",
          "<b>'"+element.localName+"'</b> Is not a container. '@For' Will loop the contents of an element, therefore it needs to contain other elements"
        );
      }

      //? Checks if the array exists in your data set
      if (HANDLER[toLoopArr]) {
        
        //? makes sure you only loop through either (array, array(object))
        if (typeof HANDLER[toLoopArr] != "object") {
          Message.log(
            "E",
            "Error in Template '@For' Binding",
            "<b>'"+toLoopArr+"'</b> Is not an array"
          );
        }

        let temp = "";        
        let newTemp = "";
        let builtEle = [];
        let parser = new DOMParser();
        let innerDocument = parser.parseFromString(element.innerHTML, "text/html");        

        //? Loops through the 'toLoopArr' inside your data set
        HANDLER[toLoopArr].forEach((item, index) => {
          
          //? Check if you are looping through an array of Objects
          if (typeof item == 'object') {
            
            let innerElements = innerDocument.body.getElementsByTagName("*");
            // let found = BIND.getVarsFromString(regex, element.innerHTML);            

            //? get all elements with an interpolation value
            for (let element = 0; element < innerElements.length; element++) {
              let ele = innerElements[element];

              if (ele.hasAttribute("qm")) {
                
                let attrVal = ele.attributes["qm"].value.replace(iterator, toLoopArr);
                let arrayValues = attrVal.replace(/ /g,'').replace("()", "").split(".");
                
                let script = HANDLER[arrayValues[0]][index][arrayValues[1]];

                if (script == undefined) {
                  return Message.log(
                    "E", 
                    "Error in @For Binding", 
                    _prop[1]+" does not exist in <b>'"+_prop[0]+"'<b>"
                  );
                }                

                //? Checks if the current 'item' is another object
                if (typeof script === 'object' && script.constructor === Object) {
                  this.error = true;
                  return Message.log(
                    "E", 
                    "WARNING! UNSUPPORTED FEATURE", 
                    "Unfortunately '@For' does not support nested objects as of yet."
                  );
                }
                
                // //? Populates the 'str' variable with the new template
                ele.innerHTML = script;
                // innerElements[element].removeAttribute("qm");
                ele.setAttribute("qm", "["+arrayValues[0]+"]["+index+"]["+arrayValues[1]+"]");
                console.log(index);                

                for (let element = 0; element < innerDocument.body.children.length; element++) {
                  let ele = innerDocument.body.children[element];
                  console.log(ele);
                  
                  builtEle.push(ele);
                }                

              }
              
            }  
            
            console.log(builtEle);
            

            // //? This will get filled with each iteration of html
            // let str = "";
            
            // //? Loops through all found values
            // found.forEach(value => { 
            //   console.log(value);         
            //   let Regex = new RegExp("{{"+value+"}}", 'g');
            //   let _prop = value.replace(/ /g,'').replace("()", "").replace(iterator, toLoopArr).split(".");
            //   //! let script = eval(`(HANDLER['${_prop[0]}'][${index}]['${_prop[1]}'])`);  
              
            //   if (HANDLER[_prop[0]][index][_prop[1]] == undefined) {
            //     return Message.log(
            //       "E", 
            //       "Error in @For Binding", 
            //       _prop[1]+" does not exist in <b>'"+_prop[0]+"'<b>"
            //     );
            //   }

            //   let script = HANDLER[_prop[0]][index][_prop[1]];
            //   console.log(script);              
                          
            //   //? Checks if the current 'item' is another object
            //   if (typeof script === 'object' && script.constructor === Object && this.error == false) {
            //     this.error = true;
            //     return Message.log(
            //       "E", 
            //       "<span style='font-weight: 900;'>WARNING!</span> UNSUPPORTED FEATURE", 
            //       "Unfortunately <b>'@For'</b> does not support nested objects as of yet."
            //     );
            //   }

            //   //? Populates the 'str' variable with the new template
            //   if (str == "") {
            //     str = element.innerHTML.replace(Regex, script);                
            //   }
            //   else {
            //     str = str.replace(Regex, script);
            //   }
            //   temp = str;

            // });           

            //? Sets the 'newTemp' variable to the html string
            
            // newTemp += temp;            
            
          }

          //? Check if you are looping through an array of Strings
          else {

            //? Gets all the values from inside the container
            let regex = new RegExp("{{"+iterator+"}}", 'g');
            temp = element.innerHTML.replace(regex, item.replace(/ /g,''));

            //? Sets the 'newTemp' variable to the html string
            newTemp += temp;

          }

        });        

        //? Sets the innerHTML of the container to 'newTemp'
        innerDocument.body.innerHTML = "";
        builtEle.forEach(element => {
          
          innerDocument.body.append(element)

        });
        console.log(innerDocument.body);
        
        // element.innerHTML = newTemp;

      }
      else {
        //? Fails to find the variable in your data set
        return Message.log(
          "E", 
          "Error in Template '@For' Binding", 
          "Property <b>'"+toLoopArr+"'</b> is not defined on your <b>view object</b>"
        );
      }
      

    });

  },

  Component(COMP_OBJ, COMP_NAME, CONTROLLER_TEMP, COUNT, cb) {
    
    //* Get components template
    DOM.getTemplate(COMP_OBJ.template, (COMP_TEMP) => {
      
      CONTROLLER_TEMP.querySelectorAll("*").forEach(ELE => {

        //* get comp ele from controller template
        if (ELE.localName == COMP_NAME) {

          const COMP_ATTR = ELE.attributes;
          let NEW_COMP_TEMP = "";
          let REQ_PROPS = "";
          const COMP_PROPS_LENGTH = Object.entries(COMP_OBJ.props).length;
          const PASSED_PROPS_LENGTH = COMP_ATTR.length;

          //? build up a string of the required props
          Object.entries(COMP_OBJ.props).forEach(prop => REQ_PROPS += prop[0]+"|");          

          //? check that all props are being passed
          if (PASSED_PROPS_LENGTH != COMP_PROPS_LENGTH) {
            Message.log(
              "W",
              "SYSTEM :: Component ("+COMP_NAME+") missing props",
              `Your component was not passed the required props: ( |${REQ_PROPS} )`
            );
          }

          //? build up the components props          
          if (COMP_PROPS_LENGTH > 0) {
            for (let att, i = 0, atts = COMP_ATTR, n = atts.length; i < n; i++)
            {            
              
              att = atts[i];            
              let rgx = new RegExp("{{"+att.nodeName+"}}", 'g');
              if (COMP_OBJ.props.hasOwnProperty(att.nodeName)) {

                if (NEW_COMP_TEMP == "") {
                  NEW_COMP_TEMP = COMP_TEMP.body.innerHTML.replace(rgx, att.nodeValue);
                }
                else {
                  NEW_COMP_TEMP = NEW_COMP_TEMP.replace(rgx, att.nodeValue);
                }

              }
              else {
                Message.log(
                  "E", 
                  "Error in <b>"+COMP_NAME+"</b> Props", 
                  "'"+att.nodeName+"' Is not a registered prop for "+COMP_NAME+". Please make sure your prop names lowercase"
                );
              }

            }
          }
          else {
            NEW_COMP_TEMP = COMP_TEMP.body.innerHTML;
          }

          //? set an attribute "cp-"rondomChar for the @On attr
          ELE.querySelectorAll("*").forEach(COMP_ELE => {
            COMP_ELE.setAttribute("cp", BIND.getRandowString(7));
          });          

          //? set the comp template inside the element
          ELE.innerHTML = NEW_COMP_TEMP;

          //? build up the styles for the component
          let style = document.createElement("style");
          style.innerHTML = `
          @import url("${appConfig.compsFolder}${COMP_NAME}${COMP_OBJ.style}");`;
          ELE.prepend(style);

          // Message.log(
          //   "W",
          //   "COMPONENT :: styles warning",
          //   "MAKE SURE YOUR COMPONENT STYLES ARE NAMED WELL OR THEY WILL AFFECT YOUR VIEW"
          // );

          // //? check if your component has any methods
          // const compMethods = Object.getOwnPropertyNames(COMP_OBJ.__proto__).filter(item => typeof COMP_OBJ[item] == 'function');
          // compMethods.forEach(method => {
          //   if ( (method != "constructor") ) {
          //     Message.log(
          //       "E",
          //       "SYSTEM :: Component contains a method ( "+method+"() )",
          //       "Please move your component's methods to the view Controller it is registered to. Your components are just a reusable templates with props that can change. You cannot set a method inside them because it cannot be called from the component."
          //     );
          //   }
          // });

          // //? insert all comps date into controller
          // const compData = Object.getOwnPropertyNames(COMP_OBJ).filter(item => typeof COMP_OBJ[item] != 'function');
          // compData.forEach(data => {
            
          //   if ( (data != "style") || (data != "folderName") || (data != "template") ) {
          //     if (CONTROLLER[data+"_comp"] == undefined) {
          //       CONTROLLER[data+"_comp"] = COMP_OBJ[data];
          //     }
          //     // else if (CONTROLLER[data+"_comp"]) {
          //     //   Message.log(
          //     //     "E",
          //     //     "SYSTEM :: Duplicate Component property",
          //     //     "Your component property ("+data+") already exists in another component being used in this controller. Change name to something specific to the component"
          //     //   );
          //     // }
          //   }

          // });          

        }

      });
      
      //? Component Rendered
      cb(COUNT);

    }, true);
  },


  //? HELPERS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


  getRandowString(length) {

    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;

  },

  //* Checks if nested prop exists and the updates val
  //? params (str, value, attrVal, HANDLER) 
  setNestedProp(str, value, attrVal, HANDLER)
  {

    let schema = HANDLER;  // a moving reference to internal objects within obj
    let pList = str.split('.');
    let len = pList.length;
    for(let i = 0; i < len-1; i++) {
        let elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }    

    if (isNaN(Number(value))) {
      schema[pList[len-1]] = value;
    }
    else if (!isNaN(Number(value))) {
      schema[pList[len-1]] = value;
    }
    else {
      schema[pList[len-1]] = Number(value);
    }    

    //? Update the document with the new Value
    DOM.insertDOMValue(document, HANDLER, attrVal);


    // document.querySelectorAll("[qm]").forEach(element => {
    //   let eleAttrVal = element.attributes["qm"].value;
    //   if (eleAttrVal == attrVal) {                  
    //     if (element.localName == "input") {
    //       element.value = value;

    //       //? NOTE* if your state has a global property 'attrVal' it will update it as well
    //       if (HANDLER.$state.state.hasOwnProperty(attrVal)) {                    
    //         HANDLER.$state.state[attrVal] = inputVal;                
    //       }
    //     }
    //     else {
    //       element.innerHTML = value;
    //     }
    //   }
    // });

  },

  getNestedProp(str, addOn, HANDLER) {

    let schema = HANDLER;  // a moving reference to internal objects within obj
    let pList = str.split('.');
    let len = pList.length;
    for(let i = 0; i < len-1; i++) {
        let elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }
    
    if (schema[pList[len-1]] != undefined) {
      return schema[pList[len-1]];
    }
    else {
      return schema[pList[len-1]+addOn];
    }    
    

  },

  setSingleProperty(element, attrVal, inputName, value, HANDLER) {

    //? get the input value
    let inputVal = element.value;

    //? if element is of type input
    if (inputName == "input") {                              
      if (isNaN(Number(value))) {
        HANDLER[attrVal] = inputVal;

        //? NOTE* if your state has a global property 'attrVal' it will update it as well
        if (HANDLER.$state.state.hasOwnProperty(attrVal)) {                    
          HANDLER.$state.state[attrVal] = inputVal;                
        }
      }
      else {
        HANDLER[attrVal] = Number(inputVal);

        //? NOTE* if your state has a global property 'attrVal' it will update it as well
        if (HANDLER.$state.state.hasOwnProperty(attrVal)) {                    
          HANDLER.$state.state[attrVal] = Number(inputVal);                
        }
      }
    }
    //? if element is of type select
    else if (inputName == "select") {
      HANDLER[attrVal] = element.value;
    }
    //? if element is of type textarea
    else if (inputName == "textarea") {
      HANDLER[attrVal] = element.value;
    }              
    //! element.value = inputVal;
    
    //? Update the document with the new Value
    DOM.insertDOMValue(document, HANDLER, attrVal);


    // document.querySelectorAll("[qm]").forEach(element => {
    //   let eleAttrVal = element.attributes["qm"].value;
    //   if (eleAttrVal == attrVal) {                  
    //     if (element.localName == "input") {
    //       element.value = inputVal;
    //       element.defaultValue = inputVal;
    //     }
    //     else {
    //       element.innerHTML = inputVal;
    //     }

    //   }
    // });

  },

  //? make sure the function in in data set
  checkIfFuncExists(name, key, OBJ) {            
    if (OBJ[name]) return 1;
    else if (OBJ[name+"_comp"]) return 2;
    else {             
      Message.log(
        "E", 
        "Error in Template "+key+" Binding", 
        "Method '"+name+"()' is not defined on your View Controller"
      );
      return false;
    }
  },

  //? call a component method
  callCompMethod(name) {
    
    let methodName = {success: false, name: ""};
    Object.entries(component_).forEach(key => {
      if (typeof key[1] == "function") {              
        if (key[0].split("-").pop() == name) {
          methodName.name = key[0];
          methodName.success = true;
        }                                                    
      }           
    });

    if (methodName.name == "") {
      self.error = true;
      methodName.success = false; 
      Message.log(
        "E",
        "Error in Template "+name+" Binding", 
        "Method '"+name+"()' is not defined in your component"
      );
    }
    
    return methodName;

  },

  escapeString(stringToEscape)
  {
    if(stringToEscape == '') {
        return stringToEscape;
    }

    return stringToEscape
        .replace(/\\/g, "\\\\")
        .replace(/\'/g, "\\\'")
        .replace(/\"/g, "\\\"")
        .replace(/\n/g, "\\\n")
        .replace(/\r/g, "\\\r")
        .replace(/\x00/g, "\\\x00")
        .replace(/\x1a/g, "\\\x1a");
  },

  //? Accepts a regex expression and applies it to a string
  getVarsFromString(expresion, template)
  {

    //? Getting content between curly braces
    let found = [];
    let rxp = expresion;
    let curMatch;    

    while( curMatch = rxp.exec( template ) ) {

      if (found.indexOf(curMatch[1]) < 0) {        
        found.push( curMatch[1] );
      }

    }
    
    return found;

  }

}