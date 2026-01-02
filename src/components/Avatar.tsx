import { motion } from 'framer-motion';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { getDefaultAvatar } from '../utils/getDefaultAvatar';
import { useAuth } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface AvatarProps {
  userId: string;        // REQUIRED
  src?: string;          // uploaded avatar (optional)
  size?: number;
  clickable?: boolean;
}

const Avatar = ({
  userId,
  src,
  size = 112,
  clickable = false,
}: AvatarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { token, updateUser } = useAuth();

  // Decide final avatar source
  const finalSrc = src || getDefaultAvatar(userId);

  const handleClick = () => {
    if (clickable) inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const uploadToast = toast.loading('Uploading avatar...');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(`${apiUrl}/api/profile/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const updatedUserData = await response.json();
      if (!response.ok) {
        throw new Error(updatedUserData.message || 'Failed to upload avatar.');
      }

      updateUser(updatedUserData);
      toast.success('Avatar updated successfully!', { id: uploadToast });
    } catch (err: any) {
      toast.error(`Error: ${err.message}`, { id: uploadToast });
    }
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
        className={`rounded-full object-cover ring-4 ring-neutral-300 shadow-lg ${
          clickable ? 'cursor-pointer' : ''
        }`}
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
