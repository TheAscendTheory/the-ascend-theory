"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Globe2, BookOpen, Clapperboard } from "lucide-react";
import PerceptionSequence from "./components/PerceptionSequence";
import "./constellation-home.css";

const platforms=[
 {number:"01",name:"Ascenders Hub",label:"THE NETWORK",description:"A curated global constellation of people, organizations, projects and shared opportunities.",href:"https://theascendtheory.github.io/the-ascend-theory/?revision=e4e5e69",Icon:Globe2},
 {number:"02",name:"Ascenders Academy",label:"THE KNOWLEDGE",description:"Structured learning, practical education and knowledge exchange across disciplines.",href:"https://theascendtheory.github.io/the-ascend-theory/academy/",Icon:BookOpen},
 {number:"03",name:"Ascenders Media",label:"THE STORIES",description:"Films, documentaries, interviews and photography that move beyond the surface.",href:"https://theascendtheory.github.io/the-ascend-theory/media/",Icon:Clapperboard}
];

function SacredGeometry(){
 return <div className="ascGeometry" aria-hidden="true"><svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
 <defs><radialGradient id="ascCore"><stop offset="0" stopColor="#d5e0cc" stopOpacity=".14"/><stop offset="1" stopColor="#d5e0cc" stopOpacity="0"/></radialGradient><linearGradient id="ascLine" x1="0" y1="0" x2="800" y2="800"><stop stopColor="#c4d1bc" stopOpacity=".12"/><stop offset=".5" stopColor="#c4d1bc" stopOpacity=".77"/><stop offset="1" stopColor="#c4d1bc" stopOpacity=".13"/></linearGradient></defs>
 <circle cx="400" cy="400" r="390" fill="url(#ascCore)"/>
 <g stroke="url(#ascLine)" strokeWidth="1">
 <circle cx="400" cy="400" r="348"/><circle cx="400" cy="400" r="308"/><circle cx="400" cy="400" r="230"/><circle cx="400" cy="400" r="154"/>
 <g className="ascOrbitA"><circle cx="400" cy="246" r="154"/><circle cx="533.368" cy="323" r="154"/><circle cx="533.368" cy="477" r="154"/><circle cx="400" cy="554" r="154"/><circle cx="266.632" cy="477" r="154"/><circle cx="266.632" cy="323" r="154"/></g>
 <g className="ascOrbitB" strokeOpacity=".75"><path d="M400 85 672.8 557.5H127.2Z"/><path d="M400 715 127.2 242.5H672.8Z"/><path d="M400 85 400 715M127.2 242.5 672.8 557.5M672.8 242.5 127.2 557.5"/></g>
 <g className="ascOrbitC" strokeOpacity=".45"><circle cx="400" cy="400" r="365" strokeDasharray="4 18"/><circle cx="400" cy="400" r="280" strokeDasharray="2 12"/></g>
 </g>
 <circle cx="400" cy="400" r="10" stroke="#e0e6d8" strokeWidth="1.5"/><circle cx="400" cy="400" r="3" fill="#e0e6d8" className="ascPulse"/>
 </svg></div>
}
export default function Home(){
 const reduceMotion=useReducedMotion();
 const transition=(delay:number)=>({duration:reduceMotion?0:.85,delay:reduceMotion?0:delay});
 return <main className="asc-home" data-home-revision="constellation-04">
  
  <section className="ascHero">
   <div className="ascDottedField" aria-hidden="true"/>
   <SacredGeometry/>
   <div className="ascHeroContent">
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={transition(0)} style={{display:"flex",alignItems:"center",gap:14}}>
     <Image src="/logo.PNG" alt="" width={58} height={58} style={{objectFit:"contain",filter:"drop-shadow(0 0 14px #c4d1bc70)"}}/>
     <p className="ascKicker">THE ASCENDERS CLUB <span style={{opacity:.48}}> / </span> A GLOBAL COLLECTIVE</p>
    </motion.div>
    <motion.h1 initial={{opacity:0,y:34}} animate={{opacity:1,y:0}} transition={transition(.12)}>WE ARE<br/><em>Ascenders.</em></motion.h1>
    <motion.p className="ascHeroIntro" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={transition(.3)}>An international collective connecting changemakers, knowledge and initiatives to cultivate a more connected, flourishing future.</motion.p>
    <motion.div className="ascActions" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={transition(.45)}>
     <Link className="ascButton" href="https://theascendtheory.github.io/the-ascend-theory/?revision=e4e5e69">Explore Ascenders Hub <ArrowUpRight aria-hidden="true"/></Link>
     <Link className="ascButton ascButtonOutline" href="/about">Discover our philosophy <ArrowRight aria-hidden="true"/></Link>
    </motion.div>
   </div>
   <div className="homeGateway" aria-label="Explore the three platforms">{platforms.map(({number,name,href,Icon})=><Link key={name} href={href} className="homeGatewayLink"><Icon size={22}/><span><small>{number} / EXPLORE</small>{name}</span><ArrowUpRight size={18}/></Link>)}</div>
   <div className="ascHeroFooter"><span>THE ASCENDERS CLUB</span><span>CONNECT / COLLABORATE / CULTIVATE</span><span>ONE WORLD · MANY PATHS</span></div>
  </section>
  <section className="ascWrap ascSection ascSplit">
   <div><p className="ascOverline">THE UNDERLYING PRINCIPLE</p><h2>Everything is<br/><em>connected.</em></h2></div>
   <div><p>Growth is not an isolated act. It emerges through relationships between people, ideas, communities and the living world.</p><p>We bring together changemakers across disciplines and borders, from emerging local initiatives to established organizations. Different paths, shared possibility.</p><Link className="ascTextLink" href="/about">Our philosophy <ArrowUpRight size={16} style={{verticalAlign:"middle",marginLeft:8}}/></Link></div>
  </section>
  <section className="ascAlt ascSection">
   <div className="ascWrap"><div className="ascHeading"><div><p className="ascOverline">ONE COMMUNITY / THREE EXPERIENCES</p><h2>A universe of <em>possibility.</em></h2></div><p>Ascend is the name of what we build. Ascenders are the people. The Ascenders Club brings us together.</p></div>
    <div className="ascCards">{platforms.map(({number,name,label,description,href,Icon})=><Link className="ascCard" href={href} key={name}><span className="kineticSpiral" aria-hidden="true"><svg viewBox="0 0 500 500" fill="none">{Array.from({length:16},(_,i)=><path key={i} d="M250 250 C260 160 390 120 470 250 C530 390 350 530 160 450 C-30 360 20 90 250 28" transform={"rotate("+(i*22.5)+" 250 250)"} stroke="#d9e3cd" strokeWidth=".9" opacity={.5}/>)}</svg></span><span className="ascNum">{number} / 03</span><span className="ascCardIcon"><Icon size={45} strokeWidth={1.2}/></span><span className="ascOverline">{label}</span><h3>{name}</h3><p>{description}</p><span style={{display:"flex",gap:10,alignItems:"center"}}>Explore platform <ArrowUpRight size={17}/></span></Link>)}</div>
   </div>
  </section>
  <PerceptionSequence/>
  <section className="ascWrap ascSection ascSplit"><div><p className="ascOverline">BEYOND DISCIPLINES / BEYOND BORDERS</p><h2>For those who <em>create change.</em></h2></div><div><p>Community builders, artists, scientists, educators, entrepreneurs, and stewards of nature. This is a place for individuals and organizations united not by prestige, but by purpose.</p><Link className="ascButton" href="/contact">Collaborate with us <ArrowUpRight aria-hidden="true"/></Link></div></section>
  <section className="ascClosing"><div className="ascWrap"><p className="ascOverline">THE FUTURE IS COLLECTIVE</p><h2>Become part of<br/><em>what comes next.</em></h2><p>Discover what becomes possible when we move together.</p><Link className="ascButton" href="https://theascendtheory.github.io/the-ascend-theory/?revision=e4e5e69">Discover Ascenders Hub <ArrowUpRight aria-hidden="true"/></Link></div></section>
 </main>;
}