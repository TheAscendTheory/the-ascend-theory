import {useEffect,useState} from "react";
import {Image,ScrollView,Switch,Text,TextInput,TouchableOpacity,View} from "react-native";
import type {User} from "@supabase/supabase-js";
import {api} from "./supabase";
import {styles,palette} from "./theme";
type Profile={user_id:string;headline:string;about:string;photo_url:string;banner_url:string;website_url:string;featured_skills:string[];publicly_visible:boolean};
type Initiative={id:string;user_id:string;title:string;summary:string;role_title:string;project_url:string;cover_url:string;publicly_visible:boolean;sort_order:number};
const empty={headline:"",about:"",photo_url:"",banner_url:"",website_url:"",featured_skills:[] as string[],publicly_visible:false};
const secure=(s:string)=>{try{return !s||new URL(s).protocol==="https:"}catch{return false}};
function Field({title,value,onChange,multiline=false}:{title:string;value:string;onChange:(s:string)=>void;multiline?:boolean}){return <View><Text style={styles.meta}>{title}</Text><TextInput value={value} onChangeText={onChange} style={multiline?styles.textArea:styles.textInput} multiline={multiline} numberOfLines={multiline?5:1}/></View>}
export default function HubProfile({user}:{user:User}){
 const [profile,setProfile]=useState<Profile>({...empty,user_id:user.id});
 const [initiatives,setInitiatives]=useState<Initiative[]>([]);
 const [title,setTitle]=useState("");
 const [role,setRole]=useState("");
 const [summary,setSummary]=useState("");
 const [projectUrl,setProjectUrl]=useState("");
 const [showInitiative,setShowInitiative]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 useEffect(()=>{
  if(!api)return;
  let active=true;
  async function load(){
   const [p,i]=await Promise.all([
    api!.from("ascend_hub_public_profiles").select("*").eq("user_id",user.id).maybeSingle(),
    api!.from("ascend_hub_portfolio_initiatives").select("id,user_id,title,summary,role_title,project_url,cover_url,publicly_visible,sort_order").eq("user_id",user.id).order("sort_order")
   ]);
   if(!active)return;
   if(p.data)setProfile(p.data as Profile);
   if(i.data)setInitiatives(i.data as Initiative[]);
   if(p.error||i.error)setMessage(p.error?.message||i.error?.message||"Unable to load profile");
  }
  void load();return()=>{active=false};
 },[user.id]);
 async function save(){
  if(!api||busy)return;
  if(![profile.photo_url,profile.banner_url,profile.website_url].every(secure)){setMessage("Photo, banner, and website must be HTTPS URLs.");return}
  setBusy(true);
  const {error}=await api.from("ascend_hub_public_profiles").upsert({...profile,user_id:user.id,featured_skills:profile.featured_skills.slice(0,20),updated_at:new Date().toISOString()},{onConflict:"user_id"});
  setBusy(false);setMessage(error?error.message:"Your profile is saved. Only approved, opted-in profiles appear publicly.");
 }
 async function addInitiative(){
  if(!api||!title.trim()||busy)return;
  if(!secure(projectUrl)){setMessage("Use a valid HTTPS project URL.");return}
  setBusy(true);
  const {data,error}=await api.from("ascend_hub_portfolio_initiatives").insert({user_id:user.id,title:title.trim(),summary:summary.trim(),role_title:role.trim(),project_url:projectUrl.trim(),publicly_visible:showInitiative,sort_order:initiatives.length}).select("id,user_id,title,summary,role_title,project_url,cover_url,publicly_visible,sort_order").single();
  setBusy(false);
  if(error){setMessage(error.message);return}
  if(data)setInitiatives(a=>[...a,data as Initiative]);
  setTitle("");setSummary("");setRole("");setProjectUrl("");setShowInitiative(false);setMessage("Initiative added to your portfolio.");
 }
 async function removeInitiative(id:string){
  if(!api||busy)return;
  setBusy(true);
  const {error}=await api.from("ascend_hub_portfolio_initiatives").delete().eq("id",id).eq("user_id",user.id);
  setBusy(false);
  if(error)setMessage(error.message);else setInitiatives(a=>a.filter(x=>x.id!==id));
 }
 return <View>
  <Text style={styles.section}>Your changemaker identity</Text>
  <Text style={styles.detail}>Build a professional profile and selectively showcase past and current initiatives. Your profile is private until you choose to share it.</Text>
  <View style={styles.panel}>
   {secure(profile.photo_url)&&profile.photo_url?<Image source={{uri:profile.photo_url}} style={{width:90,height:90,borderRadius:45,marginBottom:15}}/>:<View style={{width:90,height:90,borderRadius:45,backgroundColor:palette.wash,alignItems:"center",justifyContent:"center",marginBottom:15}}><Text style={{fontSize:26}}>✦</Text></View>}
   <Field title="Headline" value={profile.headline} onChange={v=>setProfile(p=>({...p,headline:v}))}/>
   <Field title="About your work and purpose" value={profile.about} multiline onChange={v=>setProfile(p=>({...p,about:v}))}/>
   <Field title="Photo URL (HTTPS)" value={profile.photo_url} onChange={v=>setProfile(p=>({...p,photo_url:v}))}/>
   <Field title="Banner URL (HTTPS)" value={profile.banner_url} onChange={v=>setProfile(p=>({...p,banner_url:v}))}/>
   <Field title="Professional website URL" value={profile.website_url} onChange={v=>setProfile(p=>({...p,website_url:v}))}/>
   <Field title="Disciplines / expertise (separated by commas)" value={profile.featured_skills.join(", ")} onChange={v=>setProfile(p=>({...p,featured_skills:v.split(",").map(z=>z.trim()).filter(Boolean)}))}/>
   <View style={{flexDirection:"row",alignItems:"center",gap:12,marginVertical:12}}><Switch value={profile.publicly_visible} onValueChange={v=>setProfile(p=>({...p,publicly_visible:v}))}/><Text style={[styles.detail,{flex:1}]}>Make my profile public after Club approval</Text></View>
   <TouchableOpacity accessibilityRole="button" onPress={()=>void save()} disabled={busy} style={styles.button}><Text style={styles.buttonText}>{busy?"Saving…":"Save my profile"}</Text></TouchableOpacity>
   <Text style={[styles.detail,{fontSize:12,marginTop:12}]}>For uploading an actual photo from your phone, use the web Hub profile editor. Native image picking is still being prepared.</Text>
  </View>
  <Text style={styles.section}>Selected initiatives</Text>
  {initiatives.map(i=><View key={i.id} style={styles.panel}><Text style={styles.meta}>{i.publicly_visible?"PUBLIC WHEN PROFILE IS PUBLIC":"PRIVATE"}</Text><Text style={styles.panelTitle}>{i.title}</Text><Text style={styles.detail}>{i.role_title}</Text><Text style={styles.detail}>{i.summary}</Text><TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={()=>void removeInitiative(i.id)}><Text style={styles.secondaryText}>Remove</Text></TouchableOpacity></View>)}
  <View style={styles.panel}><Text style={styles.panelTitle}>Showcase an initiative</Text>
   <Field title="Initiative title" value={title} onChange={setTitle}/>
   <Field title="Your role" value={role} onChange={setRole}/>
   <Field title="Description" multiline value={summary} onChange={setSummary}/>
   <Field title="Project website (optional)" value={projectUrl} onChange={setProjectUrl}/>
   <View style={{flexDirection:"row",alignItems:"center",gap:12,marginVertical:12}}><Switch value={showInitiative} onValueChange={setShowInitiative}/><Text style={[styles.detail,{flex:1}]}>Share this initiative on my public profile</Text></View>
   <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={()=>void addInitiative()} disabled={busy}><Text style={styles.buttonText}>Add to portfolio</Text></TouchableOpacity>
  </View>
  {message?<View style={styles.notice}><Text style={styles.noticeText}>{message}</Text></View>:null}
 </View>;
}
