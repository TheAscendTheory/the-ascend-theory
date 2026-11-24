import {useEffect,useRef,useState} from "react";
import {Image,Linking,ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {useVideoPlayer,VideoView} from "expo-video";
import {api} from "./supabase";
import {styles,palette} from "./theme";

type Media={id:string;title:string;description:string;kind:string;source:"youtube"|"file";source_url:string;thumbnail_url:string|null;access_level:string};
type Playlist={id:string;title:string;description:string;thumbnail_url:string|null;published:boolean};
type Entry={playlist_id:string;media_id:string;sequence:number};
const validUrl=(value:string|null|undefined)=>{try{const u=new URL(value||"");return u.protocol==="https:"?u.toString():null}catch{return null}};
const isVideo=(m:Media)=>!["podcast","audio","music"].includes(m.kind);
const isDirect=(m:Media)=>m.source==="file"&&Boolean(validUrl(m.source_url));
function MediaPlayer({queue,index,onNext,onBack}:{queue:Media[];index:number;onNext:()=>void;onBack:()=>void}){
 const item=queue[index];
 const url=validUrl(item?.source_url);
 const [paused,setPaused]=useState(false);
 const [error,setError]=useState("");
 const busy=useRef(false);
 // One native player survives track changes within the player view.
 const player=useVideoPlayer(null,p=>{
  p.staysActiveInBackground=true;
  p.showNowPlayingNotification=true;
  p.audioMixingMode="doNotMix";
  p.loop=false;
 });
 useEffect(()=>{
  if(!item||!url)return;
  let active=true;
  busy.current=true;
  setError("");setPaused(false);
  void player.replaceAsync({uri:url,metadata:{title:item.title,artist:"The Ascenders Club"}}).then(()=>{
   if(active){busy.current=false;player.play()}
  }).catch(e=>{busy.current=false;if(active)setError(String(e))});
  return()=>{active=false};
 },[item.id,url,player]);
 useEffect(()=>{
  const subscription=player.addListener("playToEnd",()=>{
   if(!busy.current&&index<queue.length-1)onNext();
   else setPaused(true);
  });
  return()=>subscription.remove();
 },[player,index,queue.length,onNext]);
 if(!item)return null;
 return <View style={styles.panel}>
  <Text style={styles.meta}>NOW PLAYING · {index+1} OF {queue.length}</Text>
  {isVideo(item)?<VideoView player={player} nativeControls contentFit="contain" allowsPictureInPicture style={{height:230,width:"100%",backgroundColor:"#101510",marginVertical:15}}/>:<View style={{height:180,backgroundColor:palette.wash,alignItems:"center",justifyContent:"center",marginVertical:15}}>
   {validUrl(item.thumbnail_url)?<Image source={{uri:item.thumbnail_url!}} style={{width:"100%",height:"100%"}} resizeMode="cover"/>:<Text style={{fontSize:52,color:palette.green}}>♫</Text>}
  </View>}
  <Text style={styles.panelTitle}>{item.title}</Text><Text style={styles.detail}>{item.description}</Text>
  {error?<Text style={styles.detail}>Playback error: {error}</Text>:null}
  <View style={{flexDirection:"row",gap:10,marginTop:18,flexWrap:"wrap"}}>
   <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={onBack}><Text style={styles.secondaryText}>← Library</Text></TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={()=>{if(player.playing){player.pause();setPaused(true)}else{player.play();setPaused(false)}}}><Text style={styles.secondaryText}>{paused?"▶ Play":"Ⅱ Pause"}</Text></TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} disabled={index===queue.length-1} onPress={onNext}><Text style={styles.secondaryText}>Next →</Text></TouchableOpacity>
  </View>
  <Text style={[styles.detail,{marginTop:14,fontSize:12}]}>Playback uses hosted audio or video sources. Background audio and lock-screen controls require a signed native build and real-device verification. Automatic queue transitions may be affected by operating-system background suspension.</Text>
 </View>;
}
export default function NativeMedia(){
 const [items,setItems]=useState<Media[]>([]);
 const [playlists,setPlaylists]=useState<Playlist[]>([]);
 const [entries,setEntries]=useState<Entry[]>([]);
 const [selection,setSelection]=useState<Media[]>([]);
 const [activeIndex,setActiveIndex]=useState(0);
 const [search,setSearch]=useState("");
 const [filter,setFilter]=useState("all");
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState("");
 useEffect(()=>{
  if(!api){setMessage("Media catalogue connection unavailable.");setLoading(false);return}
  let current=true;
  async function load(){
   const [a,b,c,d]=await Promise.all([
    api!.from("ascend_media_items").select("id,title,description,kind,source,source_url,thumbnail_url,access_level").eq("published",true).eq("access_level","free").order("created_at",{ascending:false}).limit(200),
    api!.from("ascend_media_playlists").select("id,title,description,thumbnail_url,published").eq("published",true).limit(100),
    api!.from("ascend_media_playlist_entries").select("playlist_id,media_id,sequence").order("sequence").limit(500),
    api!.from("ascend_demo_fixtures").select("payload").eq("kind","media_item")
   ]);
   if(!current)return;
   const samples=((d.data||[]).map(x=>x.payload)) as Media[];
   setItems([...(a.data||[]) as Media[],...samples]);
   const samplePlaylist:Playlist={id:"demo-mixed-queue",title:"DEMO · Mixed film + audio collection",description:"Test the shared player with a sample video, podcast audio and another video. Fictional content.",thumbnail_url:null,published:true};
   setPlaylists([...(b.data||[]) as Playlist[],...(samples.length?[samplePlaylist]:[])]);
   const sampleEntries= samples.map((m,i)=>({playlist_id:"demo-mixed-queue",media_id:m.id,sequence:i}));
   setEntries([...(c.data||[]) as Entry[],...sampleEntries]);
   if(a.error||b.error||c.error)setMessage(a.error?.message||b.error?.message||c.error?.message||"Could not read playlists");
   setLoading(false);
  }
  void load();return()=>{current=false};
 },[]);
 async function playSelection(queue:Media[],index=0){
  const available=queue.filter(isDirect);
  if(!available.length){setMessage("This title uses an external source. Continuous background playback requires a licensed direct HTTPS media stream.");return}
  setMessage("");
  setSelection(available);
  setActiveIndex(Math.min(index,available.length-1));
 }
 async function selectItem(m:Media){
  if(!isDirect(m)){const url=validUrl(m.source_url);if(url){try{await Linking.openURL(url)}catch{setMessage("The external source could not be opened.")}}else setMessage("This source cannot be played.");return}
  await playSelection([m]);
 }
 const next=()=>setActiveIndex(i=>Math.min(i+1,selection.length-1));
 const categories=["all",...new Set(items.map(m=>m.kind))];
 const visible=items.filter(m=>(filter==="all"||m.kind===filter)&&[m.title,m.description,m.kind].join(" ").toLowerCase().includes(search.toLowerCase()));
 return <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
  <Text style={styles.eyebrow}>ASCEND MEDIA / WATCH & LISTEN · DEMO MODE</Text>
  <Text style={styles.hero}>STORIES WITHOUT LIMITS.</Text>
  <Text style={styles.intro}>Film, interviews, documentaries and podcasts in one library. Your listening and viewing share a single experience.</Text>
  {selection.length>0?<MediaPlayer queue={selection} index={activeIndex} onNext={next} onBack={()=>{setSelection([]);setActiveIndex(0)}}/>:
  <>
   <TextInput style={styles.textInput} placeholder="Search films, music and podcasts" placeholderTextColor="#67796b" value={search} onChangeText={setSearch}/>
   <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:12}}>
    {categories.map(c=><TouchableOpacity accessibilityRole="button" key={c} onPress={()=>setFilter(c)} style={[styles.secondaryButton,{marginRight:8,backgroundColor:filter===c?palette.wash:undefined}]}><Text style={styles.secondaryText}>{c==="all"?"All formats":c}</Text></TouchableOpacity>)}
   </ScrollView>
   {playlists.length>0?<><Text style={styles.section}>Curated playlists</Text>{playlists.map(p=>{
    const queue=entries.filter(x=>x.playlist_id===p.id).sort((x,y)=>x.sequence-y.sequence).map(e=>items.find(i=>i.id===e.media_id)).filter((x):x is Media=>!!x);
    return <TouchableOpacity accessibilityRole="button" key={p.id} style={styles.panel} onPress={()=>void playSelection(queue)}><Text style={styles.meta}>MIXED MEDIA · {queue.length} TITLES</Text><Text style={styles.panelTitle}>{p.title}</Text><Text style={styles.detail}>{p.description}</Text><Text style={styles.meta}>▶ PLAY COLLECTION</Text></TouchableOpacity>;
   })}</>:null}
   <Text style={styles.section}>Browse releases</Text>
   {loading?<Text style={styles.detail}>Loading media…</Text>:visible.length===0?<View style={styles.panel}><Text style={styles.panelTitle}>No published releases yet.</Text><Text style={styles.detail}>The library will show original films and audio after real editorial publication.</Text></View>:visible.map(m=><TouchableOpacity accessibilityRole="button" key={m.id} onPress={()=>void selectItem(m)} style={styles.panel}>
    {validUrl(m.thumbnail_url)?<Image source={{uri:m.thumbnail_url!}} style={{height:160,marginBottom:12}} resizeMode="cover"/>:<View style={{height:120,backgroundColor:palette.wash,marginBottom:12,alignItems:"center",justifyContent:"center"}}><Text style={{fontSize:34,color:palette.green}}>▷</Text></View>}
    <Text style={styles.meta}>{m.id.startsWith("demo-")?"DEMO · "+m.kind.toUpperCase():m.kind.toUpperCase()}</Text><Text style={styles.panelTitle}>{m.title}</Text><Text style={styles.detail}>{m.description}</Text>
    <Text style={[styles.detail,{marginTop:10,color:palette.ink,fontWeight:"700"}]}>{isDirect(m)?"Play in Ascend Media":"Open external source"}</Text>
   </TouchableOpacity>)}
  </>}
  {message?<View style={styles.notice}><Text style={styles.noticeText}>{message}</Text></View>:null}<View style={styles.spacer}/>
 </ScrollView>;
}
