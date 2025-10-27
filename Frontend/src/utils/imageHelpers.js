// utils/imageHelpers.js

/**
 * Convert File/Blob to Base64 string
 * @param {File|Blob} file - Image file
 * @returns {Promise<string>} Base64 data URL
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result); // Returns: "data:image/jpeg;base64,/9j/4AAQ..."
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image before converting to Base64
 * @param {File} file - Image file
 * @param {number} maxWidth - Max width (default 800px)
 * @param {number} quality - Quality 0-1 (default 0.8)
 * @returns {Promise<string>} Compressed Base64 data URL
 */
export async function compressAndConvertToBase64(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to Base64
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Max size in MB (default 5MB)
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateImageFile(file, maxSizeMB = 5) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Use JPG, PNG, GIF, or WebP' };
  }
  
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Max ${maxSizeMB}MB` };
  }
  
  return { valid: true };
}

/**
 * Get image dimensions
 * @param {string} base64 - Base64 data URL
 * @returns {Promise<{width: number, height: number}>}
 */
export async function getImageDimensions(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64;
  });
}