/**
 * Automatically triggers a refinement loop if the Sandpack preview crashes.
 */
export const autoFixLogic = (errorLog, currentFiles, aiHook) => {
  const prompt = `
    CRITICAL ERROR DETECTED IN PREVIEW:
    ${errorLog}

    Identify the file causing this error and provide a fixed version. 
    Maintain all other functionality.
  `;
  
  return aiHook(prompt, currentFiles);
};
