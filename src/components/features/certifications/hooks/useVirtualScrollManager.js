import { useCallback, useMemo, useRef, useState } from "react";

const DEFAULT_CONFIG = Object.freeze({
  itemHeight: 96,
  overscan: 3,
});
const useVirtualScrollManager = (
  items = [],
  config = DEFAULT_CONFIG
) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = Math.max(1, config.itemHeight ?? 96);
  const overscan = Math.max(0, config.overscan ?? 3);
  const viewportHeight =
    containerRef.current?.clientHeight ?? itemHeight;

  const range = useMemo(() => {
    const visibleCount = Math.ceil(viewportHeight / itemHeight);
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length,
      start + visibleCount + overscan * 2
    );
    return { start, end };
  }, [itemHeight, items.length, overscan, scrollTop, viewportHeight]);
  const virtualItems = useMemo(
    () =>
      items.slice(range.start, range.end).map((item, index) => ({
        item,
        index: range.start + index,
        offset: (range.start + index) * itemHeight,
      })),
    [itemHeight, items, range]
  );
  const handleScroll = useCallback(
    ({ currentTarget }) => setScrollTop(currentTarget.scrollTop),
    []
  );

  const scrollToIndex = useCallback(
    (index) =>
      containerRef.current?.scrollTo({
        top: Math.max(0, index) * itemHeight,
        behavior: "smooth",
      }),
    [itemHeight]
  );
  return {
    containerRef,
    virtualItems,
    totalHeight: items.length * itemHeight,
    handleScroll,
    scrollToIndex,
  };
};

export default useVirtualScrollManager;
