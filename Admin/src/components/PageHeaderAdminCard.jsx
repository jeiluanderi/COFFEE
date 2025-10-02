import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import './PageHeaderAdminCard.css'

// --- Icons (Keep unchanged) ---
const EditIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);
const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);
const PlusIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="5" y2="19" />
    <line x1="5" x2="19" y1="12" y2="12" />
  </svg>
);

// --- Modal Base (Keep unchanged - the positioning classes are correct here) ---
const ModalBase = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-blue-600 transition">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- Add Setting Modal (Using custom button classes) ---
const AddSettingModal = ({ isOpen, onClose, onSave, isLoading }) => {
  const [key, setKey] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setKey('');
      setImageUrl('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSave(key, imageUrl);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Add New Page Header Setting">
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Page Key</label>
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} placeholder="e.g., home_page" />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Header Image URL</label>
        <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} placeholder="https://example.com/image.jpg" />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition" disabled={isLoading}>Cancel</button>
        {/* Using btn-success custom class */}
        <button onClick={handleSubmit} className="action-button btn-success text-white rounded hover:bg-green-600 transition disabled:opacity-50" disabled={isLoading || !key || !imageUrl}>
          {isLoading ? 'Adding...' : 'Add Setting'}
        </button>
      </div>
    </ModalBase>
  );
};

// --- Edit Setting Modal (Using custom button classes) ---
const EditSettingModal = ({ isOpen, onClose, onSave, editItem, isLoading }) => {
  
  const [localKey, setLocalKey] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');

  useEffect(() => {
    if (isOpen && editItem) {
      setLocalKey(editItem.key);
      setLocalImageUrl(editItem.image_url);
    }
  }, [isOpen, editItem]);

  if (!isOpen || !editItem) return null;

  const handleSave = () => {
    onSave(editItem.id, localKey, localImageUrl);
  }

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Edit Page Header Setting">
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Page Key</label>
        <input type="text" value={localKey} onChange={(e) => setLocalKey(e.target.value)} className="w-full border border-gray-300 p-2 rounded bg-gray-100 cursor-not-allowed" disabled />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Header Image URL</label>
        <input type="url" value={localImageUrl} onChange={(e) => setLocalImageUrl(e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition" disabled={isLoading}>Cancel</button>
        {/* Using btn-primary custom class */}
        <button onClick={handleSave} className="action-button btn-primary text-white rounded hover:bg-blue-600 transition disabled:opacity-50" disabled={isLoading || !localKey || !localImageUrl}>
          {isLoading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </ModalBase>
  );
};


// --- Confirmation Modal (Using custom button classes) ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <p className="mb-4">Are you sure you want to delete this page header?</p>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded" disabled={isLoading}>Cancel</button>
        {/* Using btn-danger custom class */}
        <button onClick={onConfirm} className="action-button btn-danger text-white rounded hover:bg-red-600 transition disabled:opacity-50" disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </ModalBase>
  );
};

// --- Main Admin Component ---
const PageHeaderAdminCard = () => {
  const backendUrl = 'http://localhost:3001/api/admin/page-settings';
  // ... (State and Handlers logic remains correct and stable) ...

  const [settings, setSettings] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [selectedId, setSelectedId] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]); 
  
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/all`, { headers });
      setSettings(res.data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [headers]); 

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleAdd = async (key, imageUrl) => {
    setIsLoading(true);
    try {
      await axios.post(backendUrl, { key, title: key, image_url: imageUrl }, { headers });
      setIsAddOpen(false);
      fetchSettings(); 
    } catch (err) {
      console.error("Error adding setting:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id, key, imageUrl) => {
    setIsLoading(true);
    try {
      await axios.put(`${backendUrl}/${id}`, { key, title: key, image_url: imageUrl }, { headers });
      setIsEditOpen(false);
      setEditingItem(null); 
      fetchSettings(); 
    } catch (err) {
      console.error("Error updating setting:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsLoading(true);
    try {
      await axios.delete(`${backendUrl}/${selectedId}`, { headers });
      setIsConfirmOpen(false);
      setSelectedId(null);
      fetchSettings(); 
    } catch (err) {
      console.error("Error deleting setting:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = useCallback((item) => {
    setEditingItem(item);
    setIsEditOpen(true);
  }, []);

  const openDeleteModal = useCallback((id) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
  }, []);


  return (
    // FIX 1: Use custom class for main card styling
    <div className="page-header-admin-card"> 
      

      {isLoading && settings.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Loading settings...</p>
      ) : settings.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No settings found. Click 'Add New' to create one.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* FIX 3a: Outer table for fixed header. Use the custom class. */}
          <table className="admin-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Image URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Actions</th>
              </tr>
            </thead>
          </table>
          
          {/* FIX 4: Scrollable Div wrapping the table body */}
          <div className="table-scroll-container">
             <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {settings.map((s) => (
                    <tr key={s.id}>
                      {/* FIX 5: Apply column widths and custom padding/font size to TD elements */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4">{s.key}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs w-1/2">{s.image_url}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3 w-1/4">
                        {/* FIX 6: Apply custom classes for action buttons */}
                        <button 
                          onClick={() => openEditModal(s)} 
                          className="action-button btn-primary"
                          disabled={isLoading}
                          title="Edit Setting"
                        >
                          <EditIcon />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(s.id)} 
                          className="action-button btn-danger"
                          disabled={isLoading}
                          title="Delete Setting"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
      )}

      {/* MODALS ARE RENDERED HERE, OUTSIDE THE TABLE STRUCTURE */}
      <EditSettingModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingItem(null);
        }}
        onSave={handleEdit}
        editItem={editingItem}
        isLoading={isLoading}
      />
      <AddSettingModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={handleAdd} isLoading={isLoading} />
      <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} isLoading={isLoading} />
    </div>
  );
};

export default PageHeaderAdminCard;