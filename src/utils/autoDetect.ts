/**
 * @file Auto-detection utilities to make the toolkit more dynamic and easier to use.
 * Automatically detects MIME types, file types, aspect ratios, and suggests optimal models.
 */

/**
 * Detects MIME type from file extension or path.
 * 
 * @param filePath - File path, filename, or extension
 * @returns Detected MIME type or 'application/octet-stream' if unknown
 * 
 * @example
 * ```typescript
 * detectMimeType('image.png') // 'image/png'
 * detectMimeType('.jpg') // 'image/jpeg'
 * detectMimeType('document.pdf') // 'application/pdf'
 * ```
 */
export function detectMimeType(filePath: string): string {
  if (!filePath || typeof filePath !== 'string') {
    return 'application/octet-stream';
  }

  // Extract extension (handle both .ext and filename.ext)
  const extension = filePath.includes('.')
    ? filePath.split('.').pop()?.toLowerCase() || ''
    : filePath.toLowerCase().replace(/^\./, '');

  // Comprehensive MIME type mapping
  const mimeTypes: Record<string, string> = {
    // Images
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    tiff: 'image/tiff',
    tif: 'image/tiff',
    heic: 'image/heic',
    heif: 'image/heif',
    avif: 'image/avif',
    
    // Videos
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    flv: 'video/x-flv',
    wmv: 'video/x-ms-wmv',
    m4v: 'video/x-m4v',
    '3gp': 'video/3gpp',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    aac: 'audio/aac',
    flac: 'audio/flac',
    m4a: 'audio/mp4',
    wma: 'audio/x-ms-wma',
    opus: 'audio/opus',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',
    rtf: 'application/rtf',
    
    // Code
    js: 'text/javascript',
    ts: 'text/typescript',
    json: 'application/json',
    xml: 'application/xml',
    html: 'text/html',
    css: 'text/css',
    md: 'text/markdown',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    
    // Archives
    zip: 'application/zip',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}

/**
 * Detects if a file is an image based on MIME type or extension.
 */
export function isImage(filePath: string): boolean {
  const mimeType = detectMimeType(filePath);
  return mimeType.startsWith('image/');
}

/**
 * Detects if a file is a video based on MIME type or extension.
 */
export function isVideo(filePath: string): boolean {
  const mimeType = detectMimeType(filePath);
  return mimeType.startsWith('video/');
}

/**
 * Detects if a file is an audio file based on MIME type or extension.
 */
export function isAudio(filePath: string): boolean {
  const mimeType = detectMimeType(filePath);
  return mimeType.startsWith('audio/');
}

/**
 * Detects if a file is a document (PDF, Word, etc.) based on MIME type or extension.
 */
export function isDocument(filePath: string): boolean {
  const mimeType = detectMimeType(filePath);
  return mimeType === 'application/pdf' ||
         mimeType.includes('wordprocessingml') ||
         mimeType.includes('spreadsheetml') ||
         mimeType.includes('presentationml') ||
         mimeType === 'application/msword' ||
         mimeType === 'application/vnd.ms-excel' ||
         mimeType === 'application/vnd.ms-powerpoint';
}

/**
 * Suggests optimal model based on use case and file types.
 * 
 * @param useCase - The intended use case
 * @param hasImage - Whether the request includes images
 * @param hasVideo - Whether the request includes videos
 * @param hasAudio - Whether the request includes audio
 * @returns Suggested model name
 * 
 * @example
 * ```typescript
 * suggestModel('text-generation') // 'gemini-2.5-flash'
 * suggestModel('image-analysis', true) // 'gemini-2.5-flash-image'
 * suggestModel('complex-reasoning') // 'gemini-2.5-pro'
 * ```
 */
export function suggestModel(
  useCase: 'text-generation' | 'image-analysis' | 'video-analysis' | 'complex-reasoning' | 'chat' | 'speech',
  hasImage: boolean = false,
  hasVideo: boolean = false,
  hasAudio: boolean = false
): string {
  switch (useCase) {
    case 'text-generation':
      return 'gemini-2.5-flash';
    
    case 'complex-reasoning':
      return 'gemini-2.5-pro';
    
    case 'image-analysis':
      return 'gemini-2.5-flash-image';
    
    case 'video-analysis':
      return 'gemini-2.5-flash-image'; // Video analysis uses image model
    
    case 'chat':
      return hasImage || hasVideo ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
    
    case 'speech':
      return 'gemini-2.5-flash-preview-tts';
    
    default:
      return 'gemini-2.5-flash';
  }
}

/**
 * Detects aspect ratio from image dimensions.
 * 
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns Detected aspect ratio
 * 
 * @example
 * ```typescript
 * detectAspectRatio(1920, 1080) // '16:9'
 * detectAspectRatio(1080, 1080) // '1:1'
 * detectAspectRatio(1080, 1920) // '9:16'
 * ```
 */
export function detectAspectRatio(width: number, height: number): '1:1' | '16:9' | '9:16' | '4:3' | '3:4' {
  if (width <= 0 || height <= 0) {
    return '1:1'; // Default
  }

  const ratio = width / height;
  const tolerance = 0.05; // 5% tolerance

  // 1:1 (square)
  if (Math.abs(ratio - 1.0) < tolerance) {
    return '1:1';
  }

  // 16:9 (landscape)
  if (Math.abs(ratio - 16/9) < tolerance) {
    return '16:9';
  }

  // 9:16 (portrait)
  if (Math.abs(ratio - 9/16) < tolerance) {
    return '9:16';
  }

  // 4:3 (standard)
  if (Math.abs(ratio - 4/3) < tolerance) {
    return '4:3';
  }

  // 3:4 (portrait standard)
  if (Math.abs(ratio - 3/4) < tolerance) {
    return '3:4';
  }

  // Default to closest match
  if (ratio > 1) {
    // Landscape - default to 16:9
    return '16:9';
  } else {
    // Portrait - default to 9:16
    return '9:16';
  }
}

/**
 * Detects video aspect ratio from dimensions.
 */
export function detectVideoAspectRatio(width: number, height: number): '16:9' | '9:16' {
  if (width <= 0 || height <= 0) {
    return '16:9'; // Default
  }

  const ratio = width / height;
  const tolerance = 0.05;

  // 16:9 (landscape)
  if (Math.abs(ratio - 16/9) < tolerance) {
    return '16:9';
  }

  // 9:16 (portrait)
  if (Math.abs(ratio - 9/16) < tolerance) {
    return '9:16';
  }

  // Default to landscape
  return '16:9';
}

/**
 * Extracts file name from path (handles both Node.js and browser paths).
 */
export function extractFileName(filePath: string | File | Blob): string {
  if (typeof filePath === 'string') {
    // Node.js path
    const parts = filePath.split(/[/\\]/);
    return parts[parts.length - 1] || filePath;
  } else if (filePath instanceof File) {
    return filePath.name;
  } else if (filePath instanceof Blob) {
    return 'blob';
  }
  return 'unknown';
}

/**
 * Detects if content is base64 encoded.
 */
export function isBase64(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }
  
  // Remove data URL prefix if present
  const base64 = content.includes(',') ? content.split(',')[1] : content;
  
  // Check if it's valid base64
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(base64.replace(/\s/g, ''));
}

/**
 * Detects content type from base64 data URL.
 */
export function detectMimeTypeFromDataUrl(dataUrl: string): string | null {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return null;
  }

  const match = dataUrl.match(/^data:([^;]+);base64,/);
  return match ? match[1] : null;
}

