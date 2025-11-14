"use client";

import { useCallback, useEffect, useState } from "react";
import { IconButton, Fade, Icon, type IconProps } from "@chakra-ui/react";

const ArrowUpIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12 4a2 2 0 0 0-1.414.586l-7 7a2 2 0 1 0 2.828 2.828L10 10.828V20a2 2 0 1 0 4 0v-9.172l3.586 3.586a2 2 0 0 0 2.828-2.828l-7-7A2 2 0 0 0 12 4Z"
    />
  </Icon>
);

const SCROLL_THRESHOLD = 240;

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const updateVisibility = useCallback(() => {
    if (typeof window === "undefined") return;
    setIsVisible(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, [updateVisibility]);

  const handleClick = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Fade in={isVisible} unmountOnExit>
      <IconButton
        aria-label="ページ上部へ戻る"
        icon={<ArrowUpIcon boxSize={5} />}
        colorScheme="teal"
        position="fixed"
        bottom={{ base: 6, md: 8 }}
        right={{ base: 6, md: 8 }}
        zIndex={1200}
        onClick={handleClick}
        size="lg"
        shadow="lg"
        rounded="full"
      />
    </Fade>
  );
}