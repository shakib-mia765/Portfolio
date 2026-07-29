import { useCallback, useMemo, useState } from "react";

const EMPTY_CERTIFICATIONS = Object.freeze([]);
const normalizeCertification = (item, index) => ({
  id: item.id ?? `certification-${index + 1}`,
  title: item.title?.trim() || "Untitled Certification",
  provider: item.provider?.trim() || "Unknown Provider",
  level: item.level?.toLowerCase() || "professional",
  verified: Boolean(item.verified),
  issuedAt: item.issuedAt ?? null,
});

const useClusterMatrix = (certifications = EMPTY_CERTIFICATIONS) => {
  const [activeProvider, setActiveProvider] = useState("all");
  const matrix = useMemo(
    () => certifications.map(normalizeCertification),
    [certifications]
  );
  const providers = useMemo(
    () => [...new Set(matrix.map(({ provider }) => provider))].sort(),
    [matrix]
  );

  const filteredMatrix = useMemo(
    () =>
      activeProvider === "all"
        ? matrix
        : matrix.filter(({ provider }) => provider === activeProvider),
    [activeProvider, matrix]
  );
  const summary = useMemo(() => ({
    total: matrix.length,
    verified: matrix.filter(({ verified }) => verified).length,
    providers: providers.length,
    advanced: matrix.filter(({ level }) => level === "advanced").length,
  }), [matrix, providers]);

  const selectProvider = useCallback(
    (provider = "all") =>
      setActiveProvider(providers.includes(provider) ? provider : "all"),
    [providers]
  );
  return { matrix: filteredMatrix, providers, summary, activeProvider, selectProvider };
};

export default useClusterMatrix;
