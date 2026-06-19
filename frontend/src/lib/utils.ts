import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    completed: 'badge-success',
    delivered: 'badge-success',
    confirmed: 'badge-success',
    ready: 'badge-gold',
    scheduled: 'badge-info',
    quoted: 'badge-info',
    in_production: 'badge-warning',
    in_progress: 'badge-warning',
    cancelled: 'badge-danger',
    no_show: 'badge-danger',
  };
  return map[status] || 'badge-info';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    scheduled: 'Planlandı',
    confirmed: 'Onaylandı',
    in_progress: 'Devam Ediyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal',
    no_show: 'Gelmedi',
    quoted: 'Teklif',
    in_production: 'Üretimde',
    ready: 'Hazır',
    delivered: 'Teslim Edildi',
  };
  return labels[status] || status;
}

export function getAppointmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    consultation: 'Koku Danışmanlığı',
    blending: 'Karışım Atölyesi',
    pickup: 'Teslim',
    follow_up: 'Takip',
  };
  return labels[type] || type;
}

export function getConcentrationLabel(concentration: string): string {
  const labels: Record<string, string> = {
    edt: 'Eau de Toilette (EDT)',
    edp: 'Eau de Parfum (EDP)',
    parfum: 'Parfum',
    extrait: 'Extrait de Parfum',
  };
  return labels[concentration] || concentration;
}

export function getIngredientCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    essential_oil: 'Esansiyel Yağ',
    absolute: 'Absolü',
    synthetic: 'Sentetik',
    alcohol: 'Alkol',
    fixative: 'Fiksativ',
    other: 'Diğer',
  };
  return labels[category] || category;
}

export function getOrderStatusLabel(status: string): string {
  return getStatusLabel(status);
}
