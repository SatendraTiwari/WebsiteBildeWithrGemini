"use client"
import React, { useContext, useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import SandpackPreviewClient from './SandpackPreviewClient';
import Loader from './Loader';

const APP_FILE_CANDIDATES = [
  '/App.js',
  '/App.jsx',
  '/App.tsx',
  '/App.ts',
];

const SRC_APP_FILE_CANDIDATES = [
  '/src/App.js',
  '/src/App.jsx',
  '/src/App.tsx',
  '/src/App.ts',
];

const ENTRY_FILE_CANDIDATES = [
  '/index.js',
  '/index.jsx',
  '/index.tsx',
  '/index.ts',
];

const CSS_FILE_CANDIDATES = [
  '/src/index.css',
  '/src/styles.css',
  '/src/App.css',
  '/styles.css',
  '/App.css',
];

const ensureLeadingSlash = (filePath = '') =>
  filePath.startsWith('/') ? filePath : `/${filePath}`;

const normalizeFilesForPreview = (inputFiles) => {
  const files = {};

  Object.entries(inputFiles || {}).forEach(([rawPath, fileValue]) => {
    const normalizedPath = ensureLeadingSlash(rawPath);
    files[normalizedPath] =
      typeof fileValue === 'string' ? { code: fileValue } : fileValue;
  });

  const rootAppFile = APP_FILE_CANDIDATES.find((path) => files[path]);
  const hasRootApp = Boolean(rootAppFile);
  const hasEntryFile = ENTRY_FILE_CANDIDATES.some((path) => files[path]);
  const srcAppFile = SRC_APP_FILE_CANDIDATES.find((path) => files[path]);
  const cssFile = CSS_FILE_CANDIDATES.find((path) => files[path]);
  const rootAppCode =
    rootAppFile && typeof files[rootAppFile]?.code === 'string'
      ? files[rootAppFile].code
      : '';
  const rootAppLooksTemplate =
    /hello world/i.test(rootAppCode) && rootAppCode.length < 220;

  if ((!hasRootApp && srcAppFile) || (rootAppLooksTemplate && srcAppFile)) {
    files['/App.js'] = {
      code: `export { default } from ".${srcAppFile.replace(/\.[^/.]+$/, '')}";\n`,
    };
  }

  if (!hasEntryFile && srcAppFile) {
    const appImportPath = `.${srcAppFile.replace(/\.[^/.]+$/, '')}`;
    const cssImportLine = cssFile ? `import ".${cssFile}";\n` : "";
    files['/index.js'] = {
      code: `import React, { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\n${cssImportLine}import App from "${appImportPath}";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n`,
    };
  }

  return files;
};

const CodeView = () => {
  const {id} = useParams();
  const [activeTab,setActiveTab] = useState('code');

  const [files,setFiles] = useState(Lookup.DEFAULT_FILE);
  const {messages = [], setMessages} = useContext(MessagesContext)
  const UpdateFiles = useMutation(api.workspace.UpdateFiles)

  const convex = useConvex();

  const [loading,setLoading] = useState(false);

  useEffect(() => {
    id && GetFiles();
  },[id])

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace,{
      workspaceId : id
    });

    const normalizedFiles = normalizeFilesForPreview(result?.fileData);
    const mergeFiles = {...Lookup.DEFAULT_FILE,...normalizedFiles};
    setFiles(mergeFiles);
    setLoading(false)
  }


  useEffect(() => {
      if (Array.isArray(messages) && messages.length > 0) {
        const role = messages[messages?.length - 1].role;
  
        if (role == 'user') {
          GenerateCode();
        }
      }
    }, [messages])

  const GenerateCode = async () => {
    setLoading(true);
    const PROMPT = messages[messages?.length - 1]?.content +" " + Prompt.CODE_GEN_PROMPT;
    try {
      const result = await axios.post(`/api/gen-ai-code`, {
        prompt: PROMPT,
      });
      const aiResp = result.data;
      if (!aiResp?.files) {
        throw new Error(aiResp?.error || "No files returned from AI");
      }

      const normalizedFiles = normalizeFilesForPreview(aiResp?.files);
      const mergeFiles = {...Lookup.DEFAULT_FILE,...normalizedFiles};

      setFiles(mergeFiles);
      await UpdateFiles({
        workspaceId: id,
        fileData : normalizedFiles
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to generate code.";
      console.error("Code generation failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className=' relative'>
      <div className='bg-[#181818] w-full p-2 border'>
        <div className='flex items-center flex-wrap shrink-0 bg-black p-1 justify-center w-[150px] gap-4 rounded-full'>
          <h2 
          onClick={() => setActiveTab('code')}
          className={`text-sm cursor-pointer ${activeTab === 'code' && 'text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full '}`}>Code</h2>
          <h2
          onClick={() => setActiveTab('preview')} 
          className={`text-sm cursor-pointer ${activeTab === 'preview' && 'text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full'}`}>Preview</h2>
        </div>
      </div>
      <SandpackProvider 
      files={files}
      template="react" theme={'dark'}
      customSetup={{
        dependencies: {
          ...Lookup.DEPENDANCY
        }
      }}
      options={{
        externalResources:['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4']
      }}
      >
        <SandpackLayout>
        { activeTab == 'code' ? (
          <>
          <SandpackFileExplorer style={{height : '84vh'}}/>
          <SandpackCodeEditor style={{height : '84vh'}} />
          </>
          ) : (
            <SandpackPreviewClient />
          )}
        </SandpackLayout>
      </SandpackProvider>

      {loading && <div className='p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
        <Loader />
      </div>}
    </div>
  )
}

export default CodeView
