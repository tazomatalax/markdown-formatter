import React, { useState, useCallback, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { 
  ClipboardCheck, 
  ClipboardCopy, 
  FileEdit, 
  Eye, 
  RotateCcw, 
  Download,
  Upload,
  Settings,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  FileText,
  Sparkles
} from 'lucide-react';

interface AppSettings {
  theme: 'light' | 'dark';
  autoPreview: boolean;
  lineNumbers: boolean;
  wordWrap: boolean;
}

function App() {
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Formatter\n\nStart typing your **markdown** here or paste content from your clipboard.\n\n## Features\n- Live preview\n- Dark/Light theme\n- Export options\n- Beautiful formatting\n\n> This is a blockquote example\n\n```javascript\nconst hello = "world";\nconsole.log(hello);\n```\n\n1. Numbered lists\n2. Work perfectly\n3. Try them out!');
  const [showPreview, setShowPreview] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    autoPreview: false,
    lineNumbers: true,
    wordWrap: true
  });
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const words = markdown.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = markdown.length;
    setWordCount(words);
    setCharCount(chars);
  }, [markdown]);

  useEffect(() => {
    if (settings.autoPreview && markdown.length > 0) {
      setShowPreview(true);
    }
  }, [markdown, settings.autoPreview]);

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
      const formattedHtml = marked(markdown, { 
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false
      });
      
      const blob = new Blob([formattedHtml], { type: 'text/html' });
      const data = new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([markdown], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([data]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      try {
        await navigator.clipboard.writeText(markdown);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed', fallbackErr);
      }
    }
  }, [markdown]);

  const handleDownload = useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'document.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [markdown]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdown(content);
      };
      reader.readAsText(file);
    }
  }, []);

  const resetContent = useCallback(() => {
    setMarkdown('');
    setShowPreview(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const formattedHtml = marked(markdown, { 
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false
  });

  const isDark = settings.theme === 'dark';
  const themeClasses = isDark 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses} ${isFullscreen ? 'p-0' : 'p-4 sm:p-8'}`}>
      <div className={`${isFullscreen ? 'h-screen' : 'max-w-7xl'} mx-auto`}>
        {!isFullscreen && (
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mr-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
                  Markdown Formatter
                </h1>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-center justify-center`}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Professional markdown editing and formatting
                </p>
              </div>
            </div>
          </header>
        )}

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden ${isFullscreen ? 'h-full rounded-none' : ''} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Toolbar */}
          <div className={`flex items-center justify-between p-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b`}>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  showPreview 
                    ? `${isDark ? 'bg-gray-600 text-white' : 'bg-indigo-100 text-indigo-700'} shadow-md` 
                    : `${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 hover:bg-gray-50'}`
                }`}
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
                onClick={toggleFullscreen}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 mr-2" />
                    Exit
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Focus
                  </>
                )}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".md,.txt"
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>

              <button
                onClick={handleDownload}
                disabled={!markdown}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  markdown
                    ? `${isDark ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white`
                    : `${isDark ? 'bg-gray-700' : 'bg-gray-300'} cursor-not-allowed text-gray-500`
                }`}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>

              <button
                onClick={handlePaste}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isDark ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-lg`}
              >
                <ClipboardCopy className="w-4 h-4 mr-2" />
                Paste
              </button>

              <button
                onClick={handleCopy}
                disabled={!markdown}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 shadow-lg ${
                  copySuccess
                    ? `${isDark ? 'bg-green-700' : 'bg-green-600'} text-white`
                    : markdown
                    ? `${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`
                    : `${isDark ? 'bg-gray-700' : 'bg-gray-300'} cursor-not-allowed text-gray-500`
                }`}
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isDark ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </>
                )}
              </button>

              <button
                onClick={resetContent}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`p-4 ${isDark ? 'bg-gray-750 border-gray-600' : 'bg-gray-100 border-gray-200'} border-b`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.autoPreview}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoPreview: e.target.checked }))}
                    className="rounded"
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Auto Preview</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.lineNumbers}
                    onChange={(e) => setSettings(prev => ({ ...prev, lineNumbers: e.target.checked }))}
                    className="rounded"
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Line Numbers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.wordWrap}
                    onChange={(e) => setSettings(prev => ({ ...prev, wordWrap: e.target.checked }))}
                    className="rounded"
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Word Wrap</span>
                </label>
              </div>
            </div>
          )}

          {/* Status Bar */}
          <div className={`px-4 py-2 ${isDark ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b flex justify-between items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex space-x-4">
              <span>Words: {wordCount}</span>
              <span>Characters: {charCount}</span>
              <span>Lines: {markdown.split('\n').length}</span>
            </div>
            <div className="flex space-x-4">
              <span>{showPreview ? 'Preview Mode' : 'Edit Mode'}</span>
              <span className="capitalize">{settings.theme} Theme</span>
            </div>
          </div>

          {/* Main Content */}
          <div className={`${isFullscreen ? 'h-full' : 'min-h-[500px]'} flex`}>
            {showPreview ? (
              <div className={`flex-1 overflow-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div
                  className={`prose max-w-none p-8 ${isDark ? 'prose-invert' : ''}`}
                  dangerouslySetInnerHTML={{ __html: formattedHtml }}
                />
              </div>
            ) : (
              <div className="flex-1 relative">
                {settings.lineNumbers && (
                  <div className={`absolute left-0 top-0 bottom-0 w-12 ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'} text-xs font-mono flex flex-col items-center pt-4 border-r ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                    {markdown.split('\n').map((_, index) => (
                      <div key={index} className="leading-6 px-2">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="# Start writing your markdown here...\n\nTry some **bold text** or *italic text*\n\n## Create headings\n\n- Make lists\n- Add links\n- Include code blocks\n\n> Add blockquotes for emphasis"
                  className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none transition-all duration-200 ${
                    settings.lineNumbers ? 'pl-16' : 'pl-4'
                  } ${
                    settings.wordWrap ? '' : 'whitespace-nowrap overflow-x-auto'
                  } ${
                    isDark 
                      ? 'bg-gray-800 text-gray-100 placeholder-gray-500' 
                      : 'bg-white text-gray-900 placeholder-gray-400'
                  }`}
                  style={{ 
                    minHeight: isFullscreen ? '100%' : '500px',
                    lineHeight: '1.5'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {!isFullscreen && (
          <footer className="mt-8 text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-full ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <FileText className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Professional markdown formatting for developers and writers
              </span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;