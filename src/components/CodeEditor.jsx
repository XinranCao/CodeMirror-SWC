import "./codeEditor.css";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";

const Editor = ({ file, onUpdateFile }) => {
  const handleEditorChange = (editor, data, value) => {
    onUpdateFile(value);
  };
  return (
    <CodeMirror
      value={file.content}
      style={{ width: "100%" }}
      height="100%"
      className="code-mirror"
      theme={vscodeDarkInit({
        settings: {
          caret: "#c6c6c6",
          fontFamily: "monospace",
        },
      })}
      extensions={[javascript({ jsx: true })]}
      onChange={handleEditorChange}
    />
  );
};

export default Editor;
