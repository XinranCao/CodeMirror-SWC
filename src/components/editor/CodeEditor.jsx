import "./codeEditor.css";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";

const Editor = ({ file, onUpdateFile }) => {
  return (
    <CodeMirror
      value={file.content}
      height="100%"
      className="code-mirror"
      theme={vscodeDarkInit({
        settings: {
          caret: "#c6c6c6",
          fontFamily: "monospace",
        },
      })}
      extensions={[javascript({ jsx: true })]}
      onChange={(value) => onUpdateFile(value)}
    />
  );
};

export default Editor;
