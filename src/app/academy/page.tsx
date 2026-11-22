import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight, BookOpen, Compass, Layers3, Network} from "lucide-react";

export const metadata:Metadata={
 title:"Ascend Academy",
 description:"The Ascend Academy learning platform is being redesigned around practical knowledge and interdisciplinary learning."
};

export default function AcademyPage(){
 return <main className="ascSite">
   <section className="ascInnerHero ascWrap">
     <p className="ascOverline">02 / THE KNOWLEDGE</p>
     <h1>Ascend <em>Academy.</em></h1>
     <p>Knowledge should open possibilities, not constrain them. We are reshaping the Academy into a learning environment grounded in practical understanding, exploration, and shared expertise across disciplines.</p>
     <Link className="ascButton" href="/contact">Discuss education partnerships <ArrowUpRight size={17} aria-hidden="true"/></Link>
   </section>
   <section className="ascWrap ascFeatureGrid">
     <article><BookOpen size={32} strokeWidth={1.2}/><h2>Applied learning</h2><p>Courses and experiences designed to connect ideas with practice.</p></article>
     <article><Network size={32} strokeWidth={1.2}/><h2>Knowledge exchange</h2><p>Insights and expertise from educators, practitioners, and the broader Ascenders community.</p></article>
     <article><Compass size={32} strokeWidth={1.2}/><h2>Open disciplines</h2><p>Exploration across the arts, science, ecology, technology, community development, and beyond.</p></article>
   </section>
   <section className="ascWrap ascFeatureNote">
     <p className="ascOverline">PLATFORM DEVELOPMENT</p>
     <h2>Building the next learning experience.</h2>
     <p>The Academy is being redesigned. Learning paths and modules will be published once their content, assessments and user experience are ready.</p>
     <Link href="/hub" className="ascTextLink">Explore Ascend Hub <Layers3 size={16} aria-hidden="true"/></Link>
   </section>
 </main>;
}
