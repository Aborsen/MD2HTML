import type { VariantProps } from 'class-variance-authority';
import { createContext, useContext } from 'react';
import type { avatarVariants } from '.';

type AvatarVariants = VariantProps<typeof avatarVariants>;

export const AvatarContext = createContext<AvatarVariants>({
  size: 'md',
  rounded: 'full',
});

export const useAvatarContext = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('Avatar components must be used within Avatar');
  }
  return context;
};
