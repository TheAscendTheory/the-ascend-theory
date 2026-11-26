import {SafeAreaView,StatusBar,Text,View,Image} from "react-native";
import NativeHub from "./src/Hub";
import NativeAcademy from "./src/Academy";
import NativeMedia from "./src/Media";
import {useIdentity} from "./src/Auth";
import {styles} from "./src/theme";

const icons={hub:require("./assets/hub-brand.png"),academy:require("./assets/academy-brand.png"),media:require("./assets/media-brand.png")};
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
   <Image accessibilityLabel={brand.name+" trademark"} source={icons[VARIANT as keyof typeof icons]||icons.hub} style={{width:49,height:49,tintColor:"#000000"}} resizeMode="contain"/>
  </View>
  {checking?<View style={[styles.body,{justifyContent:"center",alignItems:"center"}]}><Text style={styles.detail}>Opening Ascend…</Text></View>
   :VARIANT==="academy"?<NativeAcademy user={user}/>
   :VARIANT==="media"?<NativeMedia/>
   :<NativeHub user={user}/>}
 </SafeAreaView>;
}
