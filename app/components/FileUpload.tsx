import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { GraphQLResult } from '@aws-amplify/api';
import { Amplify } from 'aws-amplify';

interface UploadFileResponse {
  UploadFileS3: {
    url: string;
    key: string;
  };
}

interface GetFileResponse {
  GetFileS3: {
    url: string;
    key: string;
  };
}

// Initialize Amplify configuration
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'https://x7xgwafhwjeqbbk4qqt7jzkst4.appsync-api.us-east-1.amazonaws.com/graphql',
      region: "us-east-1",
      defaultAuthMode: "apiKey",
      apiKey: process.env.NEXT_PUBLIC_API_KEY ?? 'https://x7xgwafhwjeqbbk4qqt7jzkst4.appsync-api.us-east-1.amazonaws.com/graphql'
    }
  },
  Storage: {
    S3: {
      bucket: "brand-workload-content-dx0n-eocw-s3-dev",
      region: "us-east-1",
      buckets: {
        "brand-workload-content-dx0n-eocw-s3-dev": {
          bucketName: "brand-workload-content-dx0n-eocw-s3-dev",
          region: "us-east-1"
        }
      }
    }
  }
});

const client = generateClient<Schema>();

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verify configuration on component mount
    // if (!process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || !process.env.NEXT_PUBLIC_API_KEY) {
    //   setError('API configuration is missing. Please check your environment variables.');
    // }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setError(null);

    try {
      setUploading(true);
      
      // Get the signed URL from the custom resolver
      const uploadResponse = await client.graphql({
        query: `
          mutation UploadFileS3($key: String!, $contentType: String!) {
            UploadFileS3(key: $key, contentType: $contentType) {
              url
              key
            }
          }
        `,
        variables: {
          key: `amp-app/${Date.now()}-${selectedFile.name}`,
          contentType: selectedFile.type,
        },
      }) as GraphQLResult<UploadFileResponse>;

      if (!uploadResponse.data) {
        throw new Error('Failed to get upload URL');
      }

      const { url, key } = uploadResponse.data.UploadFileS3;

      // Upload the file using the signed URL
      const response = await fetch(url, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Get the public URL for the uploaded file
      const getFileResponse = await client.graphql({
        query: `
          query GetFileS3($key: String!) {
            GetFileS3(key: $key) {
              url
              key
            }
          }
        `,
        variables: {
          key: key,
        },
      }) as GraphQLResult<GetFileResponse>;

      if (!getFileResponse.data) {
        throw new Error('Failed to get file URL');
      }

      const { url: publicUrl } = getFileResponse.data.GetFileS3;
      setUploadedUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className={`px-4 py-2 rounded-md text-white font-medium
          ${!selectedFile || uploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">File uploaded successfully!</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View uploaded file
          </a>
        </div>
      )}
    </div>
  );
} 