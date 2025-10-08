'use client'

import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Container maxW="6xl">
        <VStack gap={8} textAlign="center">
          <Heading size="6xl" color="blue.600">404</Heading>
          <Heading size="2xl">ページが見つかりません</Heading>
          <Text fontSize="lg" color="gray.600">
            お探しのページは存在しないか、移動された可能性があります。
          </Text>
          <Link href="/">
            <Button colorPalette="blue" size="lg">
              トップページに戻る
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  )
}
