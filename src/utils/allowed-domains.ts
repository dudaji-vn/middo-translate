export const getAllowedDomain = ({
  refer,
  allowedDomains,
}: {
  refer?: string | null;
  allowedDomains?: string[];
}) => {
  return allowedDomains?.find((domain) => {
    return refer?.startsWith(domain);
  });
};
