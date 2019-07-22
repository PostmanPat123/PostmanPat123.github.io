import $model from "./model";
import { Message } from "./message";

const $events = {

  emit(eventName, payload=true)
  {
    $model.events.data.emitters[eventName] = payload;
  },

  accept(eventName)
  {

    let value;
    if ($model.events.data.emitters[eventName] != false) {
      value = $model.events.data.emitters[eventName];
      delete $model.events.data.emitters[eventName];
    }
    else if ($model.events.data.emitters.hasOwnPropery(eventName)) {
      value = $model.events.data.emitters[eventName];
      delete $model.events.data.emitters[eventName];
    }
    
    if (!value) {
      Message.log(
        "E",
        "Error with custom event "+eventName,
        eventName+" has not been emitted yet is not a valid event"
      );
    }

    return value;
  },

  goBackEvent()
  {
    let event = $model.events.goBack;
    document.dispatchEvent(event);
  },

  addCrumbEvent(route)
  {
    let event = $model.events.addCrumb;

    $model.events.data.crumb = route;
    document.dispatchEvent(event);
  },

  removeLastCrumbEvent()
  {
    let event = $model.events.removeLastCrumb;
    document.dispatchEvent(event);
  },

  routeEvent(path, params=null)
  {
    let event = $model.events.route;
    
    $model.events.data.routePath = path;
    if (params != null) {
      if (params.hasOwnProperty("key") && params.hasOwnProperty("data")) {
        $model.events.data.routeData[params.key] = params.data;
        document.dispatchEvent(event);
      }
      else {
        Message.log(
          "E",
          "Error with Route event",
          "Your 'params' field is missing the properties: key: ' ', data: ' '"
        );
      }
    }
    else if (params == null) {
      document.dispatchEvent(event);
    }         
  }

}

export default $events;