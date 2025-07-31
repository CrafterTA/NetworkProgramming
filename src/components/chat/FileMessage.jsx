import React from 'react';
import { fileService } from '../../services/api';
import './FileMessage.css';

const FileMessage = ({ file, message }) => {
  // Defensive check for file object
  if (!file) {
    console.warn('FileMessage: file prop is undefined', { message });
    return (
      <div className="file-message error">
        <p>File information not available</p>
      </div>
    );
  }

  // Handle different file object structures
  const fileData = {
    file_id: file.file_id || file.id,
    original_name: file.original_name || file.name || 'Unknown file',
    file_size: file.file_size || file.size || 0,
    mime_type: file.mime_type || file.type || 'application/octet-stream'
  };

  console.log('🔍 FileMessage received:', { file, fileData, message });

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileService.getFileDownloadUrl(fileData.file_id);
    link.download = fileData.original_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return 'ri-image-line';
    } else if (mimeType === 'application/pdf') {
      return 'ri-file-pdf-line';
    } else if (mimeType.includes('word')) {
      return 'ri-file-word-line';
    } else if (mimeType === 'text/plain') {
      return 'ri-file-text-line';
    } else {
      return 'ri-file-line';
    }
  };

  const isImage = fileData.mime_type.startsWith('image/');

  return (
    <div className="file-message">
      <div className="file-info">
        <div className="file-icon">
          <i className={getFileIcon(fileData.mime_type)}></i>
        </div>
        <div className="file-details">
          <div className="file-name">{fileData.original_name}</div>
          <div className="file-size">{formatFileSize(fileData.file_size)}</div>
        </div>
        <button 
          className="download-btn"
          onClick={handleDownload}
          title="Tải xuống"
        >
          <i className="ri-download-line"></i>
        </button>
      </div>
      
      {/* Show image preview for image files */}
      {isImage && (
        <div className="image-preview">
          <img 
            src={fileService.getFileDownloadUrl(fileData.file_id)} 
            alt={fileData.original_name}
            onClick={handleDownload}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
    </div>
  );
};

export default FileMessage;
