"use client";

import {
  Flex,
  HStack,
  Avatar,
  Text,
  IconButton,
  Collapse,
  useDisclosure,
  Box,
  VStack,
  Icon,
  type IconProps,
} from "@chakra-ui/react";
import NextLink from "next/link";

const navItems = [
  { label: "ABOUT", href: "#about" },
  { label: "PROJECTS", href: "#projects" },
  { label: "OUTPUT", href: "#output" },
];

const MenuIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M4 6h16a1 1 0 1 0 0-2H4a1 1 0 0 0 0 2Zm16 5H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2Zm0 7H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2Z"
    />
  </Icon>
);

const CloseMenuIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M6.7 5.3a1 1 0 0 0-1.4 1.4L10.59 12l-5.3 5.3a1 1 0 0 0 1.42 1.42L12 13.41l5.3 5.3a1 1 0 0 0 1.42-1.42L13.41 12l5.3-5.3a1 1 0 1 0-1.42-1.42L12 10.59Z"
    />
  </Icon>
);

export default function Header() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box as="header" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={1000}>
      <Flex
        w="100%"
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={4}
        align="center"
        justify="space-between"
      >
        <HStack spacing={4}>
          <Avatar size="sm" src="/dummy-logo.png" bg="teal.500" />
          <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }} noOfLines={2}>
            Shogo Hagimori / AWS ENGINEER
          </Text>
        </HStack>
        <HStack spacing={8} fontWeight="medium" color="teal.600" display={{ base: 'none', md: 'flex' }}>
          {navItems.map((item) => (
            <NextLink key={item.href} href={item.href} passHref>
              <Text cursor="pointer">{item.label}</Text>
            </NextLink>
          ))}
        </HStack>
        <IconButton
          aria-label="Toggle navigation"
          icon={isOpen ? <CloseMenuIcon /> : <MenuIcon />}
          display={{ base: 'inline-flex', md: 'none' }}
          onClick={onToggle}
          variant="ghost"
          colorScheme="teal"
        />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box px={4} pb={4} display={{ md: 'none' }}>
          <VStack align="stretch" spacing={3} fontWeight="medium" color="teal.600">
            {navItems.map((item) => (
              <NextLink key={item.href} href={item.href} passHref>
                <Text cursor="pointer" onClick={onClose}>
                  {item.label}
                </Text>
              </NextLink>
            ))}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
}
