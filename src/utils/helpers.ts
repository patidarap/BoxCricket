export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateSplitAmount = (
  totalAmount: number,
  numberOfPlayers: number,
): number => {
  return Math.round(totalAmount / numberOfPlayers);
};

export const getPaymentStatusColor = (
  status: 'pending' | 'paid' | 'partial',
): string => {
  switch (status) {
    case 'paid':
      return '#10B981';
    case 'partial':
      return '#F59E0B';
    case 'pending':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

export const getMatchStatusColor = (
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
): string => {
  switch (status) {
    case 'upcoming':
      return '#3B82F6';
    case 'ongoing':
      return '#10B981';
    case 'completed':
      return '#6B7280';
    case 'cancelled':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));
