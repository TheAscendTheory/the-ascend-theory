const VARIANTS = {
 hub: {name:"Ascend Hub",slug:"ascend-hub",id:"com.theascendersclub.hub",scheme:"ascendhub"},
 academy:{name:"Ascend Academy",slug:"ascend-academy",id:"com.theascendersclub.academy",scheme:"ascendacademy"},
 media:{name:"Ascend Media",slug:"ascend-media",id:"com.theascendersclub.media",scheme:"ascendmedia"},
};
const variant=process.env.APP_VARIANT || "hub";
if(!Object.prototype.hasOwnProperty.call(VARIANTS,variant)){throw new Error("APP_VARIANT must be hub, academy or media");}
const app=VARIANTS[variant];
module.exports={
 expo:{
  name:app.name,slug:app.slug,scheme:app.scheme,
  version:"0.1.0",orientation:"portrait",
  userInterfaceStyle:"light",
  ios:{bundleIdentifier:app.id,supportsTablet:true,buildNumber:"1"},
  android:{package:app.id,versionCode:1},
  plugins:[],
  extra:{variant}
 }
};