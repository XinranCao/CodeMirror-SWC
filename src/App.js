import "./App.css";
import { useState } from "react";
import CodeEditor from "./components/editor/CodeEditor";
import FileExplorer from "./components/editor/FileExplorer";
import Preview from "./components/preview/Preview";
import { Mosaic, MosaicWindow } from "react-mosaic-component";

const initialFiles = [
  {
    name: "PreactCounter.jsx",
    type: "file",
    content: 'console.log("Start with a simple Preact component");',
  },
  {
    name: "app.js",
    type: "file",
    content: 'console.log("Hello from app.js");',
  },
];

const MY_MOSAIC_IDs = {
  explorer: "File Explorer",
  editor: "Code Editor",
  preview: "Preview",
};

function App() {
  const [files, setFiles] = useState(initialFiles);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const initialLayout = {
    direction: "row",
    first: MY_MOSAIC_IDs.explorer,
    second: {
      direction: "row",
      first: MY_MOSAIC_IDs.editor,
      second: MY_MOSAIC_IDs.preview,
      splitPercentage: 50,
    },
    splitPercentage: 20,
  };

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
      </header>
      <section className="editor">
        <Mosaic
          renderTile={(id, path) => {
            switch (id) {
              case MY_MOSAIC_IDs.explorer:
                return (
                  <MosaicWindow path={path} toolbarControls={[]} title="Files">
                    <FileExplorer
                      files={files}
                      currentFileIndex={currentFileIndex}
                      onSelectFile={handleFileSelect}
                    />
                  </MosaicWindow>
                );
              case MY_MOSAIC_IDs.editor:
                return (
                  <MosaicWindow path={path} toolbarControls={[]} title="Editor">
                    <CodeEditor
                      file={files[currentFileIndex]}
                      onUpdateFile={handleFileUpdate}
                    />
                  </MosaicWindow>
                );
              case MY_MOSAIC_IDs.preview:
                return (
                  <MosaicWindow
                    path={path}
                    toolbarControls={[]}
                    title="Preview"
                  >
                    <Preview fileContent={{ ...files[currentFileIndex] }} />
                  </MosaicWindow>
                );
              default:
                return null;
            }
          }}
          initialValue={initialLayout}
          className="mosaic-blueprint-theme"
        />
      </section>
    </div>
  );
}

export default App;
