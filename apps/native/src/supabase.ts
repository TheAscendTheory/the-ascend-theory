import "react-native-url-polyfill/auto";
import "expo-sqlite/localStorage/install";
import {AppState} from "react-native";
import {createClient,type SupabaseClient} from "@supabase/supabase-js";

const url=process.env.EXPO_PUBLIC_SUPABASE_URL;
const key=process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const api:SupabaseClient|null=url&&key?createClient(url,key,{
 auth:{storage:localStorage,autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}
}):null;

if(api){
 AppState.addEventListener("change",state=>{
  if(state==="active")api.startAutoRefresh();
  else api.stopAutoRefresh();
 });
}
