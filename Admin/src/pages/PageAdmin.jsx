// import React, { useState, useEffect, useCallback } from 'react';
// import { Plus } from 'lucide-react';
// import { getAuthHeaders } from '../../utils/auth';

// const API_BASE_URL = '/api/admin/page_metadata';

// const PageAdmin = () => {
//     const [pages, setPages] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [status, setStatus] = useState({ message: '', type: '' });

//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [totalItems, setTotalItems] = useState(0);

//     const fetchPages = useCallback(async () => {
//         setIsLoading(true);
//         setError('');
//         try {
//             const response = await fetch(`${API_BASE_URL}?page=${currentPage}&limit=${itemsPerPage}`, getAuthHeaders());
//             const data = await response.json();
//             if (data.pages && data.totalCount !== undefined) {
//                 setPages(data.pages);
//                 setTotalItems(data.totalCount);
//             } else {
//                 throw new Error('Invalid data structure received from API.');
//             }
//         } catch (err) {
//             console.error(err);
//             setError('Failed to fetch pages.');
//             setPages([]);
//             setTotalItems(0);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [currentPage, itemsPerPage]);

//     useEffect(() => {
//         fetchPages();
//     }, [fetchPages]);

//     const handleInputChange = (e, slug) => {
//         const { name, value } = e.target;
//         setPages(prev =>
//             prev.map(page => (page.page_slug === slug ? { ...page, [name]: value } : page))
//         );
//     };

//     const handleBreadcrumbsChange = (e, slug) => {
//         const { value } = e.target;
//         setPages(prev =>
//             prev.map(page => {
//                 if (page.page_slug === slug) {
//                     try {
//                         const parsed = JSON.parse(value);
//                         return { ...page, breadcrumbs: parsed };
//                     } catch {
//                         return { ...page, breadcrumbs: value };
//                     }
//                 }
//                 return page;
//             })
//         );
//     };

//     const handleSave = async (page) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/${page.page_slug}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json', ...getAuthHeaders().headers },
//                 body: JSON.stringify({
//                     title: page.page_title,
//                     activePage: page.active_page_label,
//                     breadcrumbs: typeof page.breadcrumbs === 'string' ? [] : page.breadcrumbs,
//                     imageUrl: page.image_url,
//                 }),
//             });
//             if (!response.ok) throw new Error('Failed to save changes');
//             setStatus({ message: `Saved "${page.page_slug}" successfully!`, type: 'success' });
//         } catch (err) {
//             console.error(err);
//             setStatus({ message: `Failed to save "${page.page_slug}".`, type: 'error' });
//         } finally {
//             setTimeout(() => setStatus({ message: '', type: '' }), 3000);
//         }
//     };

//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
//     const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
//     const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

//     const pageStyles = `
//         .main-content { padding: 2rem; max-width: 1200px; margin: 0 auto; font-family: 'Inter', sans-serif; min-height: 100vh; background-color: #f9fafb; }
//         .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
//         .list-header h2 { font-size: 2rem; font-weight: 700; }
//         .submit-btn { display: flex; align-items: center; gap: 0.5rem; background-color: #6F4E37; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; border: none; }
//         .submit-btn:hover { background-color: #4F3827; }
//         .card { background-color: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
//         .table-container { overflow-x: auto; }
//         table { width: 100%; border-collapse: separate; border-spacing: 0 1rem; }
//         thead th { text-align: left; padding: 0.5rem 1rem; font-size: 0.875rem; color: #4B5563; text-transform: uppercase; letter-spacing: 0.05em; }
//         tbody tr { background-color: #f9fafb; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: transform 0.2s ease; }
//         tbody tr:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
//         td { padding: 1rem; vertical-align: middle; }
//         td:first-child { border-top-left-radius: 0.75rem; border-bottom-left-radius: 0.75rem; }
//         td:last-child { border-top-right-radius: 0.75rem; border-bottom-right-radius: 0.75rem; }
//         .icon-btn { padding: 0.5rem; border-radius: 50%; background: none; border: none; cursor: pointer; transition: background-color 0.2s ease; margin: 0 0.25rem; }
//         .edit-btn { color: #2563EB; }
//         .delete-btn { color: #DC2626; }
//         .edit-btn:hover { background-color: #DBEAFE; }
//         .delete-btn:hover { background-color: #FEE2E2; }
//         .pagination-container { display: flex; justify-content: center; align-items: center; margin-top: 2rem; gap: 0.5rem; }
//         .pagination-btn { background-color: #fff; border: 1px solid #ddd; border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; transition: all 0.2s ease; font-weight: 500; color: #4B5563; }
//         .pagination-btn:hover:not(.active) { background-color: #f0f0f0; border-color: #ccc; }
//         .pagination-btn.active { background-color: #6F4E37; color: white; border-color: #6F4E37; pointer-events: none; }
//         .pagination-btn:disabled { cursor: not-allowed; opacity: 0.5; background-color: #f9fafb; }
//     `;

//     if (isLoading) return <main className="main-content"><div className="card">Loading pages...</div></main>;
//     if (error) return <main className="main-content"><div className="card text-red-500">{error}</div></main>;

//     return (
//         <main className="main-content">
//             <style>{pageStyles}</style>
//             <div className="list-header">
//                 <h2>Manage Pages</h2>
//                 <button className="submit-btn">
//                     <Plus size={20} /> Add Page
//                 </button>
//             </div>

//             {pages.length === 0 ? (
//                 <div className="card"><p>No pages found.</p></div>
//             ) : (
//                 <div className="card table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Slug</th>
//                                 <th>Title</th>
//                                 <th>Active Page</th>
//                                 <th>Breadcrumbs (JSON)</th>
//                                 <th>Image URL</th>
//                                 <th className="text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {pages.map(page => (
//                                 <tr key={page.page_slug}>
//                                     <td>{page.page_slug}</td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             name="page_title"
//                                             value={page.page_title || ''}
//                                             onChange={e => handleInputChange(e, page.page_slug)}
//                                             className="w-full p-2 border rounded-md"
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             name="active_page_label"
//                                             value={page.active_page_label || ''}
//                                             onChange={e => handleInputChange(e, page.page_slug)}
//                                             className="w-full p-2 border rounded-md"
//                                         />
//                                     </td>
//                                     <td>
//                                         <textarea
//                                             name="breadcrumbs"
//                                             value={typeof page.breadcrumbs === 'object' ? JSON.stringify(page.breadcrumbs, null, 2) : page.breadcrumbs}
//                                             onChange={e => handleBreadcrumbsChange(e, page.page_slug)}
//                                             className="w-full p-2 border rounded-md text-xs font-mono"
//                                             rows="4"
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             name="image_url"
//                                             value={page.image_url || ''}
//                                             onChange={e => handleInputChange(e, page.page_slug)}
//                                             className="w-full p-2 border rounded-md"
//                                         />
//                                     </td>
//                                     <td className="text-center">
//                                         <button
//                                             onClick={() => handleSave(page)}
//                                             className="submit-btn"
//                                         >
//                                             Save
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {totalPages > 1 && (
//                         <div className="pagination-container">
//                             <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="pagination-btn">Prev</button>
//                             {pageNumbers.map(number => (
//                                 <button key={number} onClick={() => setCurrentPage(number)} className={`pagination-btn ${number === currentPage ? 'active' : ''}`}>
//                                     {number}
//                                 </button>
//                             ))}
//                             <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="pagination-btn">Next</button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </main>
//     );
// };

// export default PageAdmin;
