import { motion } from 'framer-motion';
import { useRef } from 'react';
import { getDefaultAvatar } from '../utils/getDefaultAvatar';

interface AvatarProps {
  userId: string;              // 🔥 REQUIRED
  src?: string;                // uploaded avatar (optional)
  size?: number;
  clickable?: boolean;
  onUpload?: (file: File) => void;
}

const Avatar = ({
  userId,
  src,
  size = 112,
  clickable = false,
  onUpload,
}: AvatarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Decide final avatar source
  const finalSrc = src || getDefaultAvatar(userId);

  const handleClick = () => {
    if (clickable) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) onUpload(file);
  };

  return (
    <>
      <motion.img
        whileHover={clickable ? { scale: 1.05 } : undefined}
        whileTap={clickable ? { scale: 0.95 } : undefined}
        onClick={handleClick}
        src={finalSrc}
        onError={(e) => {
          e.currentTarget.src = getDefaultAvatar(userId);
        }}
        alt="User Avatar"
        className="rounded-full object-cover ring-4 ring-neutral-300 shadow-lg cursor-pointer"
        style={{ width: size, height: size }}
      />

      {clickable && (
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
        />
      )}
    </>
  );
};

export default Avatar;
