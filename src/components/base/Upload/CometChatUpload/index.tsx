import React from 'react'
import { Upload as AntUpload } from 'antd'
import type { UploadProps as AntUploadProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Upload.
 * A file upload component supporting drag-and-drop and click-to-upload.
 *
 * @example
 * <CometChatUpload action="/api/upload" onChange={handleChange}>
 *   <button>Click to Upload</button>
 * </CometChatUpload>
 *
 * <CometChatUpload dragger action="/api/upload">
 *   <p>Drag files here</p>
 * </CometChatUpload>
 */
interface CometChatUploadProps extends Omit<AntUploadProps, 'className' | 'type'> {
  /** Whether to use drag-and-drop mode */
  dragger?: boolean
  /** Additional CSS class */
  className?: string
}

/**
 * CometChat Upload — file upload with drag-and-drop support.
 */
const CometChatUpload: React.FC<CometChatUploadProps> = ({
  dragger = false,
  children,
  className = '',
  ...rest
}) => {
  const Component = dragger ? AntUpload.Dragger : AntUpload

  return (
    <Component
      className={`cc-upload ${className}`}
      {...rest}
    >
      {children}
    </Component>
  )
}

CometChatUpload.displayName = 'CometChatUpload'

export default CometChatUpload
