import * as React from 'react';
import { UploadCloud, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface FileUploadProps {
  id?: string;
  label: string;
  accept?: string;
  maxSizeBytes?: number; // e.g. 5 * 1024 * 1024 = 5MB
  allowedTypesLabel?: string; // e.g. "PNG, JPEG, WebP or PDF"
  helperText?: string;
  errorMessage?: string;
  isRequired?: boolean;
  disabled?: boolean;
  value?: File | null;
  onChange?: (file: File | null) => void;
  progress?: number; // 0 to 100
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  accept = 'image/jpeg,image/png,image/webp,application/pdf',
  maxSizeBytes = 5 * 1024 * 1024,
  allowedTypesLabel = 'JPEG, PNG, WebP or PDF up to 5 MB',
  helperText,
  errorMessage,
  isRequired = false,
  disabled = false,
  value,
  onChange,
  progress,
  className = '',
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const [selectedFile, setSelectedFile] = React.useState<File | null>(value || null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedFile(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFile = (file: File | null) => {
    setInternalError(null);
    if (!file) {
      setSelectedFile(null);
      onChange?.(null);
      return;
    }

    if (maxSizeBytes && file.size > maxSizeBytes) {
      const sizeMb = Math.round(maxSizeBytes / (1024 * 1024));
      setInternalError(`File is too large. Maximum size is ${sizeMb} MB.`);
      return;
    }

    setSelectedFile(file);
    onChange?.(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setInternalError(null);
    onChange?.(null);
  };

  const displayedError = errorMessage || internalError;
  const hasError = Boolean(displayedError);

  return (
    <div className={`w-full flex flex-col gap-1.5 text-left ${className}`}>
      <span className="text-sm font-semibold text-ink dark:text-ink-dark select-none">
        {label}{' '}
        <span className="text-xs font-normal text-ink-muted dark:text-ink-muted-dark">
          ({isRequired ? 'required' : 'optional'})
        </span>
      </span>

      {/* Upload Dropzone / Pick Button */}
      {!selectedFile ? (
        <label
          htmlFor={inputId}
          className={`
            relative flex flex-col items-center justify-center p-6 rounded-md border-2 border-dashed
            cursor-pointer transition-colors duration-fast text-center
            ${
              hasError
                ? 'border-danger dark:border-danger-dark bg-danger/5'
                : 'border-border dark:border-border-dark bg-surface dark:bg-surface-dark hover:border-brand dark:hover:border-brand-dark'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
            focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-focusRing
          `}
        >
          <input
            id={inputId}
            type="file"
            accept={accept}
            disabled={disabled}
            onChange={handleInputChange}
            className="sr-only"
            aria-describedby={hasError ? errorId : helperId}
          />
          <UploadCloud className="w-8 h-8 text-brand dark:text-brand-dark mb-2" aria-hidden="true" />
          <span className="text-sm font-semibold text-ink dark:text-ink-dark">
            Tap to upload file
          </span>
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">
            {allowedTypesLabel}
          </span>
        </label>
      ) : (
        /* File Selected Preview Card */
        <div className="flex flex-col gap-2 p-3 rounded-md border border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-12 h-12 object-cover rounded shrink-0 border border-border dark:border-border-dark"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-stone dark:bg-stone-dark flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-brand dark:text-brand-dark" aria-hidden="true" />
                </div>
              )}
              <div className="min-w-0 flex flex-col">
                <span className="text-sm font-medium text-ink dark:text-ink-dark truncate">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-ink-muted dark:text-ink-muted-dark tabular-nums">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              aria-label="Remove uploaded file"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-muted hover:text-danger dark:hover:text-danger-dark rounded focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Progress bar if upload is in flight */}
          {progress !== undefined && (
            <div className="w-full flex flex-col gap-1 mt-1">
              <div className="w-full bg-border dark:bg-border-dark rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand dark:bg-brand-dark h-full transition-all duration-fast"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-ink-muted dark:text-ink-muted-dark">
                <span>{progress < 100 ? 'Uploading...' : 'Uploaded'}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {hasError ? (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-danger dark:text-danger-dark font-medium"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{displayedError}</span>
        </div>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-ink-muted dark:text-ink-muted-dark">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
