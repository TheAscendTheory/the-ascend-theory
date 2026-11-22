import {useEffect,useState} from "react";
import {ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import type {User} from "@supabase/supabase-js";
import {api} from "./supabase";
import {palette,styles} from "./theme";
import {SignIn,SignOut} from "./Auth";
type Course={id:string;slug:string;title:string;summary:string;discipline:string};
type Lesson={id:string;course_id:string;title:string;content:string;sequence:number};
export default function NativeAcademy({user}:{user:User|null}){
 const [courses,setCourses]=useState<Course[]>([]);
 const [course,setCourse]=useState<Course|null>(null);
 const [lessons,setLessons]=useState<Lesson[]>([]);
 const [lesson,setLesson]=useState<Lesson|null>(null);
 const [done,setDone]=useState<Set<string>>(new Set());
 const [search,setSearch]=useState("");
 const [busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState("");
 useEffect(()=>{
  if(!api){setLoading(false);setMessage("Academy database is not configured.");return;}
  let active=true;
  api.from("ascend_academy_courses").select("id,slug,title,summary,discipline").eq("published",true).order("created_at",{ascending:false}).then(({data,error})=>{
   if(!active)return;
   setCourses((data||[]) as Course[]);setLoading(false);if(error)setMessage(error.message);
  });
  return()=>{active=false;};
 },[]);
 useEffect(()=>{
  if(!api||!course){setLessons([]);setLesson(null);return;}
  let active=true;
  async function readCourse(){
   const res=await api!.from("ascend_academy_lessons").select("id,course_id,title,content,sequence").eq("course_id",course!.id).eq("published",true).order("sequence");
   if(!active)return;
   setLessons((res.data||[]) as Lesson[]);setLesson((res.data?.[0]||null) as Lesson|null);
   if(res.error)setMessage(res.error.message);
  }
  void readCourse();return()=>{active=false;};
 },[course?.id]);
 useEffect(()=>{
  if(!api||!user){setDone(new Set());return;}
  let active=true;
  api.from("ascend_academy_lesson_completions").select("lesson_id").eq("user_id",user.id).then(({data})=>{
   if(active)setDone(new Set((data||[]).map(x=>x.lesson_id)));
  });
  return()=>{active=false;};
 },[user?.id]);
 async function complete(){
  if(!api||!user||!lesson)return;
  setBusy(true);
  const {error}=await api.from("ascend_academy_lesson_completions").upsert({user_id:user.id,lesson_id:lesson.id},{onConflict:"user_id,lesson_id"});
  setBusy(false);
  if(error){setMessage(error.message);return;}
  setDone(previous=>new Set([...previous,lesson.id]));
  const idx=lessons.findIndex(x=>x.id===lesson.id);
  if(idx>=0&&idx<lessons.length-1)setLesson(lessons[idx+1]);
 }
 const visible=courses.filter(x=>[x.title,x.summary,x.discipline].join(" ").toLowerCase().includes(search.toLowerCase()));
 return <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
  <Text style={styles.eyebrow}>ASCEND ACADEMY / KNOWLEDGE</Text><Text style={styles.hero}>LEARN. EXPLORE. APPLY.</Text>
  {!course?<><Text style={styles.intro}>Learning experiences across disciplines, created and published by educators.</Text>
   <TextInput style={styles.textInput} placeholder="Search learning paths" placeholderTextColor="#627164" value={search} onChangeText={setSearch}/>
   <Text style={styles.section}>Learning library</Text>
   {loading?<Text style={styles.detail}>Loading courses…</Text>:visible.length===0?<View style={styles.panel}><Text style={styles.panelTitle}>No published courses yet.</Text><Text style={styles.detail}>New courses will appear here when instructors complete and publish their material.</Text></View>:visible.map(c=><TouchableOpacity accessibilityRole="button" key={c.id} style={styles.panel} onPress={()=>{setCourse(c);setMessage("");}}><Text style={styles.meta}>{c.discipline||"INTERDISCIPLINARY"}</Text><Text style={styles.panelTitle}>{c.title}</Text><Text style={styles.detail}>{c.summary}</Text><Text style={[styles.detail,{marginTop:12,fontWeight:"700",color:palette.ink}]}>Open course</Text></TouchableOpacity>)}
  </>:<>
   <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={()=>{setCourse(null);setLesson(null);}}><Text style={styles.secondaryText}>Back to learning library</Text></TouchableOpacity>
   <Text style={styles.section}>{course.title}</Text><Text style={styles.intro}>{course.summary}</Text>
   <Text style={styles.meta}>LEARNING PATH — {lessons.length} LESSONS</Text>
   {lessons.map((item,i)=><TouchableOpacity accessibilityRole="button" key={item.id} onPress={()=>setLesson(item)} style={[styles.panel,lesson?.id===item.id?styles.panelSelected:null]}><Text style={styles.meta}>{String(i+1).padStart(2,"0")} / {done.has(item.id)?"COMPLETED":"LESSON"}</Text><Text style={styles.panelTitle}>{item.title}</Text></TouchableOpacity>)}
   {lesson?<View style={styles.panel}><Text style={styles.meta}>CURRENT LESSON</Text><Text style={styles.section}>{lesson.title}</Text><Text style={[styles.detail,{fontSize:16,lineHeight:27}]}>{lesson.content}</Text>{!user?<SignIn title="Sign in to save your progress"/>:<TouchableOpacity accessibilityRole="button" disabled={busy||done.has(lesson.id)} style={[styles.button,{opacity:busy||done.has(lesson.id)?.5:1}]} onPress={()=>void complete()}><Text style={styles.buttonText}>{done.has(lesson.id)?"Lesson completed":busy?"Saving…":"Mark lesson complete"}</Text></TouchableOpacity>}</View>:<Text style={styles.detail}>No lessons are published in this course yet.</Text>}
  </>}
  {user?<SignOut/>:null}
  {message?<View style={styles.notice}><Text style={styles.noticeText}>{message}</Text></View>:null}
  <View style={styles.spacer}/>
 </ScrollView>;
}
