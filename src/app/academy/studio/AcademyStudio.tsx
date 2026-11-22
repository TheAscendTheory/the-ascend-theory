"use client";
import {FormEvent,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,BookOpen,Check,FilePlus,RefreshCcw} from "lucide-react";
import {createBrowserSupabaseClient} from "../../lib/supabaseBrowser";
import "../academy-app.css";
type Course={id:string;slug:string;title:string;summary:string;discipline:string;cover_url:string;published:boolean;created_at:string};
type Lesson={id:string;course_id:string;title:string;content:string;sequence:number;published:boolean};
const draft={title:"",slug:"",summary:"",discipline:""};
const lessonDraft={title:"",content:"",sequence:1};
export default function AcademyStudio(){
 const client=useMemo(()=>createBrowserSupabaseClient(),[]);
 const [userId,setUserId]=useState("");
 const [allowed,setAllowed]=useState(false);
 const [courses,setCourses]=useState<Course[]>([]);
 const [lessons,setLessons]=useState<Lesson[]>([]);
 const [selected,setSelected]=useState("");
 const [courseDraft,setCourseDraft]=useState(draft);
 const [lessonForm,setLessonForm]=useState(lessonDraft);
 const [editing,setEditing]=useState("");
 const [saving,setSaving]=useState(false);
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState("");
 async function refresh(){
  if(!client){setMessage("Academy database is not configured.");setLoading(false);return;}
  setLoading(true);
  const {data:{user}}=await client.auth.getUser();
  if(!user){setAllowed(false);setMessage("Sign in through Ascend Hub with an authorized administrator account.");setLoading(false);return;}
  setUserId(user.id);
  const admin=await client.rpc("is_ascend_hub_admin");
  if(admin.error||admin.data!==true){setAllowed(false);setMessage("This studio is restricted to authorized Club administrators.");setLoading(false);return;}
  setAllowed(true);
  const [c,l]=await Promise.all([
   client.from("ascend_academy_courses").select("id,slug,title,summary,discipline,cover_url,published,created_at").order("created_at",{ascending:false}).limit(200),
   client.from("ascend_academy_lessons").select("id,course_id,title,content,sequence,published").order("sequence",{ascending:true}).limit(1000)
  ]);
  if(c.error||l.error)setMessage(c.error?.message||l.error?.message||"Could not fetch courses.");
  setCourses((c.data||[]) as Course[]);setLessons((l.data||[]) as Lesson[]);
  setSelected(previous=>previous||(c.data?.[0]?.id||""));
  setLoading(false);
 }
 useEffect(()=>{void refresh();},[]);
 async function createCourse(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!client||!allowed||!userId)return;
  const slug=courseDraft.slug.trim().toLowerCase();
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)){setMessage("Slug must use lowercase letters, numbers and hyphens.");return;}
  setSaving(true);setMessage("");
  const {data,error}=await client.from("ascend_academy_courses").insert({...courseDraft,title:courseDraft.title.trim(),slug,created_by:userId,published:false}).select("id").single();
  setSaving(false);
  if(error){setMessage(error.message);return;}
  setCourseDraft(draft);if(data)setSelected(data.id);await refresh();setMessage("Course draft created. Add lessons before publishing.");
 }
 async function createLesson(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!client||!allowed||!selected)return;
  if(lessonForm.content.trim().length<30){setMessage("Write at least 30 characters of lesson content before saving.");return;}
  setSaving(true);setMessage("");
  const payload={course_id:selected,title:lessonForm.title.trim(),content:lessonForm.content.trim(),sequence:Number(lessonForm.sequence),published:false,updated_at:new Date().toISOString()};
  const result=editing?await client.from("ascend_academy_lessons").update(payload).eq("id",editing):await client.from("ascend_academy_lessons").insert(payload);
  setSaving(false);
  if(result.error){setMessage(result.error.message);return;}
  setEditing("");setLessonForm(lessonDraft);await refresh();setMessage("Lesson saved as a draft.");
 }
 async function setCoursePublished(course:Course,published:boolean){
  if(!client||!allowed)return;
  if(published&&!lessons.some(l=>l.course_id===course.id&&l.published)){setMessage("Publish at least one complete lesson before publishing a course.");return;}
  setSaving(true);const {error}=await client.from("ascend_academy_courses").update({published,updated_at:new Date().toISOString()}).eq("id",course.id);setSaving(false);
  if(error){setMessage(error.message);return;}setCourses(a=>a.map(x=>x.id===course.id?{...x,published}:x));setMessage(published?"Course published.":"Course unpublished.");
 }
 async function setLessonPublished(lesson:Lesson,published:boolean){
  if(!client||!allowed)return;
  if(published&&lesson.content.trim().length<30){setMessage("Add substantive lesson content before publishing.");return;}
  setSaving(true);const {error}=await client.from("ascend_academy_lessons").update({published,updated_at:new Date().toISOString()}).eq("id",lesson.id);setSaving(false);
  if(error){setMessage(error.message);return;}setLessons(a=>a.map(x=>x.id===lesson.id?{...x,published}:x));setMessage(published?"Lesson published.":"Lesson unpublished.");
 }
 function editLesson(l:Lesson){setEditing(l.id);setSelected(l.course_id);setLessonForm({title:l.title,content:l.content,sequence:l.sequence});window.scrollTo({top:0,behavior:"smooth"});}
 return <main className="ascAcademyApp">
  <section className="ascInnerHero ascWrap"><p className="ascOverline">ASCEND ACADEMY / EDITORIAL</p><h1>Learning <em>Studio.</em></h1><p>Build and publish original interdisciplinary learning paths. Lessons remain private until explicitly published.</p></section>
  <section className="ascWrap ascAcademyAdmin">
    <Link className="ascTextLink" href="/academy"><ArrowLeft size={16}/> Academy library</Link><button className="ascHubCreate" type="button" onClick={()=>void refresh()}><RefreshCcw size={16}/> Refresh</button>
    {loading&&<p role="status">Checking studio access…</p>}{message&&<p className="ascAcademyNotice" role="status">{message}</p>}
    {allowed&&<><div className="ascAcademyAdminGrid"><form className="ascAcademyEditor" onSubmit={createCourse}><h2>Create a course</h2><label htmlFor="ac-title">Course title</label><input id="ac-title" required minLength={5} maxLength={160} value={courseDraft.title} onChange={e=>setCourseDraft({...courseDraft,title:e.target.value})}/><label htmlFor="ac-slug">URL slug</label><input id="ac-slug" required placeholder="introduction-to..." value={courseDraft.slug} onChange={e=>setCourseDraft({...courseDraft,slug:e.target.value})}/><label htmlFor="ac-summary">Summary</label><textarea id="ac-summary" value={courseDraft.summary} onChange={e=>setCourseDraft({...courseDraft,summary:e.target.value})}/><label htmlFor="ac-field">Discipline</label><input id="ac-field" value={courseDraft.discipline} onChange={e=>setCourseDraft({...courseDraft,discipline:e.target.value})}/><button type="submit" disabled={saving}><FilePlus size={16}/> Save course draft</button></form>
    <form className="ascAcademyEditor" onSubmit={createLesson}><h2>{editing?"Edit lesson":"Write a lesson"}</h2><label htmlFor="al-course">Course</label><select id="al-course" required value={selected} onChange={e=>setSelected(e.target.value)}>{courses.length===0?<option value="">Create a course first</option>:courses.map(c=><option value={c.id} key={c.id}>{c.title}</option>)}</select><label htmlFor="al-title">Lesson title</label><input id="al-title" required minLength={3} value={lessonForm.title} onChange={e=>setLessonForm({...lessonForm,title:e.target.value})}/><label htmlFor="al-order">Sequence number</label><input id="al-order" required min={0} max={10000} type="number" value={lessonForm.sequence} onChange={e=>setLessonForm({...lessonForm,sequence:Number(e.target.value)})}/><label htmlFor="al-content">Lesson content</label><textarea id="al-content" required rows={10} minLength={30} value={lessonForm.content} onChange={e=>setLessonForm({...lessonForm,content:e.target.value})}/><button disabled={saving||!selected} type="submit"><BookOpen size={16}/> {editing?"Save revised lesson":"Save lesson draft"}</button>{editing&&<button type="button" onClick={()=>{setEditing("");setLessonForm(lessonDraft)}}>Cancel editing</button>}</form></div>
    <h2>Course review & publishing</h2>
    {courses.map(c=><article className="ascAcademyAdminItem" key={c.id}><h3>{c.title}</h3><p>{c.discipline||"Uncategorized"} · {c.published?"Published":"Draft"} · /academy/{c.slug}</p><p>{c.summary}</p><button type="button" disabled={saving} onClick={()=>void setCoursePublished(c,!c.published)}>{c.published?"Unpublish course":"Publish course"}</button>{lessons.filter(l=>l.course_id===c.id).map(l=><div key={l.id} style={{borderTop:"1px solid #cbd8cc",padding:"16px 0"}}><strong>{l.sequence}. {l.title}</strong><p>{l.published?"Published lesson":"Draft lesson"}</p><button type="button" onClick={()=>editLesson(l)}>Edit lesson</button><button type="button" disabled={saving} onClick={()=>void setLessonPublished(l,!l.published)}>{l.published?"Unpublish lesson":"Publish lesson"}</button></div>)}</article>)}
    </>}
  </section>
 </main>;
}
