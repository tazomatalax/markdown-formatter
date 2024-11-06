import React, { useState, useCallback } from 'react';
import { marked } from 'marked';
import { ClipboardCheck, ClipboardCopy, FileEdit, Eye, RotateCcw } from 'lucide-react';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMarkdown(text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      const formattedHtml = marked(markdown, { breaks: true });
      
      // Create a Blob containing the HTML content
      const blob = new Blob([formattedHtml], { type: 'text/html' });
      
      // Create ClipboardItem with both HTML and plain text formats
      const data = new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([document.createElement('div').innerHTML = formattedHtml].map(el => 
          el.textContent || el.innerText || ''), { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([data]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      // Fallback for browsers that don't support clipboard.write()
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = marked(markdown, { breaks: true });
        await navigator.clipboard.writeText(tempDiv.textContent || tempDiv.innerText || '');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed', fallbackErr);
      }
    }
  }, [markdown]);

  const resetContent = useCallback(() => {
    setMarkdown('');
    setShowPreview(false);
  }, []);

  const formattedHtml = marked(markdown, { breaks: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Markdown Formatter</h1>
          <p className="text-gray-600">Paste, format, and copy your markdown content</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {showPreview ? (
                  <>
                    <FileEdit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </>
                )}
              </button>
              <button
                onClick={resetContent}
                className="flex items-center px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePaste}
                className="flex items-center px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <ClipboardCopy className="w-4 h-4 mr-2" />
                Paste
              </button>
              <button
                onClick={handleCopy}
                disabled={!markdown}
                className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                  copySuccess
                    ? 'bg-green-600 text-white'
                    : markdown
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="p-4">
            {showPreview ? (
              <div
                className="prose max-w-none min-h-[300px] p-4"
                dangerouslySetInnerHTML={{ __html: formattedHtml }}
              />
            ) : (
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Paste your markdown here..."
                className="w-full min-h-[300px] p-4 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Paste your markdown and format it for your favorite note-taking app</p>
        </footer>
      </div>
    </div>
  );
}

export default App;