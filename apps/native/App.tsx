import {SafeAreaView,StatusBar,Text,View} from "react-native";
import NativeHub from "./src/Hub";
import NativeAcademy from "./src/Academy";
import NativeMedia from "./src/Media";
import {useIdentity} from "./src/Auth";
import {palette,styles} from "./src/theme";

const VARIANT=process.env.EXPO_PUBLIC_APP_VARIANT||"hub";
const labels:{[key:string]:{name:string,descriptor:string}}={
 hub:{name:"ASCEND HUB",descriptor:"THE NETWORK"},
 academy:{name:"ASCEND ACADEMY",descriptor:"THE KNOWLEDGE"},
 media:{name:"ASCEND MEDIA",descriptor:"THE STORIES"}
};
export default function App(){
 const {user,checking}=useIdentity();
 const brand=labels[VARIANT]||labels.hub;
 return <SafeAreaView style={styles.root}>
  <StatusBar barStyle="dark-content"/>
  <View style={styles.header}>
   <View><Text style={styles.headerBrand}>{brand.name}</Text><Text style={styles.headerTag}>{brand.descriptor} / THE ASCENDERS CLUB</Text></View>
   <View accessibilityLabel="Intersecting circle geometry" style={{width:39,height:39,position:"relative"}}>
    <View style={{position:"absolute",height:26,width:26,borderColor:"#000",borderWidth:1,borderRadius:16,top:0,left:6}}/>
    <View style={{position:"absolute",height:26,width:26,borderColor:"#000",borderWidth:1,borderRadius:16,top:12,left:0}}/>
    <View style={{position:"absolute",height:26,width:26,borderColor:palette.green,borderWidth:1,borderRadius:16,top:12,right:0}}/>
   </View>
  </View>
  {checking?<View style={[styles.body,{justifyContent:"center",alignItems:"center"}]}><Text style={styles.detail}>Opening Ascend…</Text></View>
   :VARIANT==="academy"?<NativeAcademy user={user}/>
   :VARIANT==="media"?<NativeMedia/>
   :<NativeHub user={user}/>}
 </SafeAreaView>;
}
