import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGroupById, joinGroup, leaveGroup, postGroupDiscussion, deleteGroupDiscussion } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState('');
  
  const loadGroup = async () => {
    try {
      const data = await fetchGroupById(id);
      setGroup(data);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
  }, [id]);

  const handleJoin = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await joinGroup(id);
      loadGroup();
    } catch (e) {
      alert(e.response?.data?.error || 'Error joining group');
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    try {
      await leaveGroup(id);
      loadGroup();
    } catch (e) {
      alert('Error leaving group');
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await postGroupDiscussion(id, newPost);
      setNewPost('');
      loadGroup();
    } catch (e) {
      alert('Failed to post discussion');
    }
  };

  const handleDeletePost = async (discussionId) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteGroupDiscussion(id, discussionId);
      loadGroup();
    } catch (e) {
      alert('Failed to delete post');
    }
  };

  if (loading) return <p className="opacity-70">Loading group...</p>;
  if (error) return (
    <div className="text-center py-10">
      <h2 className="text-xl font-bold text-red-500 mb-2">Access Denied</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
      <button onClick={() => navigate('/groups')} className="text-sky-500 hover:underline">Return to Groups</button>
    </div>
  );
  if (!group) return <p>Group not found.</p>;

  const isMember = group.members?.some(m => m._id === user?._id);
  const isAdmin = group.admins?.some(a => a._id === user?._id);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 bg-white dark:bg-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{group.name}</h1>
              {group.isPrivate && <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">Private</span>}
            </div>
            <p className="text-slate-600 dark:text-slate-300 max-w-3xl">{group.description}</p>
          </div>
          <div>
            {isMember ? (
              <button onClick={handleLeave} className="border border-slate-200 dark:border-white/20 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                Leave Group
              </button>
            ) : (
              <button onClick={handleJoin} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-md">
                Join Group
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Discussions</h2>
          
          {isMember ? (
            <form onSubmit={handlePost} className="border border-slate-200 dark:border-white/10 p-4 rounded-xl bg-white dark:bg-white/5">
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 resize-none h-24 mb-3"
                placeholder="Start a discussion or share your thoughts..."
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
              />
              <div className="flex justify-end">
                <button type="submit" disabled={!newPost.trim()} className="bg-sky-500 disabled:opacity-50 text-white font-semibold px-4 py-1.5 rounded-lg">
                  Post
                </button>
              </div>
            </form>
          ) : (
            <div className="border border-slate-200 dark:border-white/10 p-6 rounded-xl text-center bg-slate-50 dark:bg-white/5">
              <p className="opacity-70 mb-2">You must join this group to participate in discussions.</p>
              <button onClick={handleJoin} className="text-sky-500 font-semibold hover:underline">Join Now</button>
            </div>
          )}

          <div className="space-y-4">
            {group.discussions?.slice().reverse().map(disc => {
              const isAuthor = disc.user._id === user?._id;
              return (
                <div key={disc._id} className="border border-slate-200 dark:border-white/10 p-4 rounded-xl bg-white dark:bg-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <img src={disc.user.avatar || `https://ui-avatars.com/api/?name=${disc.user.username}`} className="w-10 h-10 rounded-full" alt="" />
                      <div>
                        <p className="font-semibold leading-tight">@{disc.user.username}</p>
                        <p className="text-xs opacity-60">{new Date(disc.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {(isAdmin || isAuthor) && (
                      <button onClick={() => handleDeletePost(disc._id)} className="text-slate-400 hover:text-red-500 text-sm">
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">{disc.content}</p>
                </div>
              );
            })}
            {group.discussions?.length === 0 && <p className="opacity-70 py-4 text-center">No discussions yet. Be the first to post!</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-slate-200 dark:border-white/10 p-5 rounded-2xl bg-white dark:bg-white/5">
            <h3 className="font-bold mb-4">Members ({group.members?.length || 0})</h3>
            <div className="space-y-3">
              {group.members?.map(member => {
                const isGroupAdmin = group.admins?.some(a => a._id === member._id);
                return (
                  <div key={member._id} className="flex items-center gap-3">
                    <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.username}`} className="w-8 h-8 rounded-full" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">@{member.username}</p>
                    </div>
                    {isGroupAdmin && <span className="text-[10px] uppercase font-bold text-sky-500 bg-sky-50 dark:bg-sky-500/10 px-1.5 py-0.5 rounded">Admin</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
