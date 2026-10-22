'use client';
import { useState } from 'react';
import { QrCode, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { BankItem } from '../types';

export function BankQrCard({ banks }: { banks: BankItem[] }) {
  const [selected, setSelected] = useState(banks[0]?.id);
  const bank = banks.find(item => item.id === selected) || banks[0];
  if (!bank) return null;
  return (
    <div className='bank-card glass-panel'>
      <div className='bank-card-header'><span><QrCode size={16} aria-hidden='true' /> THÔNG TIN NGÂN HÀNG</span><ArrowDownLeft size={18} aria-hidden='true' /></div>
      <div className='bank-tabs' role='group' aria-label='Chọn ngân hàng'>
        {banks.map(item => <button key={item.id} className='metal-control' aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.bankCode}<span>{item.isPrimary ? 'Chính' : 'Phụ'}</span></button>)}
      </div>
      <div className='qr-frame'><img src={bank.qrImageUrl} alt={'Mã QR ' + bank.bankName + ', chủ tài khoản ' + bank.accountName} width={260} height={260} loading='lazy' /></div>
      <div className='bank-details'><div><span>NGÂN HÀNG</span><strong>{bank.bankName.replace(/ \(.+\)/, '')}</strong></div><div><span>CHỦ TÀI KHOẢN</span><strong>{bank.accountName}</strong></div></div>
      <p className='bank-hint'><ShieldCheck size={15} aria-hidden='true' />Mở ứng dụng ngân hàng để quét mã VietQR</p>
    </div>
  );
}
