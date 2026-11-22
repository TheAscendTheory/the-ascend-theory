import type {Metadata} from "next";
import HubClient from "./HubClient";
export const metadata:Metadata={
 title:"Ascend Hub — Discover and Collaborate",
 description:"Apply to join Ascend Hub. Approved members can discover changemakers and vetted projects, explore geographic connections and submit initiatives."
};
export default function HubPage(){return <HubClient/>;}
