import {useEffect,useState} from "react";
import {Alert,Text,TextInput,TouchableOpacity,View} from "react-native";
import type {User} from "@supabase/supabase-js";
import {api} from "./supabase";
import {styles} from "./theme";

export function useIdentity(){
 const [user,setUser]=useState<User|null>(null);
 const [checking,setChecking]=useState(true);
 useEffect(()=>{
  if(!api){setChecking(false);return;}
  let active=true;
  api.auth.getUser().then(({data})=>{if(active){setUser(data.user);setChecking(false);}});
  const {data:{subscription}}=api.auth.onAuthStateChange((_event,session)=>{
   if(active){setUser(session?.user||null);setChecking(false);}
  });
  return()=>{active=false;subscription.unsubscribe();};
 },[]);
 return {user,checking};
}

export function SignIn({title="Secure access"}:{title?:string}){
 const [email,setEmail]=useState("");
 const [token,setToken]=useState("");
 const [sent,setSent]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 async function send(){
  if(!api){setMessage("Supabase connection not configured.");return;}
  if(!email.includes("@")){setMessage("Enter a valid email address.");return;}
  setBusy(true);setMessage("");
  const {error}=await api.auth.signInWithOtp({email:email.trim(),options:{shouldCreateUser:true}});
  setBusy(false);
  if(error){setMessage(error.message);return;}
  setSent(true);setMessage("Check your email for the one-time code.");
 }
 async function verify(){
  if(!api)return;
  setBusy(true);setMessage("");
  const {error}=await api.auth.verifyOtp({email:email.trim(),token:token.trim(),type:"email"});
  setBusy(false);
  if(error)setMessage(error.message);
 }
 return <View style={styles.panel}>
  <Text style={styles.panelTitle}>{title}</Text>
  <Text style={[styles.detail,{marginBottom:16}]}>Sign in with a private, one-time email code. Accounts are protected by Supabase authentication.</Text>
  <TextInput style={styles.textInput} value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#6a7c6e" keyboardType="email-address" textContentType="emailAddress" autoCapitalize="none" editable={!sent}/>
  {!sent?<TouchableOpacity accessibilityRole="button" style={styles.button} disabled={busy} onPress={send}><Text style={styles.buttonText}>{busy?"Sending…":"Send sign-in code"}</Text></TouchableOpacity>:<>
   <TextInput style={styles.textInput} value={token} onChangeText={setToken} placeholder="One-time code" keyboardType="number-pad" autoCapitalize="none" accessibilityLabel="Email verification code"/>
   <TouchableOpacity accessibilityRole="button" style={styles.button} disabled={busy||!token.trim()} onPress={verify}><Text style={styles.buttonText}>{busy?"Verifying…":"Verify code"}</Text></TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={()=>{setSent(false);setToken("");}}><Text style={styles.secondaryText}>Use a different email</Text></TouchableOpacity>
  </>}
  {message?<View style={styles.notice}><Text style={styles.noticeText}>{message}</Text></View>:null}
 </View>;
}
export function SignOut(){return <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={()=>api?.auth.signOut().catch(e=>Alert.alert("Sign-out error",String(e)))}><Text style={styles.secondaryText}>Sign out</Text></TouchableOpacity>}

export function AccountControls(){
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 async function executeDeletion(){
  if(!api)return;
  setBusy(true);setMessage("");
  try{
   const {data:{session}}=await api.auth.getSession();
   if(!session){setMessage("Sign in again to delete your account.");return;}
   const response=await fetch("https://theascendersclub.com/api/account/delete",{
    method:"POST",
    headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`},
    body:JSON.stringify({confirm:"DELETE"})
   });
   const body=await response.json();
   if(!response.ok){setMessage(body.error||"Deletion is unavailable. Contact contact@theascendersclub.com.");return;}
   await api.auth.signOut();setMessage("Your account was deleted.");
  }catch{setMessage("Unable to contact the deletion service. Email contact@theascendersclub.com.");}
  finally{setBusy(false);}
 }
 return <View style={[styles.panel,{marginTop:28}]}>
  <Text style={styles.panelTitle}>Account and privacy</Text>
  <Text style={styles.detail}>You can request immediate account deletion. This permanently removes your sign-in identity and associated records. Contact contact@theascendersclub.com with privacy questions.</Text>
  <TouchableOpacity accessibilityRole="button" disabled={busy} style={[styles.secondaryButton,{marginTop:18}]} onPress={()=>Alert.alert("Permanently delete your account?","This cannot be undone and removes access to all Ascend apps.",[{text:"Cancel",style:"cancel"},{text:"Delete account",style:"destructive",onPress:()=>void executeDeletion()}])}>
   <Text style={styles.secondaryText}>{busy?"Deleting…":"Permanently delete account"}</Text>
  </TouchableOpacity>
  {message?<View style={styles.notice}><Text style={styles.noticeText}>{message}</Text></View>:null}
 </View>;
}
