import type {MetadataRoute} from "next";
export default function manifest():MetadataRoute.Manifest{
 return {
  id:"/hub",
  name:"The Ascenders Club — Ascend Apps",
  short_name:"Ascend",
  description:"Connect changemakers, learn across disciplines, and explore independent stories.",
  start_url:"/hub",
  scope:"/",
  display:"standalone",
  background_color:"#FFFFFF",
  theme_color:"#FFFFFF",
  orientation:"any",
  icons:[{src:"/logo.PNG",type:"image/png",sizes:"any",purpose:"any"}]
 };
}
