import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import { GraphQLResult } from "@aws-amplify/api";

interface FileItem {
  key: string;
  url: string;
  lastModified: string;
  size: number;
}

interface ListFilesResponse {
  ListFilesS3: {
    files: FileItem[];
  };
}

const client = generateClient<Schema>();

export default function FileList() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.key.split("/").pop() || "downloaded-file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download file:", err);
      alert("Download failed. Please try again.");
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = (await client.graphql({
        query: `
          query ListFilesS3($prefix: String) {
            ListFilesS3(prefix: $prefix) {
              files
            }
          }
        `,
        variables: {
          prefix: "amp-app/",
        },
      })) as GraphQLResult<ListFilesResponse>;

      if (response.data) {
        let fetchedFiles = response.data.ListFilesS3.files;

        if (typeof fetchedFiles === "string") {
          try {
            fetchedFiles = JSON.parse(fetchedFiles);
          } catch (parseErr) {
            console.error("Failed to parse files string:", parseErr);
            setError("Invalid files data format.");
            setFiles([]);
            setLoading(false);
            return;
          }
        }

        const sortedFiles = fetchedFiles.toSorted(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
        );
        setFiles(sortedFiles);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to load files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>;
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No files found. Upload some files to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={fetchFiles}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          aria-label="Refresh file list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 animate-spin-slow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582M20 20v-5h-.581M4.582 9A7.002 7.002 0 0112 5v0a7 7 0 017 7v0a7.002 7.002 0 01-6.418 6.978"
            />
          </svg>
          Refresh
        </button>
        <button
          onClick={() => setIsGridView(!isGridView)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isGridView ? "Switch to List View" : "Switch to Grid View"}
        </button>
      </div>

      {/* File Cards */}
      <div
        className={
          isGridView
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-4"
        }
      >
        {files.map((file) => (
          <div
            key={file.key}
            className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${
              isGridView ? "flex flex-col" : "flex items-center space-x-4"
            }`}
          >
            {/* Thumbnail */}
            <div
              className={
                isGridView
                  ? "w-full h-40 mb-2 cursor-pointer"
                  : "w-16 h-16 flex-shrink-0 cursor-pointer"
              }
              onClick={() => setPreviewImage(file.url)}
            >
              <img
                src={file.url}
                alt={file.key.split("/").pop()}
                className="object-cover w-full h-full rounded-md border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            </div>

            {/* File Info */}
            <div className={isGridView ? "flex-1" : "flex-1 min-w-0"}>
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {file.key.split("/").pop()}
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                <span>{formatFileSize(file.size)}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(file.lastModified)}</span>
              </div>
            </div>

            {/* Download Button */}
            <div className={isGridView ? "mt-3" : "ml-4 flex-shrink-0"}>
              <button
                onClick={() => handleDownload(file)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 m-4 text-white text-2xl font-bold"
              onClick={() => setPreviewImage(null)}
            >
              &times;
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="rounded-lg max-w-full max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
