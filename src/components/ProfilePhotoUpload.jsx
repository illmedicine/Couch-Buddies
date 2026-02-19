// Reusable profile photo upload component
// Compresses images client-side and returns base64 data URI for database persistence
import { useState, useRef } from 'react'
import { FiCamera, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'

// Compress and resize an image file to a base64 data URI
function compressImage(file, maxSize = 200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          } else {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * ProfilePhotoUpload
 * @param {string} currentPhotoURL - existing photo URL (or null)
 * @param {string} fallbackInitials - initials to show when no photo
 * @param {string} storagePath - Firebase Storage path, e.g. "profiles/owner-1"
 * @param {function} onUploadComplete - callback(downloadURL) after successful upload
 * @param {string} gradientClass - tailwind gradient for fallback circle
 * @param {boolean} editable - show upload overlay
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export default function ProfilePhotoUpload({
  currentPhotoURL,
  fallbackInitials = '?',
  storagePath,
  onUploadComplete,
  gradientClass = 'from-brand-500 to-brand-700',
  editable = false,
  size = 'lg',
}) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-20 h-20 text-2xl',
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    setUploading(true)
    try {
      // Compress image client-side and convert to base64 data URI
      const dataURL = await compressImage(file, 200, 0.75)

      onUploadComplete(dataURL)
      toast.success('Photo updated!')
    } catch (err) {
      console.error('Upload failed:', err)
      toast.error('Failed to process photo.')
    } finally {
      setUploading(false)
      // Reset input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="relative group">
      <div className={`${sizeClasses[size]} rounded-2xl overflow-hidden flex items-center justify-center font-bold bg-gradient-to-br ${gradientClass} ${
        editable ? 'cursor-pointer' : ''
      }`}
        onClick={() => editable && fileRef.current?.click()}
      >
        {currentPhotoURL ? (
          <img
            src={currentPhotoURL}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <span>{fallbackInitials}</span>
        )}

        {/* Upload overlay */}
        {editable && !uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <FiCamera size={size === 'lg' ? 24 : 16} className="text-white" />
          </div>
        )}

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
            <FiLoader size={size === 'lg' ? 24 : 16} className="text-white animate-spin" />
          </div>
        )}
      </div>

      {editable && (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      )}

      {editable && (
        <p className="text-xs text-gray-500 text-center mt-1.5">
          {uploading ? 'Uploading...' : 'Click to change'}
        </p>
      )}
    </div>
  )
}

/**
 * Avatar display component for use in lists, cards, sidebars etc.
 * Shows photo if available, falls back to initials.
 */
export function Avatar({ photoURL, initials = '?', size = 'sm', className = '', clockedIn = false }) {
  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-bold flex-shrink-0 ${
      clockedIn
        ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30'
        : 'bg-gray-500/20 text-gray-400'
    } ${className}`}>
      {photoURL ? (
        <img
          src={photoURL}
          alt="Avatar"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling && (e.target.nextSibling.style.display = '')
          }}
        />
      ) : null}
      <span style={photoURL ? { display: 'none' } : {}}>{initials}</span>
    </div>
  )
}
