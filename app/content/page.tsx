"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  client,
  type Article,
  type Author,
  type Todo,
  listArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  listAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor,
  listTodos,
  addTodo,
  updateTodo,
  deleteTodo
} from "../lib/graphql";
import { GraphQLResult } from "@aws-amplify/api";
import dynamic from 'next/dynamic';
import TodoForm from '../components/TodoForm';
import AuthorForm from '../components/AuthorForm';

const Loader = dynamic(() => import('../components/Loader'), {
  ssr: false
});

export default function Content() {
  const [items, setItems] = useState<(Article | Author | Todo)[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formState, setFormState] = useState<Omit<any, "id">>({
    authorId: "",
    title: "",
    content: "",
    type: "todo",
    name : "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [activeMenu, setActiveMenu] = useState<'todo' | 'article' | 'author'>('todo');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null; title: string }>({
    show: false,
    id: null,
    title: ""
  });

  useEffect(() => {
    fetchItems();
  }, [activeMenu]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let response : any;
      
      switch (activeMenu) {
        case 'todo':
          response = await client.graphql({
            query: listTodos
          });
          if (response.data) {
            setItems(response.data.ListTodos.items);
          }
          break;
        case 'article':
          response = await client.graphql({
            query: listArticles
          });
          if (response.data) {
            setItems(response.data.ListArticles.items);
          }
          break;
        case 'author':
          response = await client.graphql({
            query: listAuthors
          });
          if (response.data) {
            setItems(response.data.ListAuthors.items);
          }
          break;
      }

      // Always fetch authors for the todo form
      const authorsResponse : any = await client.graphql({
        query: listAuthors
      });
      if (authorsResponse.data) {
        setAuthors(authorsResponse.data.ListAuthors.items);
      }
      
      setError(null);
    } catch (err) {
      setError("Failed to fetch content items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let response : any;
      
      switch (activeMenu) {
        case 'todo':
          if (editingId) {
            response = await client.graphql({
              query: updateTodo,
              variables: {
                id: editingId,
                content: formState.content,
                authorId: formState.authorId
              }
            });
          } else {
            response = await client.graphql({
              query: addTodo,
              variables: {
                content: formState.content,
                authorId: formState.authorId
              }
            });
          }
          break;
        case 'article':
          if (editingId) {
            response = await client.graphql({
              query: updateArticle,
              variables: {
                id: editingId,
                title: formState.title,
                content: formState.content,
                authorId: formState.authorId
              }
            });
          } else {
            response = await client.graphql({
              query: addArticle,
              variables: {
                title: formState.title,
                content: formState.content,
                authorId: formState.authorId
              }
            });
          }
          break;
        case 'author':
          if (editingId) {
            response = await client.graphql({
              query: updateAuthor,
              variables: {
                id: editingId,
                name: formState.title
              }
            });
          } else {
            response = await client.graphql({
              query: addAuthor,
              variables: {
                name: formState.title
              }
            });
          }
          break;
      }

      // Reset form and refresh items
      setFormState({ 
        authorId: "", 
        title: "", 
        content: "",
        type: activeMenu,
      });
      setEditingId(null);
      await fetchItems();
    } catch (err) {
      setError("Failed to save content");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    
    // Set form state based on the active menu
    switch (activeMenu) {
      case 'author':
        setFormState({
          authorId: "",
          name: item.name || "", // For authors, use name as title
          content: "",
          type: activeMenu,
        });
        break;
      case 'article':
        setFormState({
          authorId: item.authorId || "",
          title: item.title || "",
          content: item.content || "",
          type: activeMenu,
        });
        break;
      case 'todo':
        setFormState({
          authorId: item.authorId || "",
          title: "",
          content: item.content || "",
          type: activeMenu,
        });
        break;
    }
  };

  const handleDeleteClick = (item: Article | Author | Todo) => {
    setDeleteConfirm({
      show: true,
      id: item.id,
      title: 'title' in item ? item.title : 'content' in item ? item.content : ""
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    setDeleting(true);

    try {
      let response;
      
      switch (activeMenu) {
        case 'todo':
          response = await client.graphql({
            query: deleteTodo,
            variables: { id: deleteConfirm.id }
          });
          break;
        case 'article':
          response = await client.graphql({
            query: deleteArticle,
            variables: { id: deleteConfirm.id }
          });
          break;
        case 'author':
          response = await client.graphql({
            query: deleteAuthor,
            variables: { id: deleteConfirm.id }
          });
          break;
      }

      await fetchItems();
    } catch (err) {
      setError("Failed to delete content");
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteConfirm({ show: false, id: null, title: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, id: null, title: "" });
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
              <p className="text-gray-600 mt-1">Manage your content</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Menu Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setActiveMenu('todo')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeMenu === 'todo'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setActiveMenu('article')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeMenu === 'article'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Article
              </button>
              <button
                onClick={() => setActiveMenu('author')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeMenu === 'author'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Author
              </button>
            </nav>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-8">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg p-6 shadow-md space-y-4"
            >
              {activeMenu === 'todo' && (
                <TodoForm
                  formState={formState as Todo}
                  handleChange={handleChange}
                  submitting={submitting}
                  editingId={editingId}
                  authors={authors}
                />
              )}

              {activeMenu === 'article' && (
                <>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Author ID
                    </label>
                    <input
                      type="text"
                      name="authorId"
                      value={formState.authorId}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formState.title}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      name="content"
                      value={formState.content}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </>
              )}

              {activeMenu === 'author' && (
                <AuthorForm
                  formState={formState as Author}
                  handleChange={handleChange}
                  submitting={submitting}
                  editingId={editingId}
                />
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingId ? "Update" : "Create"
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormState({ 
                        authorId: "", 
                        title: "", 
                        content: "",
                        name: "",
                        type: activeMenu,
                      });
                      setEditingId(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Existing Content</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${
                      viewMode === 'list'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="List View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md ${
                      viewMode === 'table'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Table View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader />
                  <p className="mt-4 text-gray-600 text-sm">Loading your content...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-4 text-gray-600">No content available.</p>
                </div>
              ) : viewMode === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                        {activeMenu === 'todo' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        )}
                        {activeMenu === 'article' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        )}
                        {activeMenu === 'author' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author ID</th>
                        )}
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {'content' in item ? item.content : 'title' in item ? item.title as string : ''}
                            </div>
                          </td>
                          {activeMenu === 'todo' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{'authorId' in item ? item.authorId : ''}</div>
                            </td>
                          )}
                          {activeMenu === 'article' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{'authorId' in item ? item.authorId : ''}</div>
                            </td>
                          )}
                          {activeMenu === 'author' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{'name' in item ? item.name : ''}</div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {'content' in item ? item.content : 'title' in item ? item.title as string: ''}
                          </h3>
                          {activeMenu === 'todo' && (
                            <p className="text-sm text-gray-600 mt-1">Author: {'authorId' in item ? item.authorId : ''}</p>
                          )}
                          {activeMenu === 'article' && (
                            <p className="text-sm text-gray-600 mt-1">Author: {'authorId' in item ? item.authorId : ''}</p>
                          )}
                          {activeMenu === 'author' && (
                            <p className="text-sm text-gray-600 mt-1">Name: {'name' in item ? item.name : ''}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
