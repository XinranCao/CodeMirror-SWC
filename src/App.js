import "./App.css";
import { useState } from "react";
import CodeEditor from "./components/editor/CodeEditor";
import FileExplorer from "./components/editor/FileExplorer";
import SwcCompiler from "./components/compiler/SwcCompiler";
import Preview from "./components/preview/Preview";

const initialFiles = [
  {
    name: "index.js",
    type: "file",
    content: 'console.log("Hello from index.js");',
  },
  {
    name: "app.js",
    type: "file",
    content: 'console.log("Hello from app.js");',
  },
];

function App() {
  const [files, setFiles] = useState(initialFiles);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const handleFileSelect = (index) => {
    setCurrentFileIndex(index);
  };

  const handleFileUpdate = (newContent) => {
    const newFiles = [...files];
    newFiles[currentFileIndex].content = newContent;
    setFiles(newFiles);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>CodeMirror + SWC WASM</h1>
        <h4>Demo of using CodeMirror and SWC WASM</h4>
      </header>
      <section className="editor">
        <div>
          <SwcCompiler fileContent={files[currentFileIndex]} />

          <FileExplorer
            files={files}
            currentFileIndex={currentFileIndex}
            onSelectFile={handleFileSelect}
          />
        </div>
        <CodeEditor
          file={files[currentFileIndex]}
          onUpdateFile={handleFileUpdate}
        />
        {/* <Preview fileContent={files[currentFileIndex]} /> */}
      </section>
    </div>
  );
}

export default App;
