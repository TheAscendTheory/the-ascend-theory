import {useEffect,useMemo,useState} from "react";
import {Linking,ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import type {User} from "@supabase/supabase-js";
import {api} from "./supabase";
import {styles,palette} from "./theme";
import {SignIn,SignOut,AccountControls} from "./Auth";
import HubDiscover from "./HubDiscover";
import HubProfile from "./HubProfile";

type Member={user_id:string;display_name:string;organization:string;city:string;country:string;discipline:string;bio:string;status:string};
type Project={id:string;owner_id:string;title:string;description:string;city:string;country:string;discipline:string;latitude:number|null;longitude:number|null;looking_for:string};
const emptyMember={display_name:"",organization:"",city:"",country:"",discipline:"",bio:""};
const emptyProject={title:"",description:"",city:"",country:"",discipline:"",looking_for:""};
function Field({label,value,onChange,multiline=false}:{label:string;value:string;onChange:(x:string)=>void;multiline?:boolean}){
 return <View><Text style={styles.meta}>{label}</Text><TextInput style={multiline?styles.textArea:styles.textInput} placeholderTextColor="#6e7f72" value={value} onChangeText={onChange} multiline={multiline} numberOfLines={multiline?4:1}/></View>;
}
export default function NativeHub({user}:{user:User|null}){
 const [membership,setMembership]=useState<Member|null>(null);
 const [people,setPeople]=useState<Member[]>([]);
 const [projects,setProjects]=useState<Project[]>([]);
 const [blocked,setBlocked]=useState<Set<string>>(new Set());
 const [reportTarget,setReportTarget]=useState<{type:"member"|"project";id:string;label:string}|null>(null);
 const [reportText,setReportText]=useState("");
 const [tab,setTab]=useState<"projects"|"people"|"submit"|"profile"|"discover">("discover");
 const [browsePublic,setBrowsePublic]=useState(true);
 const [memberForm,setMemberForm]=useState(emptyMember);
 const [projectForm,setProjectForm]=useState(emptyProject);
 const [search,setSearch]=useState("");
 const [busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState("");
 useEffect(()=>{
  if(!api||!user){setMembership(null);setPeople([]);setProjects([]);setBlocked(new Set());setLoading(false);return;}
  let active=true;
  async function load(){
   setLoading(true);
   const profile=await api!.from("ascend_hub_members").select("user_id,display_name,organization,city,country,discipline,bio,status").eq("user_id",user!.id).maybeSingle();
   if(!active)return;
   if(profile.error){setMessage(profile.error.message);setLoading(false);return;}
   setMembership(profile.data as Member|null);
   if(profile.data?.status==="approved"){
    const blockRows=await api!.from("ascend_hub_blocks").select("blocked_id").eq("blocker_id",user!.id);
    if(active)setBlocked(new Set((blockRows.data||[]).map(x=>x.blocked_id)));
    const [p,m]=await Promise.all([
     api!.from("ascend_hub_projects").select("id,owner_id,title,description,city,country,discipline,latitude,longitude,looking_for").eq("status","approved").limit(100),
     api!.from("ascend_hub_members").select("user_id,display_name,organization,city,country,discipline,bio,status").eq("status","approved").limit(100)
    ]);
    if(active){setProjects((p.data||[]) as Project[]);setPeople((m.data||[]) as Member[]);if(p.error||m.error)setMessage(p.error?.message||m.error?.message||"Directory load failed.");}
   }
   if(active)setLoading(false);
  }
  void load();
  return()=>{active=false;};
 },[user?.id]);
 async function apply(){
  if(!api||!user||busy)return;
  if(memberForm.display_name.trim().length<2){setMessage("Enter your public name.");return;}
  setBusy(true);setMessage("");
  const {data,error}=await api.from("ascend_hub_members").insert({...memberForm,user_id:user.id,status:"pending"}).select("user_id,display_name,organization,city,country,discipline,bio,status").single();
  setBusy(false);
  if(error)setMessage(error.message);
  else {setMembership(data as Member);setMessage("Application submitted for review.");}
 }
 async function submit(){
  if(!api||!user||busy)return;
  if(projectForm.title.trim().length<5||projectForm.description.trim().length<30){setMessage("A project needs a title and a description of at least 30 characters.");return;}
  setBusy(true);setMessage("");
  const {error}=await api.from("ascend_hub_projects").insert({...projectForm,owner_id:user.id,status:"pending"});
  setBusy(false);
  if(error)setMessage(error.message);
  else {setProjectForm(emptyProject);setTab("projects");setMessage("Project sent to the Club's review queue.");}
 }
 const shownProjects=projects.filter(p=>!blocked.has(p.owner_id)&&[p.title,p.description,p.city,p.country,p.discipline].join(" ").toLowerCase().includes(search.toLowerCase()));
 const shownPeople=people.filter(m=>!blocked.has(m.user_id)&&[m.display_name,m.organization,m.city,m.country,m.discipline].join(" ").toLowerCase().includes(search.toLowerCase()));
 async function reportIssue(){
  if(!api||!user||!reportTarget||busy)return;
  if(reportText.trim().length<10){setMessage("Describe the concern in at least ten characters.");return;}
  setBusy(true);
  const {error}=await api.from("ascend_hub_reports").insert({reporter_id:user.id,target_type:reportTarget.type,target_user_id:reportTarget.type==="member"?reportTarget.id:null,target_project_id:reportTarget.type==="project"?reportTarget.id:null,reason:reportText.trim().slice(0,1500)});
  setBusy(false);
  if(error){setMessage(error.message);return;}
  setReportTarget(null);setReportText("");setMessage("Report submitted for Club review.");
 }
 async function blockUser(id:string){
  if(!api||!user||id===user.id)return;
  const {error}=await api.from("ascend_hub_blocks").insert({blocker_id:user.id,blocked_id:id});
  if(error){setMessage(error.message);return;}
  setBlocked(prev=>new Set([...prev,id]));setMessage("Member blocked from your directory.");
 }
 function button(text:string,cb:()=>void,secondary=false){return <TouchableOpacity accessibilityRole="button" onPress={cb} style={secondary?styles.secondaryButton:styles.button}><Text style={secondary?styles.secondaryText:styles.buttonText}>{text}</Text></TouchableOpacity>;}
 if(browsePublic&&(!user||membership?.status!=="approved"&&!loading))return <HubDiscover onApply={()=>setBrowsePublic(false)}/>;
 if(user&&membership?.status==="approved"&&tab==="discover")return <View style={{flex:1}}><TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={()=>setTab("projects")}><Text style={styles.secondaryText}>← Member workspace</Text></TouchableOpacity><HubDiscover onApply={()=>setTab("profile")}/></View>;
 return <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
  <Text style={styles.eyebrow}>ASCEND HUB / CONNECTION</Text><Text style={styles.hero}>WE RISE TOGETHER.</Text><Text style={styles.intro}>A curated world of changemakers, opportunities and shared work.</Text>
  {!user?<SignIn title="Apply to join Ascend Hub"/>:loading?<Text style={styles.detail}>Loading your secure membership…</Text>:membership?.status!=="approved"?
   <><View style={styles.panel}><Text style={styles.panelTitle}>{membership?.status==="pending"?"Membership under review":membership?.status==="declined"?"Application not approved":"Request membership"}</Text><Text style={styles.detail}>{membership?.status==="pending"?"The Club reviews each request before directory access.":membership?.status==="declined"?"Contact the Club if you believe there has been an error.":"Tell us who you are and how you contribute."}</Text></View>
   {!membership&&<View><Field label="Public name" value={memberForm.display_name} onChange={x=>setMemberForm({...memberForm,display_name:x})}/><Field label="Organization" value={memberForm.organization} onChange={x=>setMemberForm({...memberForm,organization:x})}/><Field label="City" value={memberForm.city} onChange={x=>setMemberForm({...memberForm,city:x})}/><Field label="Country" value={memberForm.country} onChange={x=>setMemberForm({...memberForm,country:x})}/><Field label="Discipline" value={memberForm.discipline} onChange={x=>setMemberForm({...memberForm,discipline:x})}/><Field label="Your work" multiline value={memberForm.bio} onChange={x=>setMemberForm({...memberForm,bio:x})}/>{button(busy?"Submitting…":"Submit membership application",()=>void apply())}</View>}<AccountControls/><SignOut/></>
   :<><Text style={styles.meta}>APPROVED MEMBER / {membership.display_name}</Text><View style={styles.segmented}>{(["discover","projects","people","profile","submit"] as const).map(t=><TouchableOpacity accessibilityRole="button" key={t} style={[styles.tab,tab===t?styles.tabOn:null]} onPress={()=>{setTab(t);setMessage("");}}><Text style={tab===t?styles.tabTextOn:styles.tabText}>{t==="submit"?"Contribute":t==="people"?"Members":t==="profile"?"My profile":t==="discover"?"Explore":"Projects"}</Text></TouchableOpacity>)}</View>
   {tab==="discover"?<View><HubDiscover onApply={()=>setTab("profile")}/></View>:tab==="profile"?<HubProfile user={user}/>:tab==="submit"?<View><Text style={styles.section}>Propose an initiative</Text><Text style={styles.intro}>Submissions require moderation before other members can discover them.</Text><Field label="Project title" value={projectForm.title} onChange={x=>setProjectForm({...projectForm,title:x})}/><Field label="Description" multiline value={projectForm.description} onChange={x=>setProjectForm({...projectForm,description:x})}/><Field label="Discipline" value={projectForm.discipline} onChange={x=>setProjectForm({...projectForm,discipline:x})}/><Field label="City" value={projectForm.city} onChange={x=>setProjectForm({...projectForm,city:x})}/><Field label="Country" value={projectForm.country} onChange={x=>setProjectForm({...projectForm,country:x})}/><Field label="Seeking collaborators" value={projectForm.looking_for} onChange={x=>setProjectForm({...projectForm,looking_for:x})}/>{button(busy?"Submitting…":"Submit for review",()=>void submit())}</View>
   :<><TextInput style={styles.textInput} value={search} onChangeText={setSearch} placeholder="Search people, projects or locations" placeholderTextColor="#6d7a70"/><Text style={styles.section}>{tab==="projects"?"Initiatives":"Members"}</Text>
   {tab==="projects"?(shownProjects.length===0?<Text style={styles.detail}>No approved projects match this search.</Text>:shownProjects.map(p=><View key={p.id} style={styles.panel}><Text style={styles.meta}>{p.discipline||"INITIATIVE"}</Text><Text style={styles.panelTitle}>{p.title}</Text><Text style={styles.detail}>{p.description}</Text><Text style={[styles.detail,{marginTop:10}]}>{[p.city,p.country].filter(Boolean).join(", ")||"Worldwide"}</Text>{p.looking_for?<Text style={styles.detail}>Looking for: {p.looking_for}</Text>:null}{p.latitude!==null&&p.longitude!==null?button("View project on map",()=>void Linking.openURL(`https://www.openstreetmap.org/?mlat=${p.latitude}&mlon=${p.longitude}#map=8/${p.latitude}/${p.longitude}`),true):null}{button("Report project",()=>{setReportTarget({type:"project",id:p.id,label:p.title});setReportText("");},true)}</View>))
   :(shownPeople.length===0?<Text style={styles.detail}>No approved members match this search.</Text>:shownPeople.map(m=><View style={styles.panel} key={m.user_id}><Text style={styles.meta}>{m.discipline||"ASCENDER"}</Text><Text style={styles.panelTitle}>{m.display_name}</Text><Text style={styles.detail}>{m.organization||""}</Text><Text style={styles.detail}>{[m.city,m.country].filter(Boolean).join(", ")}</Text><Text style={[styles.detail,{marginTop:10}]}>{m.bio}</Text>{button("Report member",()=>{setReportTarget({type:"member",id:m.user_id,label:m.display_name});setReportText("");},true)}{m.user_id!==user.id?button("Block member",()=>void blockUser(m.user_id),true):null}</View>))}</>}
   <AccountControls/><SignOut/></>}
  {reportTarget&&user?<View style={[styles.panel,{borderColor:"#000"}]}>
    <Text style={styles.section}>Report {reportTarget.type}</Text><Text style={styles.detail}>{reportTarget.label}</Text>
    <Field label="Describe the concern" value={reportText} multiline onChange={setReportText}/>
    {button(busy?"Sending…":"Submit report",()=>void reportIssue())}
    {button("Cancel report",()=>{setReportTarget(null);setReportText("");},true)}
  </View>:null}
  {message?<View style={styles.notice}><Text style={styles.noticeText}>{message}</Text></View>:null}
  <View style={styles.spacer}/>
 </ScrollView>;
}
