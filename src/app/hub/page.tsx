import type { Metadata } from "next";
import HubExplorer from "./HubExplorer";

export const metadata: Metadata = {
 title: "Ascenders Hub | Global Discovery",
 description: "Explore the Ascenders Club global network through a geographic discovery map of people, organizations, projects and events."
};

export default function HubPage(){ return <HubExplorer/>; }
