import React from 'react';

const FilePreview = ({ file, onDownload, compact = false }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'ri-image-line';
    if (type === 'application/pdf') return 'ri-file-pdf-line';
    if (type.includes('word') || type.includes('document')) return 'ri-file-word-line';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'ri-file-excel-line';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'ri-file-ppt-line';
    if (type.startsWith('text/')) return 'ri-file-text-line';
    if (type.startsWith('audio/')) return 'ri-file-music-line';
    if (type.startsWith('video/')) return 'ri-file-video-line';
    return 'ri-file-line';
  };

  const getFileColor = (type) => {
    if (type.startsWith('image/')) return '#10b981';
    if (type === 'application/pdf') return '#dc2626';
    if (type.includes('word') || type.includes('document')) return '#2563eb';
    if (type.includes('excel') || type.includes('spreadsheet')) return '#059669';
    if (type.includes('powerpoint') || type.includes('presentation')) return '#dc2626';
    if (type.startsWith('text/')) return '#6b7280';
    if (type.startsWith('audio/')) return '#8b5cf6';
    if (type.startsWith('video/')) return '#f59e0b';
    return '#6b7280';
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(file);
    } else if (file.url) {
      // Default download behavior
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isImage = file.type?.startsWith('image/');

  if (compact) {
    return (
      <div className="file-preview compact" onClick={handleDownload}>
        <div className="file-icon-small" style={{ color: getFileColor(file.type) }}>
          <i className={getFileIcon(file.type)}></i>
        </div>
        <div className="file-info-small">
          <span className="file-name-small">{file.name}</span>
          <span className="file-size-small">{formatFileSize(file.size)}</span>
        </div>
        <div className="download-icon">
          <i className="ri-download-line"></i>
        </div>

        <style>{`
          .file-preview.compact {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background: #f8fafc;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: background 0.2s;
            max-width: 200px;
          }

          .file-preview.compact:hover {
            background: #f1f5f9;
          }

          .file-icon-small {
            font-size: 1.2rem;
            flex-shrink: 0;
          }

          .file-info-small {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
          }

          .file-name-small {
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--text-dark);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .file-size-small {
            font-size: 0.7rem;
            color: var(--text-light);
          }

          .download-icon {
            font-size: 0.9rem;
            color: var(--text-light);
            flex-shrink: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="file-preview">
      {/* Image Preview */}
      {isImage && file.url && (
        <div className="image-preview">
          <img 
            src={file.url} 
            alt={file.name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="image-error" style={{ display: 'none' }}>
            <i className="ri-image-line"></i>
            <span>Không thể tải hình ảnh</span>
          </div>
        </div>
      )}

      {/* File Info */}
      <div className="file-info">
        <div className="file-header">
          <div className="file-icon" style={{ color: getFileColor(file.type) }}>
            <i className={getFileIcon(file.type)}></i>
          </div>
          <div className="file-details">
            <div className="file-name" title={file.name}>
              {file.name}
            </div>
            <div className="file-meta">
              <span className="file-size">{formatFileSize(file.size)}</span>
              {file.type && (
                <>
                  <span className="separator">•</span>
                  <span className="file-type">
                    {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="file-actions">
          <button 
            className="action-btn download-btn"
            onClick={handleDownload}
            title="Tải xuống"
          >
            <i className="ri-download-line"></i>
          </button>
          {file.url && (
            <button 
              className="action-btn view-btn"
              onClick={() => window.open(file.url, '_blank')}
              title="Xem file"
            >
              <i className="ri-external-link-line"></i>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .file-preview {
          display: flex;
          flex-direction: column;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
          background: white;
          max-width: 300px;
        }

        .image-preview {
          position: relative;
        }

        .image-preview img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .image-error {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 200px;
          background: #f9fafb;
          color: var(--text-light);
          flex-direction: column;
        }

        .image-error i {
          font-size: 2rem;
        }

        .file-info {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .file-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
        }

        .file-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .file-details {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-weight: 500;
          color: var(--text-dark);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }

        .file-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .separator {
          opacity: 0.5;
        }

        .file-actions {
          display: flex;
          gap: 0.25rem;
          flex-shrink: 0;
        }

        .action-btn {
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .action-btn:hover {
          background: #f3f4f6;
          color: var(--text-dark);
        }

        .download-btn:hover {
          color: var(--primary-color);
        }

        .view-btn:hover {
          color: var(--success-color);
        }

        @media (max-width: 768px) {
          .file-preview {
            max-width: 250px;
          }

          .image-preview img,
          .image-error {
            height: 150px;
          }

          .file-info {
            padding: 0.75rem;
            gap: 0.75rem;
          }

          .file-name {
            font-size: 0.85rem;
          }

          .file-meta {
            font-size: 0.7rem;
          }

          .action-btn {
            padding: 0.4rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FilePreview;
