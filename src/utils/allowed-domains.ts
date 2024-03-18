export const isAllowedDomain = ({
    refer,
    allowedDomains,
}: {
  refer?: string | null;
  allowedDomains?: string[];
}) => {
  return allowedDomains?.some((domain) => {
    return refer?.startsWith(domain)}) || false;
};
