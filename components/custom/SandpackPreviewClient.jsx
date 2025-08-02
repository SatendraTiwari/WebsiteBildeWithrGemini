"use client"

import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import React, { useEffect, useRef } from 'react'

const SandpackPreviewClient = () => {

  const { sandpack } = useSandpack();
  const previewRef = useRef();

  useEffect(() => {
    getSandpackClient();
  },[sandpack])

  const getSandpackClient = async () => {
    const client = previewRef.current?.getClient();
    if(client){
      const result = await client.getCodeSandboxURL();
      
      console.log(client);
    }
  }

  return (
    <SandpackPreview  style={{height : '84vh'}}/>
  )
}

export default SandpackPreviewClient