// @ts-nocheck
import React, { useState, ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react'

interface UploadImageType {
  id: string | null,
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  imageUploadState: "loading" | "idle";
  disabled?: boolean;
  width: string;
  height: string;
}
const UploadImage: React.FC<UploadImageType> = ({
  id = null,
  imageUploadState,
  onImageUpload,
  disabled,
  height,
  width
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  // const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null)

  const dragover = (e: Event) => {
    e.preventDefault();
    setIsDragging(true)
  };

  const dragleave = () => {
    setIsDragging(false)
  };

  const drop = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const droppedFiles = e?.target?.files;
    setFiles([...files, ...droppedFiles])
    setIsDragging(false)
    // files.value.push(...droppedFiles);
  };

  return (
    <label
      htmlFor={`${id || 'imageInput'}`}
      // className="dropzone flex justify-center items-center w-[4rem]"
      onDragOver={dragover}
      onDragLeave={dragleave}
      onDrop={drop}
      className={ cn(
          isDragging && 'border-black',
          "dropzone flex justify-center items-center cursor-pointer",
          imageUploadState !== 'loading' && !disabled,
          width, height
        )
      }
    >
      <input
        id={id || 'imageInput'}
        type="file"
        // ref="fileInput"
        onChange={onImageUpload}
        multiple
        hidden
        disabled={imageUploadState === 'loading' || disabled}
      />
      {!files?.length ? (
        <p>
          {imageUploadState !== 'loading' && (
            <Icon
              icon="icons8:upload-2"
              className="text-2xl mx-auto my-auto text-[#ccc]"
            />
          )}
          {imageUploadState === 'loading' && (
            <Icon
              icon="svg-spinners:6-dots-rotate"
              className="text-2xl mx-auto my-auto text-[#ccc]"
            />
          )}
        </p>
      ) : (
        <p>{ files?.length } file(s)</p>
      )}
    </label>
  )
}

export default UploadImage
