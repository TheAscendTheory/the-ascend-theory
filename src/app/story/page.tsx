import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story behind The Ascenders Club and its mission to connect people creating meaningful change.",
};

export default function Story() {
  return <main className="ascSite">
    <section className="ascInnerHero ascWrap">
      <p className="ascOverline">THE ASCENDERS CLUB / OUR STORY</p>
      <h1>We are <em>Ascenders.</em></h1>
      <p>The Ascenders Club began with a question: what could we accomplish if the people working to create meaningful change were connected rather than working in isolation?</p>
    </section>
    <section className="ascWrap ascSection ascSplit">
      <div><p className="ascOverline">THE BEGINNING</p><h2>From individual purpose to <em>collective action.</em></h2></div>
      <div><p>Our vision grew from an interest in the relationship between humanity and nature, the way we cultivate our food, care for our environment and share knowledge. It developed into a broader ambition: to bring together people whose work contributes to the world around them.</p><p>From those regenerating the land to those educating young people, serving their communities or creating new possibilities through art and innovation, meaningful change takes many forms. We believe these efforts deserve to be seen, understood and connected, regardless of their scale or recognition.</p></div>
    </section>
    <section className="ascWrap ascSection">
      <p className="ascOverline">BUILDING THE COLLECTIVE</p>
      <h2>Three platforms. <em>One purpose.</em></h2>
      <div className="ascFeatureGrid">
        <article><h2>Ascend Hub</h2><p>A global network connecting changemakers, organizations, initiatives and opportunities for collaboration.</p><Link className="ascTextLink" href="/hub" target="_blank" rel="noopener noreferrer">Explore Ascend Hub</Link></article>
        <article><h2>Ascend Academy</h2><p>A place to exchange knowledge, develop practical skills and learn from people putting ideas into practice.</p><Link className="ascTextLink" href="/academy" target="_blank" rel="noopener noreferrer">Explore Ascend Academy</Link></article>
        <article><h2>Ascend Media</h2><p>A platform dedicated to documenting meaningful work and sharing the stories of the people behind it.</p><Link className="ascTextLink" href="/media" target="_blank" rel="noopener noreferrer">Explore Ascend Media</Link></article>
      </div>
    </section>
    <section className="ascClosing"><div className="ascWrap"><p className="ascOverline">OUR NEXT CHAPTER</p><h2>The story is still <em>being written.</em></h2><p>We are building an international collective shaped by the people who participate in it. Our ambition is to turn connections into collaborations, knowledge into action and individual contributions into lasting collective impact.</p><Link className="ascButton" href="/contact">Connect with us</Link></div></section>
  </main>;
}
