import { BioProfileData } from '../types';

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const bioData: BioProfileData = {
  name: 'Phạm Anh Dũng',
  title: 'Electronics & Telecommunications Engineer',
  bio: 'Kỹ sư Điện tử & Viễn thông • Đam mê nghiên cứu, vọc vạch công nghệ phần cứng, mạch điện tử và hệ thống viễn thông.',
  location: 'Việt Nam',
  avatarUrl: `${assetBase}/images/avatar.jpg`,
  status: 'online',
  statusText: 'Đang trực tuyến • Sẵn sàng kết nối',
  isVerified: true,
  skills: [
    'Electronics',
    'Telecommunications',
    'Embedded Systems',
    'Hardware & IoT',
    'Tech Enthusiast'
  ],

  banks: [
    {
      id: 'tcb',
      bankName: 'Techcombank (Chính)',
      bankCode: 'TCB',
      accountName: 'PHAM ANH DUNG',
      qrImageUrl: `${assetBase}/images/qr-techcombank.jpg`,
      isPrimary: true,
      note: 'Tài khoản chính • Quét mã VietQR chuyển khoản nhanh 24/7'
    },
    {
      id: 'vcb',
      bankName: 'Vietcombank (Phụ)',
      bankCode: 'VCB',
      accountName: 'PHAM ANH DUNG',
      qrImageUrl: `${assetBase}/images/qr-vietcombank.jpg`,
      isPrimary: false,
      note: 'Tài khoản phụ • Quét mã VietQR 24/7'
    }
  ],

  socialLinks: [
    {
      id: 'facebook',
      title: 'Facebook Cá Nhân',
      username: 'facebook.com/dnqdwthgv',
      url: 'https://www.facebook.com/dnqdwthgv/',
      iconName: 'facebook',
      actionType: 'link',
      copyValue: 'https://www.facebook.com/dnqdwthgv/',
      badge: { text: 'Trang cá nhân', variant: 'secondary' },
      brandColor: 'text-[#1877F2] bg-[#1877F2]/10'
    },
    {
      id: 'zalo',
      title: 'Zalo Chat',
      username: 'Inbox trực tiếp qua Zalo',
      url: 'https://zalo.me',
      iconName: 'chat',
      actionType: 'link',
      badge: { text: 'Ib trực tiếp', variant: 'default' },
      brandColor: 'text-[#0068FF] bg-[#0068FF]/10'
    },
    {
      id: 'instagram',
      title: 'Instagram',
      username: '@s1mpleirl.das',
      url: 'https://www.instagram.com/s1mpleirl.das?igsi=a3RycHFzMXYzeHlw',
      iconName: 'instagram',
      actionType: 'link',
      badge: { text: 'Follow me', variant: 'secondary' },
      brandColor: 'text-[#E1306C] bg-[#E1306C]/10'
    },
    {
      id: 'github',
      title: 'GitHub Profile',
      username: 'github.com/concas2025',
      url: 'https://github.com/concas2025',
      iconName: 'github',
      actionType: 'link',
      copyValue: 'https://github.com/concas2025',
      badge: { text: 'Repositories', variant: 'secondary' },
      brandColor: 'text-foreground bg-muted'
    },
    {
      id: 'gmail',
      title: 'Email Liên Hệ',
      username: 'anhdung.ece@gmail.com',
      url: 'mailto:anhdung.ece@gmail.com',
      iconName: 'send',
      actionType: 'email',
      copyValue: 'anhdung.ece@gmail.com',
      badge: { text: 'Công việc / Trao đổi', variant: 'outline' },
      brandColor: 'text-[#EA4335] bg-[#EA4335]/10'
    },
    {
      id: 'discord',
      title: 'Discord Profile',
      username: 'ID: 1346685369512497213',
      url: 'https://discord.com/users/1346685369512497213',
      iconName: 'discord',
      actionType: 'link',
      copyValue: '1346685369512497213',
      badge: { text: 'ID Discord', variant: 'secondary' },
      brandColor: 'text-[#5865F2] bg-[#5865F2]/10'
    }
  ]
};
