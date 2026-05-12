"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Bookmark,
  Check,
  Clock,
  Eye,
  EyeOff,
  Flame,
  MessageCircle,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  UserPlus,
} from "lucide-react";
import { createBrowserSupabaseClient } from "../lib/supabaseBrowser";
import { rankStatusFromLevel } from "../learn/curriculum/rank-system";

type Profile = {
  user_id: string;
  display_name: string;
  handle: string | null;
  academy_level?: string | null;
  pnl_public?: boolean | null;
};

type Friendship = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "blocked";
};

type Post = {
  id: string;
  user_id: string;
  body: string;
  visibility: "public" | "friends" | "private";
  created_at: string;
  category?: string | null;
  tags?: string[] | null;
  media_url?: string | null;
  media_type?: "photo" | "video" | "chart" | "pnl" | null;
  pnl_amount?: number | null;
};

type SavedPost = {
  post_id: string;
};

type Story = {
  id: string;
  user_id: string;
  caption: string;
  expires_at: string;
  kept_on_profile: boolean;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type Notification = {
  id: string;
  body: string;
  read_at: string | null;
};

type Friend = {
  id: string;
  userId: string;
  name: string;
  handle: string;
  friendshipId: string;
  status: "friend" | "request";
  direction: "incoming" | "outgoing";
  conversationId?: string;
};

function profileName(profile: Profile | undefined, fallback = "Ascender") {
  return profile?.display_name || profile?.handle || fallback;
}

function profileHandle(profile: Profile | undefined) {
  return profile?.handle ? `@${profile.handle}` : "@ascender";
}

function hoursLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  const hours = Math.max(Math.ceil(diff / 36e5), 0);
  return hours > 0 ? `${hours}h` : "expired";
}

function readSocialAcademyStats() {
  try {
    const academy = JSON.parse(
      window.localStorage.getItem("ascend-academy-reader-progress") || "{}"
    ) as {
      xp?: number;
      completed?: string[];
      streak?: number;
    };

    return {
      xp: academy.xp || 0,
      completed: academy.completed?.length || 0,
      streak: academy.streak || 0,
    };
  } catch {
    return { xp: 0, completed: 0, streak: 0 };
  }
}

export default function SocialClient() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [userId, setUserId] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFriendId, setActiveFriendId] = useState("");
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [postDraft, setPostDraft] = useState("");
  const [postCategory, setPostCategory] = useState("Recap");
  const [customCategory, setCustomCategory] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<Post["media_type"]>("chart");
  const [pnlAmount, setPnlAmount] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [storyDraft, setStoryDraft] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [academyStats] = useState(() =>
    typeof window === "undefined" ? { xp: 0, completed: 0, streak: 0 } : readSocialAcademyStats()
  );

  const profileMap = useMemo(
    () => new Map(profiles.map((profile) => [profile.user_id, profile])),
    [profiles]
  );

  const friends = useMemo<Friend[]>(() => {
    if (!userId) {
      return [];
    }

    return friendships
      .map((friendship) => {
        const otherUserId =
          friendship.requester_id === userId
            ? friendship.addressee_id
            : friendship.requester_id;
        const otherProfile = profileMap.get(otherUserId);

        return {
          id: otherUserId,
          userId: otherUserId,
          name: profileName(otherProfile),
          handle: profileHandle(otherProfile),
          friendshipId: friendship.id,
          status:
            friendship.status === "accepted"
              ? ("friend" as const)
              : ("request" as const),
          direction:
            friendship.addressee_id === userId
              ? ("incoming" as const)
              : ("outgoing" as const),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [friendships, profileMap, userId]);

  const activeFriend = friends.find((friend) => friend.id === activeFriendId);
  const currentProfile = profileMap.get(userId);
  const currentRank = rankStatusFromLevel(currentProfile?.academy_level);
  const categoryOptions = [
    "Wins",
    "Loss",
    "Replay",
    "Recap",
    "Lesson",
    "Bias",
    "Daily Bias",
    "Weekly Bias",
    "Monthly Bias",
    "P&L",
    "Stocks",
    "Options",
    "Crypto",
    "Futures",
    "Forex",
    "ETFs",
    "CFDs",
    "Custom",
  ];
  const friendRequests = friends.filter(
    (friend) => friend.status === "request" && friend.direction === "incoming"
  );
  const acceptedFriends = friends.filter((friend) => friend.status === "friend");
  const savedPostIds = useMemo(
    () => new Set(savedPosts.map((savedPost) => savedPost.post_id)),
    [savedPosts]
  );
  const savedPostList = posts.filter((post) => savedPostIds.has(post.id));
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      extractHashtags(post.body).forEach((tag) => tags.add(tag));
      (post.tags || []).forEach((tag) => tags.add(cleanTag(tag)));
      if (post.category) tags.add(cleanTag(post.category));
    });
    return Array.from(tags).filter(Boolean).slice(0, 18);
  }, [posts]);
  const filteredPosts = activeTag
    ? posts.filter((post) =>
        [
          ...extractHashtags(post.body),
          ...(post.tags || []).map(cleanTag),
          cleanTag(post.category || ""),
        ].includes(activeTag)
      )
    : posts;
  const profileHighlights = stories.filter(
    (story) => story.user_id === userId && story.kept_on_profile
  );
  const activeStories = stories.filter((story) => !story.kept_on_profile);
  const unreadNotifications = notifications.filter((notification) => !notification.read_at);

  const notificationText = useMemo(() => {
    return unreadNotifications.length
      ? unreadNotifications.map((notification) => notification.body)
      : [
          `${friendRequests.length} friend request${friendRequests.length === 1 ? "" : "s"}`,
          `${savedPostList.length} saved post${savedPostList.length === 1 ? "" : "s"}`,
          `${activeStories.length} active stories`,
        ];
  }, [activeStories.length, friendRequests.length, savedPostList.length, unreadNotifications]);

  const loadSocialData = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUserId("");
      setLoading(false);
      return;
    }

    const displayName =
      String(user.user_metadata.display_name || "") ||
      user.email?.split("@")[0] ||
      "Ascender";
    const handle = String(user.user_metadata.handle || "")
      .trim()
      .toLowerCase()
      .replace(/^@/, "")
      .replace(/[^a-z0-9_]/g, "");

    await supabase.from("ascend_profiles").upsert({
      user_id: user.id,
      display_name: displayName,
      handle: handle || null,
      updated_at: new Date().toISOString(),
    });

    setUserId(user.id);

    const [
      profilesResult,
      friendshipsResult,
      postsResult,
      savedPostsResult,
      storiesResult,
      notificationsResult,
    ] = await Promise.all([
      (async () => {
        const extended = await supabase
          .from("ascend_profiles")
          .select("user_id, display_name, handle, academy_level, pnl_public")
          .order("display_name", { ascending: true });

        return extended.error
          ? supabase
              .from("ascend_profiles")
              .select("user_id, display_name, handle, academy_level")
              .order("display_name", { ascending: true })
          : extended;
      })(),
      supabase
        .from("ascend_friendships")
        .select("id, requester_id, addressee_id, status")
        .order("updated_at", { ascending: false }),
      (async () => {
        const extended = await supabase
          .from("ascend_social_posts")
          .select("id, user_id, body, visibility, created_at, category, tags, media_url, media_type, pnl_amount")
          .order("created_at", { ascending: false })
          .limit(40);

        return extended.error
          ? supabase
              .from("ascend_social_posts")
              .select("id, user_id, body, visibility, created_at")
              .order("created_at", { ascending: false })
              .limit(40)
          : extended;
      })(),
      supabase.from("ascend_saved_posts").select("post_id"),
      supabase
        .from("ascend_stories")
        .select("id, user_id, caption, expires_at, kept_on_profile")
        .order("created_at", { ascending: false })
        .limit(40),
      supabase
        .from("ascend_notifications")
        .select("id, body, read_at")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (profilesResult.data) {
      setProfiles(profilesResult.data as Profile[]);
    }

    if (friendshipsResult.data) {
      const loadedFriendships = friendshipsResult.data as Friendship[];
      setFriendships(loadedFriendships);

      const firstFriend = loadedFriendships.find(
        (friendship) => friendship.status === "accepted"
      );
      if (firstFriend && !activeFriendId) {
        setActiveFriendId(
          firstFriend.requester_id === user.id
            ? firstFriend.addressee_id
            : firstFriend.requester_id
        );
      }
    }

    if (postsResult.data) {
      setPosts(postsResult.data as Post[]);
    }

    if (savedPostsResult.data) {
      setSavedPosts(savedPostsResult.data as SavedPost[]);
    }

    if (storiesResult.data) {
      setStories(storiesResult.data as Story[]);
    }

    if (notificationsResult.data) {
      setNotifications(notificationsResult.data as Notification[]);
    }

    const firstError =
      profilesResult.error ||
      friendshipsResult.error ||
      postsResult.error ||
      savedPostsResult.error ||
      storiesResult.error ||
      notificationsResult.error;

    setStatus(firstError ? firstError.message : "");
    setLoading(false);
  }, [activeFriendId, supabase]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      loadSocialData();
    }, 0);

    if (!supabase) {
      return () => window.clearTimeout(loadTimer);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadSocialData();
    });

    return () => {
      window.clearTimeout(loadTimer);
      subscription.unsubscribe();
    };
  }, [loadSocialData, supabase]);

  async function openConversation(friend: Friend) {
    if (!supabase || !userId || friend.status !== "friend") {
      return "";
    }

    setActiveFriendId(friend.id);

    const { data, error } = await supabase.rpc("create_direct_conversation", {
      other_user_id: friend.userId,
    });

    if (error || !data) {
      setStatus(error?.message || "Unable to open chat.");
      return "";
    }

    const conversationId = String(data);
    setActiveConversationId(conversationId);

    const { data: messageRows, error: messageError } = await supabase
      .from("ascend_messages")
      .select("id, conversation_id, sender_id, body, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (messageError) {
      setStatus(messageError.message);
    } else {
      setMessages((messageRows as Message[]) || []);
      setStatus("");
    }

    return conversationId;
  }

  async function sendFriendRequest(profile: Profile) {
    if (!supabase || !userId) {
      return;
    }

    const { error } = await supabase.from("ascend_friendships").insert({
      requester_id: userId,
      addressee_id: profile.user_id,
      status: "pending",
    });

    if (error) {
      setStatus(error.code === "23505" ? "Friend request already exists." : error.message);
      return;
    }

    await supabase.from("ascend_notifications").insert({
      user_id: profile.user_id,
      actor_id: userId,
      type: "friend_request",
      body: `${profileName(currentProfile)} sent you a friend request.`,
      href: "/social",
    });

    setStatus(`Friend request sent to ${profileName(profile)}.`);
    loadSocialData();
  }

  async function acceptRequest(friend: Friend) {
    if (!supabase || !userId) {
      return;
    }

    const { error } = await supabase
      .from("ascend_friendships")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", friend.friendshipId);

    if (error) {
      setStatus(error.message);
      return;
    }

    await supabase.from("ascend_notifications").insert({
      user_id: friend.userId,
      actor_id: userId,
      type: "friend_accept",
      body: "Your friend request was accepted.",
      href: "/social",
    });

    loadSocialData();
  }

  async function addPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !userId || !postDraft.trim()) {
      return;
    }

    const chosenCategory =
      postCategory === "Custom" ? customCategory.trim() : postCategory.trim();
    const tags = parseTags(`${tagDraft} ${postDraft}`);
    const media = mediaUrl.trim();
    const pnl = Number(pnlAmount);
    const extendedPost = {
      user_id: userId,
      body: postDraft.trim(),
      visibility: "friends",
      category: chosenCategory || null,
      tags,
      media_url: media || null,
      media_type: media ? mediaType : chosenCategory === "P&L" ? "pnl" : null,
      pnl_amount: Number.isFinite(pnl) && pnlAmount.trim() ? pnl : null,
    };

    const result = await supabase.from("ascend_social_posts").insert(extendedPost);
    const error = result.error
      ? (
          await supabase.from("ascend_social_posts").insert({
            user_id: extendedPost.user_id,
            body: [
              extendedPost.body,
              chosenCategory ? `#${cleanTag(chosenCategory)}` : "",
              ...tags.map((tag) => `#${tag}`),
              media ? `Media: ${media}` : "",
              extendedPost.pnl_amount !== null ? `P&L: ${extendedPost.pnl_amount}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
            visibility: "friends",
          })
        ).error
      : null;

    if (error) {
      setStatus(error.message);
      return;
    }

    setPostDraft("");
    setCustomCategory("");
    setTagDraft("");
    setMediaUrl("");
    setPnlAmount("");
    loadSocialData();
  }

  async function addStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !userId || !storyDraft.trim()) {
      return;
    }

    const { error } = await supabase.from("ascend_stories").insert({
      user_id: userId,
      caption: storyDraft.trim(),
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStoryDraft("");
    loadSocialData();
  }

  async function toggleSavedPost(post: Post) {
    if (!supabase || !userId) {
      return;
    }

    const isSaved = savedPostIds.has(post.id);
    const result = isSaved
      ? await supabase.from("ascend_saved_posts").delete().eq("post_id", post.id)
      : await supabase.from("ascend_saved_posts").insert({
          user_id: userId,
          post_id: post.id,
        });

    if (result.error) {
      setStatus(result.error.message);
      return;
    }

    loadSocialData();
  }

  async function keepStory(story: Story) {
    if (!supabase || story.user_id !== userId) {
      return;
    }

    const { error } = await supabase
      .from("ascend_stories")
      .update({ kept_on_profile: true })
      .eq("id", story.id);

    if (error) {
      setStatus(error.message);
      return;
    }

    loadSocialData();
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !activeFriend || !messageDraft.trim()) {
      return;
    }

    const conversationId =
      activeConversationId || (await openConversation(activeFriend));

    if (!conversationId) {
      return;
    }

    const { error } = await supabase.from("ascend_messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      body: messageDraft.trim(),
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setMessageDraft("");
    openConversation(activeFriend);
  }

  const involvedUserIds = new Set(friends.map((friend) => friend.userId));
  const searchResults = profiles
    .filter((profile) => profile.user_id !== userId)
    .filter((profile) => !involvedUserIds.has(profile.user_id))
    .filter((profile) =>
      `${profile.display_name} ${profile.handle || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .slice(0, 5);

  const visibleFriends = friends.filter((friend) =>
    `${friend.name} ${friend.handle}`.toLowerCase().includes(search.toLowerCase())
  );

  if (!supabase) {
    return (
      <section className="socialAuthPanel">
        <h2>Connect your account to activate social.</h2>
        <p>
          Social profiles, friend requests, messages, stories, and saved posts
          become active once account services are connected.
        </p>
        <div className="socialAuthActions">
          <Link href="/account">Open Account</Link>
          <Link href="/community">Community</Link>
        </div>
      </section>
    );
  }

  if (!userId && !loading) {
    return (
      <section className="socialAuthPanel">
        <h2>Sign in to use Ascenders Social.</h2>
        <p>
          Friend requests, messages, notifications, stories, and saved posts are
          connected to your Ascend profile.
        </p>
        <div className="socialAuthActions">
          <Link href="/account">Sign In</Link>
          <Link href="/community">Community</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="socialCommandPanel" aria-label="Social overview">
        <div>
          <p className="eyebrow">Social Command</p>
          <h2>Notifications, stories, friends, and messages in one place.</h2>
          <p>
            Keep direct chat inside the social layer, save useful posts, and
            turn short-lived stories into profile highlights when they matter.
          </p>
        </div>
        <div className="socialQuickStats">
          <article className="socialProfilePreview">
            <RankIcon rank={currentRank} size={46} />
            <span>Your Rank</span>
            <strong>{currentRank.currentRank}</strong>
            <small>{currentRank.progressLabel}. Next: {currentRank.nextRank}</small>
          </article>
          <article>
            <Bell size={17} />
            <span>Unread</span>
            <strong>{unreadNotifications.length}</strong>
          </article>
          <article>
            <UserPlus size={17} />
            <span>Friends</span>
            <strong>{acceptedFriends.length}</strong>
          </article>
          <article>
            <Clock size={17} />
            <span>Stories</span>
            <strong>{activeStories.length}</strong>
          </article>
          <article>
            <Bookmark size={17} />
            <span>Saved</span>
            <strong>{savedPostList.length}</strong>
          </article>
          <article>
            <Star size={17} />
            <span>Academy XP</span>
            <strong>{academyStats.xp}</strong>
          </article>
          <article>
            <Flame size={17} />
            <span>Streak</span>
            <strong>{academyStats.streak}</strong>
          </article>
          <article>
            {currentProfile?.pnl_public ? <Eye size={17} /> : <EyeOff size={17} />}
            <span>P&L</span>
            <strong>{currentProfile?.pnl_public ? "Public" : "Private"}</strong>
          </article>
        </div>
      </section>

      <section className="socialShell" aria-label="Ascenders social dashboard">
      <aside className="socialRail" aria-label="Notifications">
        <div className="socialPanelHeader">
          <span>
            <Bell size={18} />
            Notifications
          </span>
          <strong>{notificationText.length}</strong>
        </div>

        <div className="notificationList">
          {notificationText.map((notification) => (
            <p key={notification}>{notification}</p>
          ))}
        </div>

        <div className="socialPanelHeader compactHeader">
          <span>
            <UserPlus size={18} />
            Requests
          </span>
        </div>

        <div className="requestList">
          {friendRequests.length === 0 ? (
            <p>No pending friend requests.</p>
          ) : (
            friendRequests.map((friend) => (
              <article key={friend.id}>
                <div>
                  <strong>{friend.name}</strong>
                  <span>{friend.handle}</span>
                </div>
                <button type="button" onClick={() => acceptRequest(friend)}>
                  <Check size={16} />
                </button>
              </article>
            ))
          )}
        </div>

        <div className="socialPanelHeader compactHeader">
          <span>Find Friends</span>
        </div>

        <div className="profileSearchResults">
          {searchResults.length === 0 ? (
            <p>Search by name or handle.</p>
          ) : (
            searchResults.map((profile) => (
              <article key={profile.user_id}>
                <div>
                  <div className="socialIdentityLine">
                    <strong>{profileName(profile)}</strong>
                    <RankPill profile={profile} />
                  </div>
                  <span>{profileHandle(profile)}</span>
                </div>
                <button type="button" onClick={() => sendFriendRequest(profile)}>
                  <Plus size={16} />
                </button>
              </article>
            ))
          )}
        </div>
      </aside>

      <div className="socialMain">
        <form onSubmit={addStory} className="socialComposer storyComposer">
          <input
            value={storyDraft}
            onChange={(event) => setStoryDraft(event.target.value)}
            placeholder="Add a 24-hour story"
          />
          <button type="submit">
            <Plus size={18} />
          </button>
        </form>

        <section className="storyStrip" aria-label="Stories">
          {stories.length === 0 ? (
            <article className="storyBubble">
              <Sparkles size={18} />
              <strong>No stories yet</strong>
              <span>Post one to start the 24-hour story lane.</span>
            </article>
          ) : (
            stories.map((story) => {
              const author = profileMap.get(story.user_id);
              return (
                <article key={story.id} className="storyBubble">
                  <strong>{story.caption || "Story"}</strong>
                  <span>
                    {story.user_id === userId ? "You" : profileName(author)} -{" "}
                    {story.kept_on_profile ? "kept" : hoursLeft(story.expires_at)}
                  </span>
                  {story.user_id === userId && !story.kept_on_profile && (
                    <button type="button" onClick={() => keepStory(story)}>
                      Keep
                    </button>
                  )}
                </article>
              );
            })
          )}
        </section>

        <section className="socialGrid">
          <div className="socialFeed" aria-label="Posts">
            <div className="socialPanelHeader">
              <span>Member Posts</span>
              <strong>{posts.length}</strong>
            </div>

            <form onSubmit={addPost} className="socialComposer">
              <input
                value={postDraft}
                onChange={(event) => setPostDraft(event.target.value)}
                placeholder="Share a recap, lesson, chart note, or #market idea"
              />
              <button type="submit">
                <Send size={18} />
              </button>
              <div className="postComposerOptions">
                <select value={postCategory} onChange={(event) => setPostCategory(event.target.value)}>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {postCategory === "Custom" && (
                  <input
                    value={customCategory}
                    onChange={(event) => setCustomCategory(event.target.value)}
                    placeholder="Custom category"
                  />
                )}
                <input
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                  placeholder="Tags: liquidity, NQ, earnings"
                />
                <select value={mediaType || "chart"} onChange={(event) => setMediaType(event.target.value as Post["media_type"])}>
                  <option value="chart">Chart screenshot</option>
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                  <option value="pnl">P&L</option>
                </select>
                <input
                  value={mediaUrl}
                  onChange={(event) => setMediaUrl(event.target.value)}
                  placeholder="Optional photo/video/chart URL"
                />
                <input
                  value={pnlAmount}
                  onChange={(event) => setPnlAmount(event.target.value)}
                  inputMode="decimal"
                  placeholder="Optional P&L"
                />
              </div>
            </form>

            <div className="socialTagRail" aria-label="Discover post tags">
              <button type="button" className={!activeTag ? "isActive" : ""} onClick={() => setActiveTag("")}>
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={activeTag === tag ? "isActive" : ""}
                  onClick={() => setActiveTag(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <p className="emptySocialState">No posts yet.</p>
            ) : (
              filteredPosts.map((post) => {
                const author = profileMap.get(post.user_id);
                const saved = savedPostIds.has(post.id);
                const postTags = [
                  cleanTag(post.category || ""),
                  ...(post.tags || []).map(cleanTag),
                  ...extractHashtags(post.body),
                ].filter(Boolean);
                return (
                  <article key={post.id} className="socialPost">
                    <div>
                      <div className="socialIdentityLine">
                        <strong>
                          {post.user_id === userId ? "You" : profileName(author)}
                        </strong>
                        <RankPill profile={author} />
                      </div>
                      <span>{profileHandle(author)}</span>
                    </div>
                    <div className="postTagList">
                      {Array.from(new Set(postTags)).slice(0, 8).map((tag) => (
                        <button key={tag} type="button" onClick={() => setActiveTag(tag)}>
                          #{tag}
                        </button>
                      ))}
                    </div>
                    <p>{post.body}</p>
                    {post.pnl_amount !== null && post.pnl_amount !== undefined && (
                      <strong className={post.pnl_amount >= 0 ? "pnlPositive" : "pnlNegative"}>
                        P&L {post.pnl_amount >= 0 ? "+" : ""}{post.pnl_amount.toFixed(2)}
                      </strong>
                    )}
                    {post.media_url && (
                      post.media_type === "video" ? (
                        <video className="socialPostMedia" src={post.media_url} controls />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="socialPostMedia" src={post.media_url} alt="Social post attachment" />
                      )
                    )}
                    <button type="button" onClick={() => toggleSavedPost(post)}>
                      <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
                      {saved ? "Saved" : "Save"}
                    </button>
                  </article>
                );
              })
            )}
          </div>

          <aside className="profileShelf" aria-label="Profile saved items">
            <div className="socialPanelHeader">
              <span>Profile</span>
              <strong>{profileHighlights.length}</strong>
            </div>

            <h3>Story Highlights</h3>
            <div className="highlightList">
              {profileHighlights.length === 0 ? (
                <p>No highlights yet.</p>
              ) : (
                profileHighlights.map((story) => (
                  <span key={story.id}>{story.caption || "Story"}</span>
                ))
              )}
            </div>

            <h3>Saved Posts</h3>
            <div className="savedPostList">
              {savedPostList.length === 0 ? (
                <p>No saved posts yet.</p>
              ) : (
                savedPostList.map((post) => <p key={post.id}>{post.body}</p>)
              )}
            </div>
          </aside>
        </section>
      </div>

      <aside className="chatDock" aria-label="Direct messages">
        <div className="chatSearch">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find friends"
          />
        </div>

        <div className="friendList">
          {visibleFriends
            .filter((friend) => friend.status === "friend")
            .map((friend) => (
              <button
                key={friend.id}
                type="button"
                className={friend.id === activeFriendId ? "activeFriend" : ""}
                onClick={() => openConversation(friend)}
              >
                <MessageCircle size={16} />
                <span>{friend.name}</span>
              </button>
            ))}
        </div>

        <div className="chatWindow">
          <div className="chatHeader">
            <strong>{activeFriend?.name || "Select a friend"}</strong>
            <span>{activeFriend?.handle}</span>
          </div>

          <div className="messageList">
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map((message) => (
                <p
                  key={message.id}
                  className={message.sender_id === userId ? "myMessage" : ""}
                >
                  {message.body}
                </p>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} className="chatBar">
            <input
              value={messageDraft}
              onChange={(event) => setMessageDraft(event.target.value)}
              placeholder="Message a friend"
              disabled={!activeFriend}
            />
            <button type="submit" aria-label="Send message" disabled={!activeFriend}>
              <Send size={18} />
            </button>
          </form>
        </div>

        {status && <p className="accountStatus">{status}</p>}
      </aside>
    </section>
    </>
  );
}

function cleanTag(tag: string) {
  return tag.trim().toLowerCase().replace(/^#/, "").replace(/[^a-z0-9_&-]/g, "");
}

function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\s,]+/)
        .map(cleanTag)
        .filter((tag) => tag.length > 1)
    )
  ).slice(0, 12);
}

function extractHashtags(value: string) {
  return Array.from(value.matchAll(/#([a-z0-9_&-]+)/gi), (match) => cleanTag(match[1]));
}

function RankPill({ profile }: { profile?: Profile }) {
  const rank = rankStatusFromLevel(profile?.academy_level);

  return (
    <span className={`miniRankPill rankTone-${rank.tone}`}>
      <RankIcon rank={rank} size={24} />
      {rank.currentRank}
      <span className="rankHoverCard" role="tooltip">
        <em>Current rank</em>
        <strong>{rank.currentRank}</strong>
        <small>{rank.progressLabel} complete</small>
        <small>Next unlock: {rank.nextRank}</small>
        <small>{48 - rank.completedModules} modules remaining</small>
      </span>
    </span>
  );
}

function RankIcon({
  rank,
  size,
}: {
  rank: ReturnType<typeof rankStatusFromLevel>;
  size: number;
}) {
  return (
    <b>
      {rank.iconSrc ? (
        <Image src={rank.iconSrc} alt="" width={size} height={size} />
      ) : (
        rank.initials
      )}
    </b>
  );
}
