import {useEffect,useMemo,useState} from "react";
import {Image,Linking,ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {api} from "./supabase";
import {palette,styles} from "./theme";
type Event={id:string;title:string;description:string;category:string;venue:string;city:string;country:string;starts_at:string;is_online:boolean;link_url:string};
type Project={id:string;title:string;description:string;discipline:string;country:string;city:string;website:string};
type PublicPerson={user_id:string;display_name:string;discipline:string;city:string;country:string;organization:string;headline:string;about:string;photo_url:string;banner_url:string;website_url:string;featured_skills:string[]};
type Portfolio={id:string;title:string;summary:string;role_title:string;project_url:string;featured:boolean};
const safeUrl=(s:string|null|undefined)=>{try{const u=new URL(s||"");return u.protocol==="https:"?u.toString():null}catch{return null}};
export default function HubDiscover({onApply}:{onApply:()=>void}){
 const [tab,setTab]=useState<"happening"|"projects"|"people">("happening");
 const [events,setEvents]=useState<Event[]>([]);
 const [projects,setProjects]=useState<Project[]>([]);
 const [people,setPeople]=useState<PublicPerson[]>([]);
 const [selected,setSelected]=useState<PublicPerson|null>(null);
 const [portfolio,setPortfolio]=useState<Portfolio[]>([]);
 const [query,setQuery]=useState("");
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 useEffect(()=>{
  if(!api){setError("Hub connection is unavailable.");setLoading(false);return}
  let current=true;
  async function load(){
   const [e,p,persons]=await Promise.all([
    api!.from("ascend_hub_events").select("id,title,description,category,venue,city,country,starts_at,is_online,link_url").eq("status","approved").gte("starts_at",new Date(Date.now()-86400000).toISOString()).order("starts_at").limit(100),
    api!.from("ascend_hub_projects").select("id,title,description,discipline,city,country,website").eq("status","approved").limit(100),
    api!.rpc("discover_ascend_hub_people")
   ]);
   if(!current)return;
   setEvents((e.data||[]) as Event[]);setProjects((p.data||[]) as Project[]);setPeople((persons.data||[]) as PublicPerson[]);
   if(e.error||p.error||persons.error)setError(e.error?.message||p.error?.message||persons.error?.message||"Directory unavailable");
   setLoading(false);
  }
  void load();return()=>{current=false};
 },[]);
 async function openPerson(p:PublicPerson){
  setSelected(p);setPortfolio([]);
  if(!api)return;
  const res=await api.rpc("discover_ascend_hub_portfolios",{p_user_id:p.user_id});
  if(res.error)setError(res.error.message);else setPortfolio((res.data||[]) as Portfolio[]);
 }
 const items=useMemo(()=>{
  const s=query.toLowerCase().trim();
  if(tab==="happening")return events.filter(e=>[e.title,e.description,e.category,e.city,e.country,e.venue].join(" ").toLowerCase().includes(s));
  if(tab==="projects")return projects.filter(p=>[p.title,p.description,p.discipline,p.city,p.country].join(" ").toLowerCase().includes(s));
  return people.filter(p=>[p.display_name,p.discipline,p.headline,p.city,p.country,p.organization].join(" ").toLowerCase().includes(s));
 },[tab,query,events,projects,people]);
 return <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
  <Text style={styles.eyebrow}>ASCEND HUB / GLOBAL DISCOVERY</Text><Text style={styles.hero}>WHAT'S HAPPENING.</Text>
  <Text style={styles.intro}>Explore real activities, initiatives and changemakers around the world. Browse freely; apply when you're ready to participate.</Text>
  {selected?<><TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={()=>setSelected(null)}><Text style={styles.secondaryText}>← Back to people</Text></TouchableOpacity>
   <View style={styles.panel}>
    {safeUrl(selected.banner_url)?<Image source={{uri:selected.banner_url}} style={{height:120,marginBottom:14}} resizeMode="cover"/>:null}
    {safeUrl(selected.photo_url)?<Image source={{uri:selected.photo_url}} style={{width:100,height:100,borderRadius:50,marginBottom:12}}/>:<View style={{width:85,height:85,borderRadius:45,backgroundColor:palette.wash,alignItems:"center",justifyContent:"center"}}><Text style={{fontSize:40,color:palette.green}}>{selected.display_name.slice(0,1)}</Text></View>}
    <Text style={styles.meta}>{selected.discipline||"CHANGEMAKER"}</Text><Text style={styles.panelTitle}>{selected.display_name}</Text><Text style={styles.detail}>{selected.headline||selected.organization}</Text><Text style={styles.detail}>{[selected.city,selected.country].filter(Boolean).join(", ")}</Text>
    <Text style={styles.section}>About</Text><Text style={styles.detail}>{selected.about||"No public biography."}</Text>
    {selected.featured_skills?.length?<Text style={styles.meta}>{selected.featured_skills.join(" · ")}</Text>:null}
    {safeUrl(selected.website_url)?<TouchableOpacity accessibilityRole="link" style={styles.secondaryButton} onPress={()=>void Linking.openURL(selected.website_url)}><Text style={styles.secondaryText}>Website ↗</Text></TouchableOpacity>:null}
   </View><Text style={styles.section}>Selected initiatives</Text>{portfolio.length?portfolio.map(p=><View key={p.id} style={styles.panel}><Text style={styles.meta}>{p.role_title||"INITIATIVE"}</Text><Text style={styles.panelTitle}>{p.title}</Text><Text style={styles.detail}>{p.summary}</Text>{safeUrl(p.project_url)?<TouchableOpacity accessibilityRole="link" onPress={()=>void Linking.openURL(p.project_url)}><Text style={styles.secondaryText}>View project ↗</Text></TouchableOpacity>:null}</View>):<Text style={styles.detail}>This member has not chosen to showcase past initiatives.</Text>}</>:
  <><View style={styles.segmented}>{(["happening","projects","people"] as const).map(t=><TouchableOpacity accessibilityRole="button" key={t} style={[styles.tab,tab===t?styles.tabOn:null]} onPress={()=>{setTab(t);setQuery("")}}><Text style={tab===t?styles.tabTextOn:styles.tabText}>{t==="happening"?"Happening":t==="projects"?"Projects":"People"}</Text></TouchableOpacity>)}</View>
   <TextInput style={styles.textInput} placeholder="Search activities, places and people" placeholderTextColor="#68796b" value={query} onChangeText={setQuery}/>
   <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:15}}><Text style={styles.section}>{tab==="happening"?"Upcoming activity":tab==="projects"?"Approved initiatives":"Changemakers"}</Text><Text style={styles.meta}>{items.length} RESULTS</Text></View>
   {loading?<Text style={styles.detail}>Loading public discovery…</Text>:items.length===0?<View style={styles.panel}><Text style={styles.panelTitle}>{query?"Nothing matches this search yet.":tab==="happening"?"Events are being curated.":tab==="projects"?"The first projects are being reviewed.":"The first profiles are being published."}</Text><Text style={styles.detail}>This directory shows real approved records only, never fabricated examples.</Text></View>:tab==="happening"?(items as Event[]).map(e=><View key={e.id} style={styles.panel}><Text style={styles.meta}>{e.category||"EVENT"}</Text><Text style={styles.panelTitle}>{e.title}</Text><Text style={styles.detail}>{e.description}</Text><Text style={styles.detail}>{new Date(e.starts_at).toLocaleString()}</Text><Text style={styles.detail}>{e.is_online?"Online":[e.venue,e.city,e.country].filter(Boolean).join(", ")}</Text>{safeUrl(e.link_url)?<TouchableOpacity accessibilityRole="link" style={styles.secondaryButton} onPress={()=>void Linking.openURL(e.link_url)}><Text style={styles.secondaryText}>Event details ↗</Text></TouchableOpacity>:null}</View>):tab==="projects"?(items as Project[]).map(p=><View style={styles.panel} key={p.id}><Text style={styles.meta}>{p.discipline||"INITIATIVE"}</Text><Text style={styles.panelTitle}>{p.title}</Text><Text style={styles.detail}>{p.description}</Text><Text style={styles.meta}>{[p.city,p.country].filter(Boolean).join(", ")}</Text>{safeUrl(p.website)?<TouchableOpacity accessibilityRole="link" style={styles.secondaryButton} onPress={()=>void Linking.openURL(p.website)}><Text style={styles.secondaryText}>Project website ↗</Text></TouchableOpacity>:null}</View>):(items as PublicPerson[]).map(p=><TouchableOpacity accessibilityRole="button" key={p.user_id} style={styles.panel} onPress={()=>void openPerson(p)}><View style={{flexDirection:"row",gap:13,alignItems:"center"}}>{safeUrl(p.photo_url)?<Image source={{uri:p.photo_url}} style={{width:66,height:66,borderRadius:33}}/>:<View style={{width:66,height:66,borderRadius:33,backgroundColor:palette.wash,justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:24}}>{p.display_name.slice(0,1)}</Text></View>}<View style={{flex:1}}><Text style={styles.meta}>{p.discipline||"ASCENDER"}</Text><Text style={styles.panelTitle}>{p.display_name}</Text><Text style={styles.detail}>{p.headline||p.organization}</Text></View></View></TouchableOpacity>)}
  </>}
  <View style={{marginTop:22}}><TouchableOpacity accessibilityRole="button" onPress={onApply} style={styles.button}><Text style={styles.buttonText}>Apply to join The Ascenders Club</Text></TouchableOpacity><Text style={[styles.detail,{marginTop:12}]}>Exploration is public. Member participation, publishing and direct collaboration require approval.</Text></View>
  {error?<View style={styles.notice}><Text style={styles.noticeText}>{error}</Text></View>:null}
  <View style={styles.spacer}/>
 </ScrollView>;
}
