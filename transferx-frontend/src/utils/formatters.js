/**
 * Format currency values
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === 0) {
    return 'Free';
  }
  
  const num = parseFloat(amount);
  
  if (num >= 1000000) {
    return `€${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `€${(num / 1000).toFixed(0)}K`;
  }
  
  return `€${num.toLocaleString()}`;
}

/**
 * Format date
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Get initials from first and last name
 */
export function getInitials(firstName, lastName) {
  if (!firstName && !lastName) return '?';
  
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  
  return first + last || '?';
}

/**
 * Format numbers with commas
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
