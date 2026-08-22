export interface BankItem {
  id: string;
  bankName: string;
  bankCode: string;
  accountName: string;
  accountNumber?: string;
  qrImageUrl: string;
  isPrimary?: boolean;
  note?: string;
}

export interface SocialLinkItem {
  id: string;
  title: string;
  username: string;
  url: string;
  iconName: 'facebook' | 'instagram' | 'github' | 'discord' | 'chat' | 'send' | 'phone' | 'media' | 'externalLink';
  actionType: 'link' | 'copy' | 'email';
  copyValue?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  brandColor?: string;
}

export interface BioProfileData {
  name: string;
  title: string;
  bio: string;
  location: string;
  avatarUrl: string;
  status: 'online' | 'offline';
  statusText: string;
  isVerified: boolean;
  skills: string[];
  banks: BankItem[];
  socialLinks: SocialLinkItem[];
}
