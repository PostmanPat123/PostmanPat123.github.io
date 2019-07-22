//? components
import { navbar } from "../components/navbar/component";
import { subHeading } from "../components/heading-sub/component";
import { mainHeading } from "../components/heading-main/component";
import { linkComp } from "../components/link-comp/component";
import { imgComp } from "../components/img-comp/component";
import { smallHeading } from "../components/heading-small/component";
import { warnComp } from "../components/warn-comp/component";

const $components = [
  
  {ref: "navbar",
    component: navbar
  },
  {ref: "heading-sub",
    component: subHeading
  },
  {ref: "heading-main",
    component: mainHeading
  },
  {ref: "heading-small",
    component: smallHeading
  },
  {ref: "link-comp",
    component: linkComp
  },
  {ref: "img-comp",
    component: imgComp
  },
  {ref: "warn-comp",
    component: warnComp
  },

];

export default $components;