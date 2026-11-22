"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,LockKeyhole} from "lucide-react";
import {createBrowserSupabaseClient} from "../../lib/supabaseBrowser";
import "../academy-app.css";
type Course={id:string;slug:string;title:string;summary:string;discipline:string;published:boolean};
type Lesson={id:string;course_id:string;title:string;content:string;sequence:number;published:boolean};
export default function AcademyCourseClient({slug}:{slug:string}){
 const supabase=useMemo(()=>createBrowserSupabaseClient(),[]);
 const [course,setCourse]=useState<Course|null>(null);
 const [lessons,setLessons]=useState<Lesson[]>([]);
 const [selected,setSelected]=useState<string|null>(null);
 const [complete,setComplete]=useState<Set<string>>(new Set());
 const [userId,setUserId]=useState("");
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 useEffect(()=>{
  if(!supabase){setMessage("Academy database connection unavailable.");setLoading(false);return;}
  let active=true;
  async function load(){
   if(!supabase)return;
   const c=await supabase.from("ascend_academy_courses").select("id,slug,title,summary,discipline,published").eq("slug",slug).eq("published",true).maybeSingle();
   if(!active)return;
   if(c.error||!c.data){setMessage("This course is not published or cannot be found.");setLoading(false);return;}
   setCourse(c.data as Course);
   const [l,auth]=await Promise.all([
    supabase.from("ascend_academy_lessons").select("id,course_id,title,content,sequence,published").eq("course_id",c.data.id).eq("published",true).order("sequence",{ascending:true}),
    supabase.auth.getUser()
   ]);
   if(!active)return;
   if(l.error){setMessage(l.error.message);setLoading(false);return;}
   setLessons((l.data||[]) as Lesson[]);setSelected(l.data?.[0]?.id||null);
   const user=auth.data.user;
   if(user){setUserId(user.id);const progress=await supabase.from("ascend_academy_lesson_completions").select("lesson_id").eq("user_id",user.id);if(active&&!progress.error)setComplete(new Set((progress.data||[]).map(x=>x.lesson_id)));}
   setLoading(false);
  }
  void load();
  return()=>{active=false;};
 },[slug,supabase]);
 const current=lessons.find(x=>x.id===selected)||null;
 const currentIndex=lessons.findIndex(x=>x.id===selected);
 const pct=lessons.length?Math.round(complete.size/lessons.length*100):0;
 async function markComplete(){
  if(!supabase||!current||!userId){setMessage("Sign in through Ascend Hub to save course progress.");return;}
  if(complete.has(current.id)){setMessage("Already completed.");return;}
  setBusy(true);setMessage("");
  const {error}=await supabase.from("ascend_academy_lesson_completions").insert({user_id:userId,lesson_id:current.id});
  setBusy(false);
  if(error){setMessage(error.message);return;}
  setComplete(prev=>new Set([...prev,current.id]));
  if(currentIndex+1<lessons.length)setSelected(lessons[currentIndex+1].id);
 }
 return <main className="ascAcademyApp"><section className="ascWrap ascAcademyCourseHero"><Link href="/academy" className="ascTextLink"><ArrowLeft size={16}/> All courses</Link><p className="ascOverline">{course?.discipline||"ASCEND ACADEMY"}</p><h1>{course?.title||"Course"}</h1><p>{course?.summary||""}</p></section>
 <section className="ascWrap ascAcademyReader">{loading?<p role="status">Loading course lessons…</p>:message&&!course?<p role="status">{message}</p>:<><aside className="ascAcademySyllabus"><p className="ascOverline">LEARNING PATH</p><h2>{lessons.length} lessons</h2><div className="ascAcademyProgress"><div style={{width:`${pct}%`}}/><span>{pct}% completed</span></div>{lessons.map((lesson,i)=><button key={lesson.id} type="button" aria-current={selected===lesson.id?"step":undefined} onClick={()=>{setSelected(lesson.id);setMessage("");}}><span>{String(i+1).padStart(2,"0")}</span><strong>{lesson.title}</strong>{complete.has(lesson.id)&&<CheckCircle2 size={17}/>}</button>)}<p>Progress syncs to your account when signed in.</p></aside><article className="ascAcademyLesson">{current?<><div className="ascAcademyLessonMeta"><BookOpen size={19}/> Lesson {currentIndex+1} of {lessons.length}</div><h2>{current.title}</h2><div className="ascAcademyLessonBody">{current.content.split("\n").map((paragraph,i)=>paragraph.trim()?<p key={i}>{paragraph}</p>:<div className="ascAcademyBreak" key={i}/>)}</div><div className="ascAcademyLessonActions"><button disabled={busy||complete.has(current.id)} onClick={()=>void markComplete()} type="button"><CheckCircle2 size={18}/>{complete.has(current.id)?"Completed":busy?"Saving…":"Mark lesson complete"}</button>{currentIndex+1<lessons.length&&<button type="button" onClick={()=>setSelected(lessons[currentIndex+1].id)}>Next lesson <ArrowRight size={18}/></button>}</div>{!userId&&<p className="ascAcademyAccountNotice"><LockKeyhole size={16}/> <Link href="/hub">Sign in to save progress</Link></p>}</>:<div className="ascAcademyEmpty"><h3>No published lessons yet.</h3><p>The course will become available once the author publishes lessons.</p></div>}{message&&<p className="ascAcademyNotice" role="status">{message}</p>}</article></>}</section>
 </main>;
}
