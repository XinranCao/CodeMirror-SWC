import "./swcCompiler.css";
import { useEffect, useState } from "react";
import initSwc, { transformSync } from "@swc/wasm-web";

const SwcCompiler = ({ fileContent }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function importAndRunSwcOnMount() {
      await initSwc();
      setInitialized(true);
    }
    importAndRunSwcOnMount();
  }, []);

  function compile() {
    if (!initialized) {
      return;
    }
    const options = {
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: true,
        },
        target: "es6",
        transform: {
          react: {
            runtime: "automatic",
            pragma: "Preact.createElement",
            pragmaFrag: "Preact.Fragment",
          },
        },
      },
      module: {
        type: "es6",
      },
      sourceMaps: true,
    };
    const result = transformSync(fileContent.content, options);
    console.log(result);
  }

  return (
    <div className="compiler">
      <button className="compiler-btn" onClick={compile}>
        Compile Current File
      </button>
    </div>
  );
};

export default SwcCompiler;
