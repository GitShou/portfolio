import { Box, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" w="100%" maxW="1200px" mx="auto" px={8} py={6} color="gray.500" borderTop="1px" borderColor="gray.200" textAlign="center">
      <Text fontSize="xs">&copy; {new Date().getFullYear()} YOUR NAME. All rights reserved.</Text>
    </Box>
  );
}
