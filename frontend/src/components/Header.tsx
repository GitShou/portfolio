import { Flex, HStack, Avatar, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Header() {
  return (
    <Flex as="header" w="100%" maxW="1200px" mx="auto" px={8} py={4} align="center" justify="space-between">
      <HStack spacing={4}>
        <Avatar size="sm" src="/dummy-logo.png" bg="teal.500" />
        <Text fontWeight="bold">Shogo Hagimori / AWS ENGINEER</Text>
      </HStack>
      <HStack spacing={8} fontWeight="medium" color="teal.600">
        <NextLink href="#about" passHref>
          <Text cursor="pointer">ABOUT</Text>
        </NextLink>
        <NextLink href="#projects" passHref>
          <Text cursor="pointer">PROJECTS</Text>
        </NextLink>
        <NextLink href="#output" passHref>
          <Text cursor="pointer">OUTPUT</Text>
        </NextLink>
      </HStack>
    </Flex>
  );
}
