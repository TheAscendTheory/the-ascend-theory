import type {Metadata} from "next";
import HubClient from "../HubClient";
export const metadata:Metadata={title:"Ascenders Hub — Members",description:"Private, approval-based membership workspace for the Ascenders Club."};
export default function MembersPage(){return <HubClient/>;}
