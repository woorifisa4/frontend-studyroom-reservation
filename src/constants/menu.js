import { FileText, MessageSquare, Bug } from 'lucide-react';

export const FLOATING_MENU_ITEMS = [
  {
    label: 'Release note',
    icon: FileText,
    iconSize: 18,
    href: 'https://woorifisa4.notion.site/',
    description: '릴리즈 노트 확인'
  },
  {
    label: '기능 건의',
    icon: MessageSquare,
    iconSize: 18,
    href: 'https://forms.gle/7zep5wTSUFpbmqR57',
    description: '새로운 기능 제안'
  },
  {
    label: '버그 건의',
    icon: Bug,
    iconSize: 18,
    href: 'https://forms.gle/oYkteotnATxMzQNf8',
    description: '버그 리포트'
  }
];
