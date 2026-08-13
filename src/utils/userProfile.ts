const fallbackName = 'Estudante';

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fallbackName;
}

export function getInitials(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return 'ES';
  }

  const relevantParts =
    nameParts.length === 1 ? nameParts : [nameParts[0], nameParts[nameParts.length - 1]];

  return relevantParts
    .map((part) => part.charAt(0))
    .join('')
    .toLocaleUpperCase('pt-BR');
}
