import React from 'react';

interface AuthorFormProps {
  formState: {
    name: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  submitting: boolean;
  editingId: string | null;
}

export default function AuthorForm({ formState, handleChange, submitting, editingId }: AuthorFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium text-gray-700">Author Name</label>
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter author name"
        />
      </div>
    </div>
  );
} 