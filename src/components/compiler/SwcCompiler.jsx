import "./swcCompiler.css";
import { useEffect, useState, useRef } from "react";
import initSwc, { transformSync } from "@swc/wasm-web";

const SwcCompiler = ({ fileContent }) => {
  const [initialized, setInitialized] = useState(false);
  const iframeRef = useRef(null);

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
          syntax: "ecmascript",
          jsx: true,
        },
        target: "es6",
        transform: {
          react: {
            pragma: "h",
            pragmaFrag: "Fragment",
            throwIfNamespace: true,
            development: false,
            useBuiltins: false,
          },
        },
      },
      module: {
        type: "es6",
      },
      sourceMaps: true,
    };
    const result = transformSync(fileContent.content, options);
    updateIframe(result.code);
  }

  function updateIframe(compiledCode) {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDocument =
      iframe.contentDocument || iframe.contentWindow.document;
    const importMap = {
      imports: {
        react: "https://cdn.skypack.dev/react@17",
        "react-dom": "https://cdn.skypack.dev/react-dom@17",
        preact: "https://cdn.skypack.dev/preact",
        "preact/hooks": "https://cdn.skypack.dev/preact/hooks",
        "preact/compat": "https://cdn.skypack.dev/preact/compat", // If using React compatibility
        "preact/fragment": "https://cdn.skypack.dev/preact/fragment", // Correct import for Preact's Fragment
      },
    };

    // Close the document before writing to ensure the import map is processed first
    iframeDocument.open();
    iframeDocument.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Compiled Code Preview</title>
        <script type="importmap">${JSON.stringify(importMap)}</script>
        <script src="https://cdn.tailwindcss.com" defer></script>
      </head>
      <body>
        <div id="root"></div>
        <!-- Module Script -->
        <script type="module">
          import { h, render, Fragment } from 'preact';
          ${compiledCode}
          // Ensure your compiled code exports a function or component to render
          // For example, if your compiled code exports a component named App
          render(h(PreactCounter, null), document.getElementById('root'));
        </script>
      </body>
      </html>
    `);
    iframeDocument.close();
  }

  return (
    <div className="compiler">
      <button className="compiler-btn" onClick={compile}>
        Compile Current File
      </button>
      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "500px", border: "none" }}
      />
    </div>
  );
};

export default SwcCompiler;
