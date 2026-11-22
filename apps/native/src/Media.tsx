import {useEffect,useState} from "react";
import {Linking,ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {useVideoPlayer,VideoView} from "expo-video";
import {api} from "./supabase";
import {styles,palette} from "./theme";
type Media={id:string;title:string;description:string;kind:string;source:"youtube"|"file";source_url:string;access_level:string;published:boolean};
function safeHttps(value:string){try{const u=new URL(value);return u.protocol==="https:"?u.toString():null;}catch{return null;}}
function VideoPlayer({url}:{url:string}){const player=useVideoPlayer(url,player=>player.play());return <VideoView player={player} style={{width:"100%",height:230,backgroundColor:"#000",marginBottom:16}} nativeControls contentFit="contain"/>;}
export default function NativeMedia(){
 const [items,setItems]=useState<Media[]>([]);
 const [active,setActive]=useState<Media|null>(null);
 const [search,setSearch]=useState("");
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState("");
 useEffect(()=>{
  if(!api){setMessage("Media catalogue connection unavailable.");setLoading(false);return;}
  let current=true;
  api.from("ascend_media_items").select("id,title,description,kind,source,source_url,access_level,published").eq("published",true).eq("access_level","free").order("created_at",{ascending:false}).limit(100).then(({data,error})=>{
   if(!current)return;setItems((data||[]) as Media[]);if(error)setMessage(error.message);setLoading(false);
  });
  return()=>{current=false;};
 },[]);
 const visible=items.filter(m=>[m.title,m.description,m.kind].join(" ").toLowerCase().includes(search.toLowerCase()));
 async function open(item:Media){
  const url=safeHttps(item.source_url);
  if(!url){setMessage("This media source is not valid.");return;}
  if(item.source==="file"&&["video","documentary","course"].includes(item.kind)){setActive(item);return;}
  try{await Linking.openURL(url);}catch{setMessage("This source could not be opened on your device.");}
 }
 return <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
  <Text style={styles.eyebrow}>ASCEND MEDIA / ORIGINAL STORIES</Text><Text style={styles.hero}>SEE BEYOND.</Text><Text style={styles.intro}>Films, interviews, documentaries and audio exploring changemakers, experiences and ideas.</Text>
  {active?<View><TouchableOpacity accessibilityRole="button" onPress={()=>setActive(null)} style={styles.secondaryButton}><Text style={styles.secondaryText}>Back to media library</Text></TouchableOpacity><Text style={styles.section}>{active.title}</Text>{safeHttps(active.source_url)?<VideoPlayer key={active.id} url={active.source_url}/>:null}<Text style={styles.detail}>{active.description}</Text></View>
  :<><TextInput style={styles.textInput} placeholder="Search published media" placeholderTextColor="#67796b" value={search} onChangeText={setSearch}/>
   <Text style={styles.section}>Watch and listen</Text>
   {loading?<Text style={styles.detail}>Loading published stories…</Text>:visible.length===0?<View style={styles.panel}><Text style={styles.panelTitle}>No published releases yet.</Text><Text style={styles.detail}>The Media library only shows real approved productions, not fictional previews.</Text></View>:visible.map(m=><TouchableOpacity accessibilityRole="button" style={styles.panel} key={m.id} onPress={()=>void open(m)}><Text style={styles.meta}>{m.kind.toUpperCase()}</Text><View style={{height:95,marginBottom:17,backgroundColor:palette.wash,borderWidth:1,borderColor:palette.line,justifyContent:"center",alignItems:"center"}}><View style={{width:65,height:65,borderWidth:1,borderRadius:50,borderColor:palette.black,justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:24,color:palette.ink}}>▶</Text></View></View><Text style={styles.panelTitle}>{m.title}</Text><Text style={styles.detail}>{m.description}</Text><Text style={[styles.detail,{fontWeight:"700",marginTop:14,color:palette.ink}]}>Open production</Text></TouchableOpacity>)}</>}
  {message?<View style={styles.notice}><Text style={styles.noticeText}>{message}</Text></View>:null}<View style={styles.spacer}/>
 </ScrollView>;
}
