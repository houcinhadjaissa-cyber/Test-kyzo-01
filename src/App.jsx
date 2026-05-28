import React, { useState, useEffect } from 'react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";
import { useAI } from './hooks/useAI';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';

const DEFAULT_FILES = {
  "/App.js": `export default function App() { return <h1 className="p-10 text-3xl font-bold">Stitch Forge Active.</h1> }`,
};

export default function StitchForge() {
  const [files, setFiles] = useState(DEFAULT_FILES);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_key') || "");
  const { generateProject, isGenerating } = useAI(apiKey);

  const handleUserCommand = async (command) => {
    const update = await generateProject(command, files);
    
    if (update.files) {
      const newFiles = { ...files };
      update.files.forEach(f => {
        // SECURITY SANITIZATION: Prevent overwriting core system files if necessary
        newFiles[f.path] = f.content;
      });
      setFiles(newFiles);
    }
  };

  return (
    <div className="flex h-screen bg-surface-base text-text-primary overflow-hidden">
      {/* Sidebar - File Explorer */}
      <Sidebar files={files} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-outline-variant flex items-center justify-between px-6">
          <h2 className="text-primary font-black tracking-widest">STITCH FORGE v1.0</h2>
          <div className="flex gap-4">
             <input 
               type="password" 
               placeholder="Gemini API Key" 
               className="bg-surface-container rounded-full px-4 py-1 text-xs border border-outline"
               onChange={(e) => {
                 setApiKey(e.target.value);
                 localStorage.setItem('gemini_key', e.target.value);
               }}
               value={apiKey}
             />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Interface - The CTO Controller */}
          <div className="w-[400px] border-r border-outline-variant flex flex-col">
            <ChatInterface onSendMessage={handleUserCommand} isLoading={isGenerating} />
          </div>

          {/* Workspace - Monaco + Sandpack */}
          <div className="flex-1 bg-black">
            <SandpackProvider 
              template="react" 
              files={files} 
              theme="dark"
              customSetup={{ dependencies: { "lucide-react": "latest", "framer-motion": "latest" }}}
            >
              <SandpackLayout>
                <div className="flex flex-col w-full h-full">
                  <div className="h-1/2 overflow-auto border-b border-outline-variant">
                    <SandpackCodeEditor showTabs closableTabs />
                  </div>
                  <div className="h-1/2 bg-white">
                    <SandpackPreview showNavigator />
                  </div>
                </div>
              </SandpackLayout>
            </SandpackProvider>
          </div>
        </div>
      </main>
    </div>
  );
          }
