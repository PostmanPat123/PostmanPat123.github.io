import { Message } from "./message";

export const Lib = {

  /*
   * Gets the contents of a file and returns it
   @params (requestObj) - {url:"", type: ""}
  */
  getFileContents(requestObj, callback)
  {

    const xhr = new XMLHttpRequest();    

    xhr.open("GET", requestObj.url);
    xhr.responseType = requestObj.type;
    xhr.send();

    xhr.onreadystatechange = () => {

      if (xhr.readyState == 4) {
        
        if (xhr.status == 200) { 
          
            let checkObj;
            if (requestObj.type == "document") {
              checkObj = xhr.responseXML;
            }
            else if (requestObj.type == "text") {
              checkObj = xhr.responseText;
            }
              
            //? result
            if (checkObj == "" || null) {
              Message.log("E", 'Error In JSON Response', 'The resoponse returned ass <b>null</b>');
              callback(true, checkObj)
            }
            else {
              callback(false, checkObj)           
            }           
                  
        }
        else if(xhr.status != 200) {

          //? err
          callback(true, "XHR Request Failed :: Request failed with a status of "+xhr.status)
          
        }
      }                    
    }

  }

};