import {useEffect,useState} from "react";
import {ScrollView,Text,TextInput,TouchableOpacity,View,StyleSheet} from "react-native";
import {useVideoPlayer,VideoView} from "expo-video";
import type {User} from "@supabase/supabase-js";
import {api} from "./supabase";
import {palette,styles} from "./theme";
const academyUI=StyleSheet.create({...styles,
body:{...styles.body,backgroundColor:"#111712"},
eyebrow:{...styles.eyebrow,color:"#c7b47b"},
hero:{...styles.hero,color:"#f7f1e6",fontWeight:"400",letterSpacing:-2.5},
intro:{...styles.intro,color:"#bbc6ba"},
section:{...styles.section,color:"#f4f0e5",fontWeight:"500"},
panel:{...styles.panel,backgroundColor:"#1b261f",borderColor:"#3a4b3d",borderRadius:14},
panelSelected:{...styles.panelSelected,borderColor:"#c5ae78"},
panelTitle:{...styles.panelTitle,color:"#f5f2ea",fontWeight:"500"},
detail:{...styles.detail,color:"#c6d0c3"},
meta:{...styles.meta,color:"#cfb985"},
textInput:{...styles.textInput,backgroundColor:"#1d2920",color:"#f6f1e7",borderColor:"#405744",borderRadius:10},
textArea:{...styles.textArea,backgroundColor:"#1d2920",color:"#f6f1e7",borderColor:"#405744",borderRadius:10},
button:{...styles.button,backgroundColor:"#cbb680",borderColor:"#cbb680",borderRadius:9},
buttonText:{...styles.buttonText,color:"#152015"},
secondaryButton:{...styles.secondaryButton,backgroundColor:"#253528",borderColor:"#557052",borderRadius:9},
secondaryText:{...styles.secondaryText,color:"#f0f1e7"},
notice:{...styles.notice,backgroundColor:"#30402f",borderLeftColor:"#d0b77f"},
noticeText:{...styles.noticeText,color:"#f0e4c9"}
});

import {SignIn,SignOut,AccountControls} from "./Auth";
type Format="passage"|"video"|"audio"|"interactive";
type DemoQuestion={prompt:string;choices:string[];answer:number};
type Course={id:string;slug:string;title:string;summary:string;discipline:string;demo?:boolean;lessons?:Array<Lesson & {formats?:Array<LessonFormat & {choices?:string[];answer?:number}>}>;quiz?:DemoQuestion[]};
type Lesson={id:string;course_id:string;title:string;content:string;sequence:number};
type LessonFormat={id:string;lesson_id:string;format:Format;title:string;body:string;source_url:string;sort_order:number};
type Assessment={id:string;course_id:string;title:string;passing_percent:number};
type Question={id:string;assessment_id:string;prompt:string;choices:string[];sequence:number};
type Mark={correct_count:number;question_count:number;score_percent:number;passed:boolean};
const modes:{key:Format;title:string;hint:string}[]=[
 {key:"video",title:"Watch",hint:"Video lectures"},
 {key:"interactive",title:"Practice",hint:"Active learning"},
 {key:"passage",title:"Read",hint:"Written passages"},
 {key:"audio",title:"Listen",hint:"Audio lessons"}
];
function validHttps(s:string){try{return new URL(s).protocol==="https:"}catch{return false}}
function FormatPlayer({url,audio}:{url:string;audio:boolean}){
 const player=useVideoPlayer(url,p=>{p.staysActiveInBackground=audio;p.play()});
 return <VideoView player={player} nativeControls contentFit="contain" style={{height:audio?120:225,backgroundColor:"#162019",marginVertical:15,width:"100%"}}/>;
}
export default function NativeAcademy({user}:{user:User|null}){
 const [courses,setCourses]=useState<Course[]>([]);
 const [course,setCourse]=useState<Course|null>(null);
 const [lessons,setLessons]=useState<Lesson[]>([]);
 const [lesson,setLesson]=useState<Lesson|null>(null);
 const [formats,setFormats]=useState<LessonFormat[]>([]);
 const [format,setFormat]=useState<Format>("passage");
 const [preferred,setPreferred]=useState<Format>("passage");
 const [assessments,setAssessments]=useState<Assessment[]>([]);
 const [quiz,setQuiz]=useState<Assessment|null>(null);
 const [questions,setQuestions]=useState<Question[]>([]);
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [result,setResult]=useState<Mark|null>(null);
 const [done,setDone]=useState<Set<string>>(new Set());
 const [search,setSearch]=useState("");
 const [busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState("");
 useEffect(()=>{
  if(!api){setLoading(false);setMessage("Academy database connection unavailable.");return}
  let current=true;
  void Promise.all([api.from("ascend_academy_courses").select("id,slug,title,summary,discipline").eq("published",true).order("created_at",{ascending:false}),api.from("ascend_demo_fixtures").select("payload").eq("kind","academy_course")]).then(([real,demos])=>{
   if(!current)return;
   setCourses([...(real.data||[]) as Course[],...(demos.data||[]).map(x=>x.payload as Course)]);
   setLoading(false);
   if(real.error||demos.error)setMessage(real.error?.message||demos.error?.message||"Courses unavailable");
  });
  return()=>{current=false};
 },[]);
 useEffect(()=>{
  if(!api||!user){setDone(new Set());return}
  let current=true;
  void Promise.all([
   api.from("ascend_academy_lesson_completions").select("lesson_id").eq("user_id",user.id),
   api.from("ascend_academy_learning_preferences").select("preferred_format").eq("user_id",user.id).maybeSingle()
  ]).then(([completion,pref])=>{if(!current)return;setDone(new Set((completion.data||[]).map(x=>x.lesson_id)));if(pref.data?.preferred_format)setPreferred(pref.data.preferred_format as Format)});
  return()=>{current=false};
 },[user?.id]);
 useEffect(()=>{
  if(!api||!course){setLessons([]);setAssessments([]);return}
  if(course.demo){const d=course.lessons||[];setLessons(d);setLesson(d[0]||null);setAssessments(course.quiz?.length?[{id:"demo-assessment",course_id:course.id,title:"Demo knowledge check",passing_percent:60}]:[]);return}
  let current=true;
  void Promise.all([
   api.from("ascend_academy_lessons").select("id,course_id,title,content,sequence").eq("course_id",course.id).eq("published",true).order("sequence"),
   api.from("ascend_academy_assessments").select("id,course_id,title,passing_percent").eq("course_id",course.id).eq("published",true)
  ]).then(([l,a])=>{
   if(!current)return;
   setLessons((l.data||[]) as Lesson[]);setLesson((l.data?.[0]||null) as Lesson|null);
   setAssessments((a.data||[]) as Assessment[]);
   if(l.error||a.error)setMessage(l.error?.message||a.error?.message||"Course cannot load");
  });
  return()=>{current=false};
 },[course?.id]);
 useEffect(()=>{
  if(!api||!lesson){setFormats([]);return}
  if(course?.demo){const d=course.lessons?.find(l=>l.id===lesson.id)?.formats||[];setFormats(d);setFormat(d.some(x=>x.format==="passage")?"passage":d[0]?.format||"passage");return}
  let current=true;
  api.from("ascend_academy_lesson_formats").select("id,lesson_id,format,title,body,source_url,sort_order").eq("lesson_id",lesson.id).eq("published",true).order("sort_order").then(({data,error})=>{
   if(!current)return;setFormats((data||[]) as LessonFormat[]);
   const available=(data||[]).map(x=>x.format);
   setFormat(available.includes(preferred)?preferred:available.includes("passage")?"passage":available[0] as Format||"passage");
   if(error)setMessage(error.message);
  });
  return()=>{current=false};
 },[lesson?.id,preferred]);
 async function setMode(v:Format){setFormat(v);setPreferred(v);if(api&&user){await api.from("ascend_academy_learning_preferences").upsert({user_id:user.id,preferred_format:v,updated_at:new Date().toISOString()},{onConflict:"user_id"})}}
 async function complete(){
  if(course?.demo&&lesson){setDone(v=>new Set([...v,lesson.id]));const i=lessons.findIndex(l=>l.id===lesson.id);if(i>=0&&i<lessons.length-1)setLesson(lessons[i+1]);return}
  if(!api||!user||!lesson)return;
  setBusy(true);
  const {error}=await api.from("ascend_academy_lesson_completions").upsert({user_id:user.id,lesson_id:lesson.id},{onConflict:"user_id,lesson_id"});
  setBusy(false);if(error){setMessage(error.message);return}
  setDone(v=>new Set([...v,lesson.id]));const i=lessons.findIndex(l=>l.id===lesson.id);if(i>=0&&i<lessons.length-1)setLesson(lessons[i+1]);
 }
 async function openAssessment(a:Assessment){
  if(!api)return;
  setQuiz(a);setResult(null);setAnswers({});
  if(course?.demo){setQuestions((course.quiz||[]).map((q,i)=>({id:"demo-question-"+i,assessment_id:a.id,prompt:q.prompt,choices:q.choices,sequence:i})));return}
  const r=await api.from("ascend_academy_assessment_questions").select("id,assessment_id,prompt,choices,sequence").eq("assessment_id",a.id).order("sequence");
  setQuestions((r.data||[]) as Question[]);if(r.error)setMessage(r.error.message);
 }
 async function submitAnswers(){
  if(!api||!quiz)return;
  if(questions.some(q=>answers[q.id]===undefined)){setMessage("Answer each question to see your marks.");return}
  if(course?.demo){const correct=(course.quiz||[]).filter((q,i)=>answers["demo-question-"+i]===q.answer).length;const total=course.quiz?.length||1;const score=Math.round(correct*100/total);setResult({correct_count:correct,question_count:total,score_percent:score,passed:score>=60});setMessage("DEMO marks only. No actual progress or results were saved.");return}
  if(!user)return;
  setBusy(true);setMessage("");
  const {data,error}=await api.rpc("submit_ascend_academy_assessment",{p_assessment_id:quiz.id,p_answers:answers});
  setBusy(false);
  if(error){setMessage(error.message);return}
  const mark=Array.isArray(data)?data[0]:data;
  setResult((mark||null) as Mark|null);
 }
 const visible=courses.filter(c=>[c.title,c.summary,c.discipline].join(" ").toLowerCase().includes(search.toLowerCase()));
 const formatsForLesson=formats.filter(f=>f.format===format);
 return <ScrollView style={academyUI.body} keyboardShouldPersistTaps="handled">
  <Text style={academyUI.eyebrow}>ASCEND ACADEMY / KNOWLEDGE · DEMO MODE</Text>
  <Text style={academyUI.hero}>LEARN YOUR WAY.</Text>
  {!course?<><Text style={academyUI.intro}>Video lectures, written passages, audio and interactive practice—choose the way you understand best. No hearts, no punishment for trying again.</Text>
   <TextInput style={academyUI.textInput} placeholder="Discover learning paths" placeholderTextColor="#687567" value={search} onChangeText={setSearch}/>
   <Text style={academyUI.section}>Learning library</Text>
   {loading?<Text style={academyUI.detail}>Loading courses…</Text>:visible.length?visible.map(c=><TouchableOpacity accessibilityRole="button" key={c.id} style={academyUI.panel} onPress={()=>{setCourse(c);setQuiz(null);setResult(null);setMessage("")}}><Text style={academyUI.meta}>{c.demo?"DEMO COURSE · "+(c.discipline||"INTERDISCIPLINARY"):c.discipline||"INTERDISCIPLINARY"}</Text><Text style={academyUI.panelTitle}>{c.title}</Text><Text style={academyUI.detail}>{c.summary}</Text><Text style={[academyUI.detail,{marginTop:14,fontWeight:"700",color:palette.ink}]}>Begin learning →</Text></TouchableOpacity>):<View style={academyUI.panel}><Text style={academyUI.panelTitle}>The first courses are being prepared.</Text><Text style={academyUI.detail}>Published educator-approved lessons will appear here. No fabricated courses have been added.</Text></View>}
  </>:<>
   <TouchableOpacity accessibilityRole="button" style={academyUI.secondaryButton} onPress={()=>{setCourse(null);setQuiz(null);setLesson(null)}}><Text style={academyUI.secondaryText}>← Learning library</Text></TouchableOpacity>
   <Text style={academyUI.section}>{course.title}</Text><Text style={academyUI.intro}>{course.summary}</Text>
   {quiz?<View style={academyUI.panel}><Text style={academyUI.meta}>ASSESSMENT · UNLIMITED RETAKES</Text><Text style={academyUI.panelTitle}>{quiz.title}</Text>
    {questions.map((q,i)=><View key={q.id} style={{marginVertical:14}}><Text style={academyUI.detail}>{i+1}. {q.prompt}</Text>{q.choices.map((choice,j)=><TouchableOpacity key={j} accessibilityRole="button" onPress={()=>setAnswers(x=>({...x,[q.id]:j}))} style={[academyUI.secondaryButton,{marginTop:7,backgroundColor:answers[q.id]===j?palette.wash:undefined}]}><Text style={academyUI.secondaryText}>{answers[q.id]===j?"◉ ":"○ "}{choice}</Text></TouchableOpacity>)}</View>)}
    {!user&&!course?.demo?<SignIn title="Sign in to receive your assessment marks"/>:<TouchableOpacity accessibilityRole="button" disabled={busy||questions.length===0} onPress={()=>void submitAnswers()} style={academyUI.button}><Text style={academyUI.buttonText}>{busy?"Checking…":"See my marks"}</Text></TouchableOpacity>}
    {result?<View style={academyUI.notice}><Text style={academyUI.noticeText}>{result.score_percent}% · {result.correct_count}/{result.question_count} correct · {result.passed?"Passed":"Keep learning and retry"}. No lives are lost.</Text><TouchableOpacity accessibilityRole="button" style={academyUI.secondaryButton} onPress={()=>{setResult(null);setAnswers({})}}><Text style={academyUI.secondaryText}>Try again</Text></TouchableOpacity></View>:null}
    <TouchableOpacity accessibilityRole="button" style={academyUI.secondaryButton} onPress={()=>setQuiz(null)}><Text style={academyUI.secondaryText}>Back to lessons</Text></TouchableOpacity>
   </View>:
   <>
    <Text style={academyUI.meta}>LESSON PATH · {done.size} COMPLETED</Text>
    {lessons.map((l,i)=><TouchableOpacity accessibilityRole="button" key={l.id} style={[academyUI.panel,lesson?.id===l.id?academyUI.panelSelected:null]} onPress={()=>setLesson(l)}><Text style={academyUI.meta}>{String(i+1).padStart(2,"0")} / {done.has(l.id)?"COMPLETED":"LESSON"}</Text><Text style={academyUI.panelTitle}>{l.title}</Text></TouchableOpacity>)}
    {lesson?<View style={academyUI.panel}><Text style={academyUI.section}>{lesson.title}</Text>
     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>{modes.map(m=><TouchableOpacity key={m.key} accessibilityRole="button" onPress={()=>void setMode(m.key)} style={[academyUI.secondaryButton,{marginRight:8,backgroundColor:format===m.key?palette.wash:undefined}]}><Text style={academyUI.secondaryText}>{m.title}</Text></TouchableOpacity>)}</ScrollView>
     {formatsForLesson.length?formatsForLesson.map(f=><View key={f.id} style={{marginBottom:15}}><Text style={academyUI.panelTitle}>{f.title||lesson.title}</Text>{(format==="video"||format==="audio")&&validHttps(f.source_url)?<FormatPlayer key={f.id} url={f.source_url} audio={format==="audio"}/>:<Text style={[academyUI.detail,{fontSize:16,lineHeight:26}]}>{f.body}</Text>}</View>):format==="passage"?<Text style={[academyUI.detail,{fontSize:16,lineHeight:27}]}>{lesson.content}</Text>:<Text style={academyUI.detail}>This learning format is not available for this lesson yet. Try Read or another format.</Text>}
     {!user&&!course?.demo?<SignIn title="Sign in to save lesson progress"/>:<TouchableOpacity accessibilityRole="button" disabled={busy||done.has(lesson.id)} style={[academyUI.button,{opacity:busy||done.has(lesson.id)?.5:1}]} onPress={()=>void complete()}><Text style={academyUI.buttonText}>{done.has(lesson.id)?"Completed":busy?"Saving…":"Mark lesson complete"}</Text></TouchableOpacity>}
    </View>:<Text style={academyUI.detail}>No lessons have been published in this course yet.</Text>}
    {assessments.length?<><Text style={academyUI.section}>Test your understanding</Text>{assessments.map(a=><TouchableOpacity accessibilityRole="button" key={a.id} style={academyUI.panel} onPress={()=>void openAssessment(a)}><Text style={academyUI.panelTitle}>{a.title}</Text><Text style={academyUI.detail}>Your marks are recorded. Retake freely with no penalties.</Text></TouchableOpacity>)}</>:null}
   </>}
  </>}
  {user?<><AccountControls/><SignOut/></>:null}
  {message?<View style={academyUI.notice}><Text style={academyUI.noticeText}>{message}</Text></View>:null}
  <View style={academyUI.spacer}/>
 </ScrollView>;
}
