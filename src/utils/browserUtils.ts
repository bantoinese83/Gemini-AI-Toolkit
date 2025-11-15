/**
 * @file Browser-compatible utility functions for client-side usage.
 * These utilities use browser APIs instead of Node.js file system APIs.
 */

/**
 * Converts base64 image data to a Blob URL for browser download or display.
 * 
 * @example
 * ```typescript
 * const imageBase64 = await generateImage('A robot');
 * const url = base64ImageToBlobUrl(imageBase64, 'image/png');
 * // Use url for <img src={url}> or download
 * ```
 * @throws {Error} If base64 string is invalid or decoding fails
 */
export function base64ImageToBlobUrl(imageBase64: string, mimeType: string = 'image/png'): string {
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    throw new Error('base64ImageToBlobUrl: imageBase64 must be a non-empty string');
  }
  
  // Normalize base64 (remove whitespace)
  const normalized = imageBase64.replace(/\s/g, '');
  
  if (normalized.length === 0) {
    throw new Error('base64ImageToBlobUrl: imageBase64 cannot be empty');
  }
  
  // Validate base64 format
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(normalized)) {
    throw new Error('base64ImageToBlobUrl: Invalid base64 string format');
  }
  
  // Validate size limit (20MB base64 ≈ 15MB decoded)
  const MAX_BASE64_SIZE = 20_000_000;
  if (normalized.length > MAX_BASE64_SIZE) {
    throw new Error(`base64ImageToBlobUrl: Base64 string exceeds maximum size of ${MAX_BASE64_SIZE} characters`);
  }
  
  try {
    const byteCharacters = atob(normalized);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw new Error(`base64ImageToBlobUrl: Failed to decode base64 string: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Converts base64 audio data to a Blob URL for browser playback or download.
 * 
 * @example
 * ```typescript
 * const audioBase64 = await generateSpeech('Hello!');
 * const url = base64AudioToBlobUrl(audioBase64, 'audio/wav');
 * // Use url for <audio src={url}> or download
 * ```
 * @throws {Error} If base64 string is invalid or decoding fails
 */
export function base64AudioToBlobUrl(audioBase64: string, mimeType: string = 'audio/wav'): string {
  if (!audioBase64 || typeof audioBase64 !== 'string') {
    throw new Error('base64AudioToBlobUrl: audioBase64 must be a non-empty string');
  }
  
  // Normalize base64 (remove whitespace)
  const normalized = audioBase64.replace(/\s/g, '');
  
  if (normalized.length === 0) {
    throw new Error('base64AudioToBlobUrl: audioBase64 cannot be empty');
  }
  
  // Validate base64 format
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(normalized)) {
    throw new Error('base64AudioToBlobUrl: Invalid base64 string format');
  }
  
  // Validate size limit
  const MAX_BASE64_SIZE = 20_000_000;
  if (normalized.length > MAX_BASE64_SIZE) {
    throw new Error(`base64AudioToBlobUrl: Base64 string exceeds maximum size of ${MAX_BASE64_SIZE} characters`);
  }
  
  try {
    const byteCharacters = atob(normalized);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw new Error(`base64AudioToBlobUrl: Failed to decode base64 string: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Converts a File or Blob to base64 string (browser-compatible).
 * 
 * @example
 * ```typescript
 * const fileInput = document.querySelector('input[type="file"]');
 * const file = fileInput.files[0];
 * const base64 = await fileToBase64Browser(file);
 * ```
 * @throws {Error} If file is invalid, too large, or read fails
 */
export function fileToBase64Browser(file: File | Blob | null | undefined): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate input
    if (!file) {
      reject(new Error('fileToBase64Browser: File or Blob is required'));
      return;
    }
    
    if (!(file instanceof File) && !(file instanceof Blob)) {
      reject(new Error('fileToBase64Browser: Input must be a File or Blob object'));
      return;
    }
    
    // Validate file size (100MB limit)
    const MAX_FILE_SIZE = 100_000_000;
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`fileToBase64Browser: File size (${file.size} bytes) exceeds maximum of ${MAX_FILE_SIZE} bytes`));
      return;
    }
    
    if (file.size === 0) {
      reject(new Error('fileToBase64Browser: File is empty'));
      return;
    }
    
    // Check if FileReader is available
    if (typeof FileReader === 'undefined') {
      reject(new Error('fileToBase64Browser: FileReader API is not available in this environment'));
      return;
    }
    
    const reader = new FileReader();
    
    // Set up error handler
    reader.onerror = (event) => {
      const error = event.target?.error;
      reject(new Error(`fileToBase64Browser: Failed to read file: ${error?.message || 'Unknown error'}`));
    };
    
    // Set up success handler
    reader.onload = () => {
      try {
        if (!reader.result) {
          reject(new Error('fileToBase64Browser: FileReader returned empty result'));
          return;
        }
        
        const result = reader.result as string;
        
        // Validate result format
        if (typeof result !== 'string') {
          reject(new Error('fileToBase64Browser: FileReader result is not a string'));
          return;
        }
        
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        
        if (!base64 || base64.length === 0) {
          reject(new Error('fileToBase64Browser: Extracted base64 string is empty'));
          return;
        }
        
        resolve(base64);
      } catch (error) {
        reject(new Error(`fileToBase64Browser: Error processing result: ${error instanceof Error ? error.message : String(error)}`));
      }
    };
    
    // Start reading
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      reject(new Error(`fileToBase64Browser: Failed to start reading file: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}

/**
 * Downloads a base64 image in the browser.
 * 
 * @example
 * ```typescript
 * const imageBase64 = await generateImage('A robot');
 * downloadBase64Image(imageBase64, 'robot.png', 'image/png');
 * ```
 * @throws {Error} If browser APIs are unavailable or operation fails
 */
export function downloadBase64Image(
  imageBase64: string,
  filename: string,
  mimeType: string = 'image/png'
): void {
  if (typeof document === 'undefined') {
    throw new Error('downloadBase64Image is only available in browser environments');
  }
  
  if (!filename || typeof filename !== 'string' || filename.trim().length === 0) {
    throw new Error('downloadBase64Image: filename must be a non-empty string');
  }
  
  let url: string | null = null;
  
  try {
    url = base64ImageToBlobUrl(imageBase64, mimeType);
    
    // Validate URL was created
    if (!url) {
      throw new Error('downloadBase64Image: Failed to create Blob URL');
    }
    
    // Ensure document.body exists
    if (!document.body) {
      URL.revokeObjectURL(url);
      throw new Error('downloadBase64Image: document.body is not available');
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none'; // Hide the link
    
    // Append, click, and remove
    document.body.appendChild(link);
    
    try {
      link.click();
    } catch (clickError) {
      // Clean up even if click fails
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      throw new Error(`downloadBase64Image: Failed to trigger download: ${clickError instanceof Error ? clickError.message : String(clickError)}`);
    }
    
    // Clean up
    document.body.removeChild(link);
    
    // Revoke URL after a short delay to ensure download starts
    setTimeout(() => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    }, 100);
  } catch (error) {
    // Ensure URL is revoked on error
    if (url) {
      URL.revokeObjectURL(url);
    }
    throw error;
  }
}

/**
 * Downloads a base64 audio file in the browser.
 * 
 * @example
 * ```typescript
 * const audioBase64 = await generateSpeech('Hello!');
 * downloadBase64Audio(audioBase64, 'hello.wav', 'audio/wav');
 * ```
 * @throws {Error} If browser APIs are unavailable or operation fails
 */
export function downloadBase64Audio(
  audioBase64: string,
  filename: string,
  mimeType: string = 'audio/wav'
): void {
  if (typeof document === 'undefined') {
    throw new Error('downloadBase64Audio is only available in browser environments');
  }
  
  if (!filename || typeof filename !== 'string' || filename.trim().length === 0) {
    throw new Error('downloadBase64Audio: filename must be a non-empty string');
  }
  
  let url: string | null = null;
  
  try {
    url = base64AudioToBlobUrl(audioBase64, mimeType);
    
    // Validate URL was created
    if (!url) {
      throw new Error('downloadBase64Audio: Failed to create Blob URL');
    }
    
    // Ensure document.body exists
    if (!document.body) {
      URL.revokeObjectURL(url);
      throw new Error('downloadBase64Audio: document.body is not available');
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none'; // Hide the link
    
    // Append, click, and remove
    document.body.appendChild(link);
    
    try {
      link.click();
    } catch (clickError) {
      // Clean up even if click fails
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      throw new Error(`downloadBase64Audio: Failed to trigger download: ${clickError instanceof Error ? clickError.message : String(clickError)}`);
    }
    
    // Clean up
    document.body.removeChild(link);
    
    // Revoke URL after a short delay to ensure download starts
    setTimeout(() => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    }, 100);
  } catch (error) {
    // Ensure URL is revoked on error
    if (url) {
      URL.revokeObjectURL(url);
    }
    throw error;
  }
}

