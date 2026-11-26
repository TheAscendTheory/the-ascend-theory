"use client";
import {useState, useRef} from "react";
import {AnimatePresence, motion, useReducedMotion} from "framer-motion";
import {ArrowLeft,ArrowRight} from "lucide-react";
import Link from "next/link";

const scenes=[
 {index:"01",label:"CONNECTION",title:"One network. Infinite intersections.",description:"Every person carries a new possibility for collaboration. The geometry forms a web of connected pathways.",href:"/hub",cta:"Explore Ascend Hub",kind:"intersections"},
 {index:"02",label:"KNOWLEDGE",title:"Change your perspective.",description:"Layered ideas become new ways of seeing. Knowledge transforms the pattern as you move through it.",href:"/academy",cta:"Explore Ascend Academy",kind:"perspective"},
 {index:"03",label:"STORYTELLING",title:"See beyond the surface.",description:"Light, composition, and perception reveal the stories behind a more connected world.",href:"/media",cta:"Explore Ascend Media",kind:"perception"}
];
export default function PerceptionSequence(){
 const [index,setIndex]=useState(0);
 const touch=useRef<number|null>(null);
 const reduce=useReducedMotion();
 const scene=scenes[index];
 const change=(delta:number)=>setIndex(current=>(current+delta+scenes.length)%scenes.length);
 return <section className="ascPerception" aria-label="Explore the three Ascend experiences">
   <div className="ascWrap">
     <div className="ascPerceptionTop"><p className="ascOverline">THE ART OF PERCEPTION</p><span>INTERACTIVE SEQUENCE / {scene.index} — 03</span></div>
     <div className="ascPerceptionStage" onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{if(touch.current===null)return;const movement=e.changedTouches[0].clientX-touch.current;if(Math.abs(movement)>55)change(movement<0?1:-1);touch.current=null}}>
      <div className={`ascPerceptionPattern ascPattern-${scene.kind}`} aria-hidden="true"><div className="ascPatternLayer ascPatternLayerA"/><div className="ascPatternLayer ascPatternLayerB"/><div className="ascPatternCore"/></div>
      <div className="ascPerceptionContent" aria-live="polite">
      <AnimatePresence mode="wait">
       <motion.div key={index} initial={reduce?false:{opacity:0,y:20,filter:"blur(8px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} exit={reduce?{opacity:1}:{opacity:0,y:-20,filter:"blur(8px)"}} transition={{duration:reduce?0:.45,ease:[.22,1,.36,1]}}>
        <p className="ascOverline">{scene.label}</p>
        <h2>{scene.title}</h2>
        <p>{scene.description}</p>
        <Link href={scene.href} target="_blank" rel="noopener noreferrer" className="ascTextLink">{scene.cta} <ArrowRight size={17} aria-hidden="true"/></Link>
       </motion.div>
      </AnimatePresence>
      </div>
     </div>
     <div className="ascPerceptionControls">
      <div className="ascPerceptionTabs" role="group" aria-label="Select an experience">{scenes.map((item,i)=><button type="button" key={item.index} aria-pressed={index===i} className={index===i?"isSelected":""} onClick={()=>setIndex(i)}><span>{item.index}</span> {item.label}</button>)}</div>
      <div className="ascPerceptionArrows"><button type="button" onClick={()=>change(-1)} aria-label="Previous experience"><ArrowLeft size={20}/></button><button type="button" onClick={()=>change(1)} aria-label="Next experience"><ArrowRight size={20}/></button></div>
     </div>
   </div>
 </section>;
}