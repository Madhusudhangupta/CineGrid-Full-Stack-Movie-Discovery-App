import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGroups, fetchMyGroups, createGroup } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

export default function Groups() {
  const { isAuthenticated } = useAuth();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', isPrivate: false });
  const [activeTab, setActiveTab] = useState('explore'); // explore or my-groups

  useEffect(() => {
    loadData();
  }, [searchQuery, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'explore') {
        const data = await fetchGroups(1, 20, searchQuery);
        setGroups(data.items || []);
      } else if (isAuthenticated) {
        const data = await fetchMyGroups();
        setMyGroups(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newGroup.name.trim()) return;
    try {
      await createGroup(newGroup);
      setNewGroup({ name: '', description: '', isPrivate: false });
      setShowCreate(false);
      setActiveTab('my-groups');
      loadData();
    } catch (e) {
      alert(e.response?.data?.error || 'Error creating group');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Movie Clubs & Groups</h1>
        {isAuthenticated && (
          <button 
            onClick={() => setShowCreate(!showCreate)}
            className="bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
          >
            {showCreate ? 'Cancel' : 'Create a Group'}
          </button>
        )}
      </div>

      {showCreate && isAuthenticated && (
        <form onSubmit={handleCreate} className="border border-slate-200 dark:border-white/10 p-5 rounded-2xl bg-white dark:bg-white/5 space-y-4">
          <h2 className="text-lg font-semibold">Create New Group</h2>
          <input 
            type="text" 
            placeholder="Group Name"
            className="w-full p-2 border border-slate-200 dark:border-white/10 rounded-md bg-transparent"
            value={newGroup.name}
            onChange={e => setNewGroup({...newGroup, name: e.target.value})}
            required
            maxLength={100}
          />
          <textarea 
            placeholder="Description"
            className="w-full p-2 border border-slate-200 dark:border-white/10 rounded-md bg-transparent h-24"
            value={newGroup.description}
            onChange={e => setNewGroup({...newGroup, description: e.target.value})}
            maxLength={1000}
          />
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={newGroup.isPrivate}
              onChange={e => setNewGroup({...newGroup, isPrivate: e.target.checked})}
            />
            Make group private (only members can view discussions)
          </label>
          <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded text-sm font-semibold">
            Create Group
          </button>
        </form>
      )}

      {isAuthenticated && (
        <div className="flex gap-4 border-b border-slate-200 dark:border-white/10">
          <button 
            onClick={() => setActiveTab('explore')}
            className={`pb-2 px-1 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'explore' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Explore
          </button>
          <button 
            onClick={() => setActiveTab('my-groups')}
            className={`pb-2 px-1 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'my-groups' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            My Groups
          </button>
        </div>
      )}

      {activeTab === 'explore' && (
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search groups..."
            className="w-full max-w-md p-2 border border-slate-200 dark:border-white/10 rounded-md bg-transparent"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <p className="opacity-70">Loading groups...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === 'explore' ? groups : myGroups).map(group => (
            <Link 
              to={`/groups/${group._id}`} 
              key={group._id} 
              className="border border-slate-200 dark:border-white/10 p-5 rounded-2xl bg-white dark:bg-white/5 hover:border-sky-500 dark:hover:border-sky-400 transition-colors flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg leading-tight">{group.name}</h3>
                  {group.isPrivate && <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">Private</span>}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{group.description || 'No description provided.'}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 text-xs text-slate-500 font-medium">
                {group.members?.length || 0} Member{group.members?.length !== 1 ? 's' : ''}
              </div>
            </Link>
          ))}
          {(activeTab === 'explore' && groups.length === 0) && <p className="col-span-full opacity-70">No groups found.</p>}
          {(activeTab === 'my-groups' && myGroups.length === 0) && <p className="col-span-full opacity-70">You haven't joined any groups yet.</p>}
        </div>
      )}
    </div>
  );
}
