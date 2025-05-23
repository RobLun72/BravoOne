import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useId,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface ErrorTextProps {
  id?: string;
  message: string;
  className?: string;
}

export const ErrorText: FunctionComponent<ErrorTextProps> = ({
  id,
  message,
  className,
}: ErrorTextProps) => {
  return (
    <p className={cn("mt-1 mb-1 text-sm text-red-600", className)} id={id}>
      {message}
    </p>
  );
};

export interface FileInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  className?: string;
  label?: ReactNode;
  errorText?: string;
  defaultFiles?: File[];
  onUpload?: (fileList: FileList) => void;
}

export function FileInput({
  className,
  label,
  disabled,
  required,
  errorText,
  ref,
  defaultFiles,
  onUpload,
  ...otherProps
}: FileInputProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>(defaultFiles ?? []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (!event.target.files || event.target.files.length === 0) return;
      setFiles(Array.from(event.target.files));
      onUpload?.(event.target.files);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);
      if (!event.dataTransfer.files) return;
      setFiles(Array.from(event.dataTransfer.files));
      onUpload?.(event.dataTransfer.files);
    },
    [onUpload]
  );

  return (
    <div className="my-2">
      <label className="text-sm text-steel " htmlFor={id}>
        {label}
      </label>
      <div
        className={cn(
          "rounded-sm border w-full border-clay bg-neutral-100 hover:bg-neutral-300 transition-all flex items-center justify-center text-sm text-center ",
          dragging && "bg-steel/20",
          disabled ? "bg-clay text-steel cursor-not-allowed" : "cursor-pointer",
          className
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={ref}
          className="hidden"
          type="file"
          name="file"
          id={id}
          disabled={disabled}
          required={required}
          multiple
          onChange={handleFileChange}
          {...otherProps}
        />
        <label
          htmlFor={id}
          className={cn(
            "w-full h-full flex items-center justify-center p-8",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          {files.length > 0
            ? files.map((file) => file.name).join(", ")
            : "Drag and drop files here or click to select files"}
        </label>
      </div>
      {errorText && (
        <ErrorText
          id={`${otherProps.id || otherProps.name}-error`}
          message={errorText}
          className="px-2 m-0"
        />
      )}
    </div>
  );
}
