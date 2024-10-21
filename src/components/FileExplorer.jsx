import "./fileExplorer.css";

const FileExplorer = ({ files, currentFileIndex, onSelectFile }) => {
  return (
    <div className="file-explorer">
      {files.map((file, index) => (
        <div
          key={index}
          className={currentFileIndex === index ? "file-active" : "file"}
          onClick={() => onSelectFile(index)}
        >
          {file.name}
        </div>
      ))}
    </div>
  );
};

export default FileExplorer;
