import React from 'react';
import { type Author } from '../lib/graphql';

interface TodoFormProps {
  formState: {
    content: string;
    authorId: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  submitting: boolean;
  editingId: string | null;
  authors: Author[];
}

export default function TodoForm({ formState, handleChange, submitting, editingId, authors }: TodoFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium text-gray-700">Content</label>
        <input
          type="text"
          name="content"
          value={formState.content}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter todo content"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">Author</label>
        <select
          name="authorId"
          value={formState.authorId}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Select an author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 