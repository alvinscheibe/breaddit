import { User } from 'next-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { Icons } from '@/components/icons';
import { AvatarProps } from '@radix-ui/react-avatar';

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'name' | 'image'>
}

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className={'relative aspect-square h-full w-full'}>
          <Image src={user.image} alt={'Profile picture'} fill={true} referrerPolicy={'no-referrer'} />
        </div>
      ) : (
        <AvatarFallback>
          <span className={'sr-only'}>{user?.name}</span>
          <Icons.user className={'h-4 w-4'} />
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;