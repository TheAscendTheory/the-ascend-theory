import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
export const runtime="nodejs";

/**
 * Immediately remove a verified user's Supabase auth identity and its
 * ON DELETE CASCADE data. This endpoint must NOT be exposed without the
 * server-side service-role secret and production data-retention review.
 */
export async function POST(request:Request){
 const auth=request.headers.get("authorization")||"";
 if(!auth.startsWith("Bearer "))return NextResponse.json({error:"Please sign in first."},{status:401});
 const payload=await request.json().catch(()=>null);
 if(payload?.confirm!=="DELETE")return NextResponse.json({error:"Account deletion must be explicitly confirmed."},{status:400});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const publicKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 const adminKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!publicKey||!adminKey)return NextResponse.json({error:"Self-service deletion is not configured. Contact contact@theascendersclub.com to request deletion."},{status:503});
 const viewer=createClient(url,publicKey,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data:{user},error:identityError}=await viewer.auth.getUser(auth.slice(7));
 if(identityError||!user)return NextResponse.json({error:"Your session has expired. Sign in again."},{status:401});
 const administrator=createClient(url,adminKey,{auth:{autoRefreshToken:false,persistSession:false}});
 const {error:deleteError}=await administrator.auth.admin.deleteUser(user.id);
 if(deleteError)return NextResponse.json({error:"Account deletion failed. Please contact support."},{status:500});
 return NextResponse.json({deleted:true});
}
