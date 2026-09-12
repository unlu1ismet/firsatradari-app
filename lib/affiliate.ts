export function generateAffiliateLink(merchant: string, rawUrl: string): string {
  const url = rawUrl ?? '';
  switch (merchant) {
    case 'Amazon':
      return url.includes('?') ? `${url}&tag=firsatradari-21` : `${url}?tag=firsatradari-21`;
    case 'Trendyol':
    case 'Hepsiburada':
      return url.includes('?') ? `${url}&subid=firsatradari&adjust_tracker=firsatradari` : `${url}?subid=firsatradari&adjust_tracker=firsatradari`;
    case 'A101':
      return url.includes('?') ? `${url}&utm_source=firsatradari&utm_medium=affiliate` : `${url}?utm_source=firsatradari&utm_medium=affiliate`;
    default:
      return url.includes('?') ? `${url}&ref=firsatradari` : `${url}?ref=firsatradari`;
  }
}
