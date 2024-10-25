import "./preview.css";
import { useEffect, useState, useRef, memo } from "react";
import initSwc, { transformSync } from "@swc/wasm-web";

const Preview = memo(({ fileContent }) => {
  const [initialized, setInitialized] = useState(false);
  const iframeRef = useRef(null);
  const lastInvocationTimeoutRef = useRef(null);

  useEffect(() => {
    async function importAndRunSwcOnMount() {
      await initSwc();
      setInitialized(true);
    }
    importAndRunSwcOnMount();
  }, []);

  useEffect(() => {
    const compile = () => {
      if (!initialized || !fileContent.content) {
        return;
      }
      try {
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
      } catch (error) {
        updateIframe(null, error);
      }
    };

    if (lastInvocationTimeoutRef.current) {
      clearTimeout(lastInvocationTimeoutRef.current);
    }
    lastInvocationTimeoutRef.current = setTimeout(compile, 1000);

    return () => {
      if (lastInvocationTimeoutRef.current) {
        clearTimeout(lastInvocationTimeoutRef.current);
      }
    };
  }, [fileContent, initialized]);

  function updateIframe(compiledCode, errorMessage) {
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
        "preact/compat": "https://cdn.skypack.dev/preact/compat",
        "preact/fragment": "https://cdn.skypack.dev/preact/fragment",
      },
    };

    iframeDocument.open();
    iframeDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Compiled Code Preview</title>
          <script type="importmap">${JSON.stringify(importMap)}</script>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="root">${
            errorMessage
              ? `<div style="color: red;">Error: ${errorMessage}</div>`
              : ""
          }</div>
          ${
            !errorMessage
              ? `<script type="module">
                  import { h, render, Fragment } from 'preact';
                  ${compiledCode}
                  render(h(PreactCounter, {count: 10}, h('div', {}, 'Hello from Preact Counter')), document.getElementById('root'));
                </script>`
              : ""
          }
        </body>
      </html>
    `);
    iframeDocument.close();
  }

  return (
    <div className="preview">
      <iframe
        title="Live Code Preview"
        ref={iframeRef}
        style={{ width: "100%", height: "500px", border: "none" }}
      />
    </div>
  );
});

export default Preview;
