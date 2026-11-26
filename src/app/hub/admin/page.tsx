import type {Metadata} from "next";
import HubAdminClient from "./HubAdminClient";
export const metadata:Metadata={title:"Ascend Hub — Member and Project Review",robots:{index:false,follow:false}};
export default function AdminPage(){return <HubAdminClient/>;}
