import { useState, useEffect } from 'react';
import { fetchCustomLists, createCustomList, deleteCustomList, addCollaborator, removeCollaborator, searchUsers } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

export default function CustomLists() {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newList, setNewList] = useState({ name: '', description: '', isPublic: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeListId, setActiveListId] = useState(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const data = await fetchCustomLists();
      setLists(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newList.name.trim()) return;
    try {
      await createCustomList(newList);
      setNewList({ name: '', description: '', isPublic: false });
      setShowCreate(false);
      loadLists();
    } catch (e) {
      alert('Error creating list');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this list?')) return;
    try {
      await deleteCustomList(id);
      loadLists();
    } catch (e) {
      alert('Error deleting list');
    }
  };

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCollaborator = async (listId, userId) => {
    try {
      await addCollaborator(listId, userId);
      alert('Collaborator added!');
      setSearchResults([]);
      setSearchQuery('');
      loadLists();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to add collaborator');
    }
  };

  const handleRemoveCollaborator = async (listId, userId) => {
    try {
      await removeCollaborator(listId, userId);
      loadLists();
    } catch (e) {
      alert('Failed to remove collaborator');
    }
  };

  if (loading) return <p className="opacity-70">Loading your lists...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">My Custom Lists</h3>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="bg-sky-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-sky-600"
        >
          {showCreate ? 'Cancel' : 'Create List'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="border p-4 rounded-lg bg-slate-50 dark:bg-white/5 space-y-3">
          <input 
            type="text" 
            placeholder="List Name"
            className="w-full p-2 border rounded text-sm bg-white dark:bg-slate-800"
            value={newList.name}
            onChange={e => setNewList({...newList, name: e.target.value})}
            required
          />
          <textarea 
            placeholder="Description"
            className="w-full p-2 border rounded text-sm bg-white dark:bg-slate-800"
            value={newList.description}
            onChange={e => setNewList({...newList, description: e.target.value})}
          />
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={newList.isPublic}
              onChange={e => setNewList({...newList, isPublic: e.target.checked})}
            />
            Make this list public
          </label>
          <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded text-sm font-semibold">
            Save
          </button>
        </form>
      )}

      <div className="space-y-4">
        {lists.length === 0 && <p className="text-sm opacity-70">You don't have any custom lists yet.</p>}
        {lists.map(list => {
          const isOwner = list.user === user?._id || list.user?._id === user?._id;
          return (
            <div key={list._id} className="border rounded-xl p-4 bg-white dark:bg-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{list.name}</h4>
                  <p className="text-sm opacity-70">{list.description}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {list.items?.length || 0} items • {list.isPublic ? 'Public' : 'Private'} 
                    {isOwner ? '' : ' • Shared with you'}
                  </p>
                </div>
                {isOwner && (
                  <button onClick={() => handleDelete(list._id)} className="text-red-500 text-sm hover:underline">
                    Delete
                  </button>
                )}
              </div>

              {/* Collaborators section */}
              {isOwner && (
                <div className="mt-4 border-t pt-3 border-slate-100 dark:border-white/10">
                  <h5 className="text-sm font-semibold mb-2">Collaborators</h5>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {list.collaborators?.map(collab => (
                      <div key={collab._id} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1 text-sm">
                        <img src={collab.avatar || `https://ui-avatars.com/api/?name=${collab.username}`} className="w-5 h-5 rounded-full object-cover" alt="" />
                        <span>@{collab.username}</span>
                        <button onClick={() => handleRemoveCollaborator(list._id, collab._id)} className="text-slate-400 hover:text-red-500">&times;</button>
                      </div>
                    ))}
                  </div>
                  
                  {activeListId === list._id ? (
                    <form onSubmit={handleSearchUsers} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Search username or email"
                        className="flex-1 p-1.5 border rounded text-sm bg-white dark:bg-slate-800"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                      <button type="submit" className="bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded text-sm">Search</button>
                      <button type="button" onClick={() => { setActiveListId(null); setSearchResults([]); }} className="text-sm opacity-70 px-2">Cancel</button>
                    </form>
                  ) : (
                    <button onClick={() => setActiveListId(list._id)} className="text-sm text-sky-500 hover:underline">
                      + Invite Collaborator
                    </button>
                  )}

                  {activeListId === list._id && searchResults.length > 0 && (
                    <div className="mt-2 space-y-2 border rounded-md p-2 bg-slate-50 dark:bg-slate-800/50">
                      {searchResults.map(resUser => (
                        <div key={resUser._id} className="flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                          <div className="flex items-center gap-2">
                            <img src={resUser.avatar || `https://ui-avatars.com/api/?name=${resUser.username}`} className="w-6 h-6 rounded-full" alt="" />
                            <span className="text-sm font-medium">@{resUser.username}</span>
                          </div>
                          <button 
                            onClick={() => handleAddCollaborator(list._id, resUser._id)}
                            className="text-xs bg-sky-500 text-white px-2 py-1 rounded"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
