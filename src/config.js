export const API_URL = 'http://10.0.2.2:5000/api';

export const MEDICINE_CATEGORIES = [
  { label: 'Tablet', value: 'tablet' },
  { label: 'Syrup', value: 'syrup' },
  { label: 'Injection', value: 'injection' },
  { label: 'Ointment', value: 'ointment' },
  { label: 'Other', value: 'other' },
];

export const DONATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COLLECTED: 'collected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const REPORT_ISSUES = [
  { label: 'Counterfeit', value: 'counterfeit' },
  { label: 'Quality Issues', value: 'quality' },
  { label: 'Packaging Issues', value: 'packaging' },
  { label: 'Other', value: 'other' },
];
