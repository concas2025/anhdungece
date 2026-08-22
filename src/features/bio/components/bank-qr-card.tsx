'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { BankItem } from '../types';
import { cn } from '@/lib/utils';

export function BankQrCard({ banks }: { banks: BankItem[] }) {
  const [selectedBankId, setSelectedBankId] = React.useState<string>(banks[0]?.id || 'tcb');
  const currentBank = banks.find((b) => b.id === selectedBankId) || banks[0];

  return (
    <Card className='w-full overflow-hidden border-border/60 bg-card/75 backdrop-blur-xl shadow-md ring-1 ring-foreground/5 hover:border-primary/30 transition-all duration-300'>
      <CardHeader className='pb-2 pt-4 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
        <div className='space-y-0.5 text-left'>
          <CardTitle className='text-sm sm:text-base font-semibold flex items-center gap-2 text-foreground'>
            <Icons.creditCard className='h-4 w-4 text-primary' />
            Thông Tin Chuyển Khoản / QR
          </CardTitle>
          <CardDescription className='text-xs text-muted-foreground'>{currentBank.note}</CardDescription>
        </div>

        <div className='flex items-center gap-1 bg-muted/60 p-1 rounded-lg self-start sm:self-auto'>
          {banks.map((bank) => (
            <Button
              key={bank.id}
              variant={selectedBankId === bank.id ? 'default' : 'ghost'}
              size='xs'
              onClick={() => setSelectedBankId(bank.id)}
              className={cn('text-xs px-2.5 h-6 rounded-md font-medium transition-all', selectedBankId === bank.id ? 'shadow-xs' : 'text-muted-foreground')}
            >
              {bank.bankCode} {bank.isPrimary && '★'}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className='p-4 sm:p-5 pt-1'>
        <div className='flex flex-col sm:flex-row items-center gap-4 bg-muted/30 rounded-xl p-3.5 border border-border/50'>
          <div className='relative shrink-0 rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/10 overflow-hidden group'>
            <img
              src={currentBank.qrImageUrl}
              alt={`Mã QR ${currentBank.bankName}`}
              width={140}
              height={140}
              className='size-36 sm:size-32 rounded-lg object-contain transition-transform duration-300 group-hover:scale-105'
              loading='lazy'
            />
          </div>

          <div className='flex-1 w-full space-y-2.5 text-left'>
            <div className='flex items-center justify-between'>
              <span className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider'>Ngân hàng</span>
              <Badge variant='outline' className='text-[10px] font-medium border-primary/30 text-primary'>
                {currentBank.isPrimary ? 'Tài khoản chính' : 'Tài khoản phụ'}
              </Badge>
            </div>

            <div>
              <p className='font-bold text-sm sm:text-base text-foreground'>{currentBank.bankName}</p>
              <p className='text-xs text-muted-foreground uppercase font-medium mt-0.5'>
                Chủ tài khoản: <span className='text-foreground font-semibold'>{currentBank.accountName}</span>
              </p>
            </div>

            <div className='pt-1'>
              <div className='flex items-center gap-2 p-2 rounded-lg bg-background/80 border border-border text-xs text-muted-foreground'>
                <Icons.qrcode className='size-4 text-primary shrink-0' />
                <span>Mở app ngân hàng quét mã QR để chuyển khoản nhanh</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
