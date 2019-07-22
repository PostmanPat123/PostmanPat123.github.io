export const Message = {

  render: (msg) => {
    document.body.innerHTML += msg;
  },

  buttonClickCallback: (onclick) => {
    
    //? close popup
    $('.messagePopup').addClass('done');
    setTimeout(() => {
      $('#messagePopupContainer').remove();
    }, 250);

    //? run the onclick
    eval(onclick);
  },

  /*
   * Displays a complex popup
   *
   * type     - The type of popup you want ("E", "S")
   * title    - The heading of your popup ("This is a header")
   * desc     - The desciption of your popup ("This is a desciption")
   * log      - this will log your message to the console if true ("This is a desciption")
   * _buttons - this is where you would put all your buttons
   *            - ( [{type: "SINGLE", title: "", class: "", onclick: "method",}] )
   *            - ( [{type: "GROUP", buttons: [{type: "SINGLE", title: "", class: "", onclick: "method",}] }] )
  */
  popup: (type, title, desc, _buttons=[], log=false) => {

    //? vars
    let iconType = "";
    let btnType = "";
    let buttons = "";

    //? checks
    if (type == "E") {
      iconType = "error.png";
      btnType = "error";
    }
    if (type == "S") {
      iconType = "success.png";
      btnType = "success";
    }

    let close = `
    $('.messagePopup').addClass('done');
    setTimeout(() => {
      $('#messagePopupContainer').remove();
      // document.location.reload()
    }, 250);`;

    //? builds up the buttons
    _buttons.forEach(btn => {

      if (btn.type == "SINGLE") {
        buttons += `<button class="${btn.class}" onclick="${btn.onclick}">${btn.title}</button>`;
      }
      else if (btn.type == "GROUP") {
        buttons += "<div class='btnGroup d-flex flex-row flex-even'>";
        btn.buttons.forEach(_btn => {
          
          buttons += `<button class="${_btn.class}" onclick="${_btn.onclick}">${_btn.title}</button>`;

        });
        buttons += "</div>";
      }

    }); 

    //? build up the popup
    let str = `
    <div id="messagePopupContainer">
      <div class="messagePopup">
        <div class="head d-flex flex-col flex-even">
          <div class="title text-lg-bolder">${title}</div>
          <div class="desc text-sm-bold">${desc}</div>
        </div>`;
        // if (btnText != false) {
          str += `
          <div class="btnContainer">
            ${buttons}
          </div>`
        // }
        // else {

        // }         
      str += `
      </div>
    </div>`;

    if (log) {
      message.log(type, title, desc);        
    }

    $("#messagePopupContainer").remove();
    message.render(str);

  },

  /*
   * Displays a Default popup
   *
   * desc         - The desciption of your popup ("This is a desciption") ( NOTE* required)
   * buttonInfo_1 - This will be the main big green button ( NOTE* required)
   *                - {title: "", onclick:""}
   * title        - This will be the title to the popup ( NOTE* optional)
   * buttonInfo_2 - This will be the secondary underlined button ( NOTE* optional)
   *                - {title: "", onclick:""}
  */
  defaultPopup: (desc, buttonInfo_1, title="", buttonInfo_2={}) => {

    if (desc == "" || desc == undefined) {
      message.log(
        "E", 
        "Error with defaultPopup()", 
        "Your description is missing or was not provided", 
        true
      );
    }

    if (!buttonInfo_1.hasOwnProperty("title") || !buttonInfo_1.hasOwnProperty("onclick")) {
      message.log(
        "E", 
        "Error with defaultPopup()", 
        "Your Button Info Object is missing either (title) or (onclick)", 
        true
      );
    }

    let str = `
    <div id="messagePopupContainer">
      <div class="messagePopup d-flex flex-col flex-align flex-center">
        <div class="head d-flex flex-col flex-even">`;
          if (title != "") {
            str += `<div class="title text-xl-bolder">${title}</div>`;
          }

          if (title == "") {
            str += `<div class="desc text-lg">${desc}</div>`;
          }
          else {
            str += `<div class="desc text-lg">${desc}</div>`;
          }

      str += `          
        </div>
        <div class="btnContainer">`;
          
          str += `<button class="btn-p-xl rounded-px-40 bg-primary text-lg-bolder text-white shadow-sm" onclick="message.buttonClickCallback(${buttonInfo_1.onclick})">${buttonInfo_1.title}</button>`;

          if (buttonInfo_2.hasOwnProperty("title") && buttonInfo_2.hasOwnProperty("onclick")) {
            str += "<div class='btnGroup d-flex flex-row flex-even'>";
            str += `<button class="underlineBtn-p-md text-md-bold text-primary" onclick="message.buttonClickCallback(${buttonInfo_2.onclick})">${buttonInfo_2.title}</button>`;
            str += "</div>";
          }

        str += `
        </div>
    </div>`;

    $("#messagePopupContainer").remove();
    message.render(str);

  },

  /*
   * Displays a toast message with a desciption
   *
   * type     - The type of popup you want ("E", "S")
   * desc     - The desciption of your popup ("This is a desciption")
   * pos      - This will define where the toast will come from ("top", "bottom")
  */
  peanutButterToast: (type, desc, pos="bottom") => {

    let close = `
    $('#messageToast').addClass('done');
    setTimeout(() => {
      $('#messageToast').remove();
      // document.location.reload()
    }, 500);` 

    let bgColor = "";

    if (type == "E") {
      bgColor = "error";
    }
    else {
      bgColor = "success";
    }

    //? build up the popup
    let str = `
    <div id="messageToast" class="${pos} ${bgColor}">
      <div class="description">${desc}</div>
      <div class="btnContainer">
        <button class="btn" onclick="${close}">DISMISS</button>
      </div>
    </div>`;

    $("#messageToast").remove();
    message.render(str);

  },

  BriefMessage: (type, desc) => {

    let close = `
    $('#messageBrief').addClass('done');
    setTimeout(() => {
      $('#messageBriefWrapper').remove();
      // document.location.reload()
    }, 500);` 

    let bgColor = "";

    if (type == "E") {
      bgColor = "error";
    }
    else {
      bgColor = "success";
    }

    //? build up the popup
    let str = `
    <div id="messageBriefWrapper">
      <div id="messageBrief" class="${bgColor} shadow-xl">
        <div class="description">${desc}</div>
      </div>
    </div>`;

    $("#messageBriefWrapper").remove();
    message.render(str);

  },

  /*
   * Logs a message to the console
   *
   * type     - The type of popup you want ("E", "S")
   * header   - The heading of your log ("This is a desciption")
   * desc     - The desciption of your log or an array for multiple logs
   *            - ("This is a desciption")
   *            - ( [{type: "truncated/show", heading: "JSON DATA", data: json}] )
   * fancy    - This will apply a nice style to the logged message
  */
  log: (type, header, desc, fancy=false) => {

    let styles1;
    let styles2;
    if (type == "W") {
      if (fancy) {
        styles1 = "background-color:yellow;color:#000;padding:2px;border-radius:3px;";          
      }
    }
    if (type == "E") {
      if (fancy) {
        styles1 = "background-color:red;color:#fff;padding:2px;border-radius:3px;";          
      }
    }
    if (type == "S") {
      if (fancy) {
        styles1 = "background-color:lightgreen;color:#fff;padding:2px;border-radius:3px;";          
      }
    }

    //? builds up the buttons
    if (Array.isArray(desc)) {
      //? build up buttons
      desc.forEach(log => {
        let heading = "width:100%;background-color:yellow;color:#000;padding:2px 20%;border-radius:3px;";
        let data = "";

        if (log.type == "truncated") {
          console.groupCollapsed(" %c ["+log.heading+"] ", heading);
            console.warn(log.data);
          console.groupEnd();
        }
        else if (log.type == "show") {
          console.group(" %c ["+log.heading+"] ", heading);            
            console.log(log.data); 
          console.groupEnd();           
        }          

      });

    }
    else {
      //? simple log
      console.groupCollapsed("%c "+header+" ", styles1);
        if (type == "E") {
          console.error(desc);
        }
        else if (type == "W") {
          console.warn(desc);
        }
        else {
          console.log(desc);
        }
      console.groupEnd();
      
    }
    
  },

}