"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { MessageCircle, Minus, Send, Users, X } from "lucide-react";
import { createBrowserSupabaseClient } from "../lib/supabaseBrowser";

type Friend = {
  id: string;
  name: string;
  handle: string;
  conversationId?: string;
};

type ChatMessage = {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
};

export default function GlobalChatDock() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [userId, setUserId] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeFriendId, setActiveFriendId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Sign in to chat with friends.");

  const activeFriend = friends.find((friend) => friend.id === activeFriendId);

  useEffect(() => {
    async function loadChatBasics() {
      if (!supabase) {
        setStatus("Chat is not connected yet.");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData.user?.id;

      if (!currentUserId) {
        setStatus("Sign in to chat with friends.");
        return;
      }

      setUserId(currentUserId);

      const { data: friendshipRows, error } = await supabase
        .from("ascend_friendships")
        .select("requester_id,addressee_id,status")
        .eq("status", "accepted")
        .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`);

      if (error) {
        setStatus("Sign in to start chat.");
        return;
      }

      const friendIds = Array.from(
        new Set(
          (friendshipRows || []).map((row) =>
            row.requester_id === currentUserId ? row.addressee_id : row.requester_id
          )
        )
      );

      if (!friendIds.length) {
        setFriends([]);
        setStatus("Add friends in Social to start global chat.");
        return;
      }

      const { data: profileRows } = await supabase
        .from("ascend_profiles")
        .select("user_id,display_name,handle")
        .in("user_id", friendIds);

      const nextFriends = (profileRows || []).map((profile) => ({
        id: profile.user_id,
        name: profile.display_name || profile.handle || "Ascender",
        handle: profile.handle || "friend",
      }));

      setFriends(nextFriends);
      setActiveFriendId((current) => current || nextFriends[0]?.id || "");
      setStatus(nextFriends.length ? "Global friend chat ready." : "Add friends in Social to chat.");
    }

    loadChatBasics();
  }, [supabase]);

  useEffect(() => {
    async function loadMessages() {
      if (!supabase || !userId || !activeFriendId) {
        return;
      }

      const { data: conversationId, error } = await supabase.rpc("create_direct_conversation", {
        other_user_id: activeFriendId,
      });

      if (error || !conversationId) {
        setMessages([]);
        setStatus("Accept a friend request before messaging.");
        return;
      }

      const { data: rows, error: messageError } = await supabase
        .from("ascend_messages")
        .select("id,body,sender_id,created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(40);

      if (messageError) {
        setStatus("Messages could not load yet.");
        return;
      }

      setMessages(rows || []);
      setFriends((current) =>
        current.map((friend) =>
          friend.id === activeFriendId ? { ...friend, conversationId } : friend
        )
      );
      setStatus("Global friend chat ready.");
    }

    loadMessages();
  }, [activeFriendId, supabase, userId]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !userId || !activeFriend || !draft.trim()) {
      return;
    }

    let conversationId = activeFriend.conversationId;

    if (!conversationId) {
      const { data } = await supabase.rpc("create_direct_conversation", {
        other_user_id: activeFriend.id,
      });
      conversationId = data || "";
    }

    if (!conversationId) {
      setStatus("Accept a friend request before messaging.");
      return;
    }

    const body = draft.trim();
    setDraft("");

    const { data, error } = await supabase
      .from("ascend_messages")
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        body,
      })
      .select("id,body,sender_id,created_at")
      .single();

    if (error) {
      setStatus("Message did not send. Try again shortly.");
      return;
    }

    if (data) {
      setMessages((current) => [...current, data]);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="floatingChatButton siteChatButton"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        aria-label="Open global friend chat"
      >
        <MessageCircle size={20} />
        <span>Chat</span>
      </button>
    );
  }

  return (
    <aside className={minimized ? "floatingChat siteChatDock isMinimized" : "floatingChat siteChatDock"}>
      <div className="floatingChatHeader siteChatHeader">
        <button type="button" onClick={() => setMinimized((current) => !current)}>
          <Users size={17} />
          <span>Global Chat</span>
        </button>

        <div>
          <button
            type="button"
            onClick={() => setMinimized((current) => !current)}
            aria-label={minimized ? "Expand chat" : "Minimize chat"}
          >
            <Minus size={16} />
          </button>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
            <X size={16} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="globalChatFriendRow" aria-label="Chat friends">
            {friends.length ? (
              friends.map((friend) => (
                <button
                  key={friend.id}
                  type="button"
                  className={friend.id === activeFriendId ? "isActive" : ""}
                  onClick={() => setActiveFriendId(friend.id)}
                >
                  {friend.name}
                </button>
              ))
            ) : (
              <span>No friends yet</span>
            )}
          </div>

          <div className="floatingMessages">
            {messages.length ? (
              messages.map((message) => (
                <p
                  key={message.id}
                  className={message.sender_id === userId ? "myFloatingMessage" : ""}
                >
                  {message.body}
                </p>
              ))
            ) : (
              <p>{status}</p>
            )}
          </div>

          <form onSubmit={sendMessage} className="floatingChatBar">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={activeFriend ? `Message ${activeFriend.name}` : "Add friends in Social"}
              disabled={!activeFriend}
            />
            <button type="submit" aria-label="Send chat message" disabled={!activeFriend || !draft.trim()}>
              <Send size={17} />
            </button>
          </form>
        </>
      )}
    </aside>
  );
}
