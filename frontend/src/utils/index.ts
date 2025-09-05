import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string) => {
  const d = new Date(date);
  return format(d, 'MMM d, yyyy');
};

export const formatRelativeDate = (date: string) => {
  const d = new Date(date);
  return formatDistanceToNow(d, { addSuffix: true });
};

export const truncateText = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const downloadFile = (content: string, filename: string, type: string = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};