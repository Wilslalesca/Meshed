import React from "react";
import { useDropzone } from "react-dropzone";

//See https://react-dropzone.js.org/#section-basic-example for reference on drag-and-drop

interface BasicProps {
  onDrop?: (files: File[]) => void;
}

const Basic: React.FC<BasicProps> = ({ onDrop }) => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name}
    </li>
  ));

  return (
    <section className="container mx-auto p-4">
      <div
        {...getRootProps({
          className: `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-muted"}`,
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag & drop files here, or click to select files</p>
        )}
      </div>

      <aside className="mt-4">
        <ul className="list-disc pl-5 text-sm">{files}</ul>
      </aside>
    </section>
  );
};

export default Basic;