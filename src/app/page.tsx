'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Stack,
  Button,
  Card,
  SimpleGrid,
  Badge,
  HStack,
  Icon,
  Link,
  Separator,
} from '@chakra-ui/react'
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaServer, FaCloud } from 'react-icons/fa'

export default function Home() {
  return (
    <Box>
      {/* Header */}
      <Box bg="blue.600" color="white" py={4} px={8}>
        <Container maxW="6xl">
          <HStack justify="space-between">
            <Heading size="md">ポートフォリオ</Heading>
            <HStack gap={4}>
              <Link href="https://github.com" target="_blank">
                <Icon fontSize="2xl">
                  <FaGithub />
                </Icon>
              </Link>
              <Link href="mailto:contact@example.com">
                <Icon fontSize="2xl">
                  <FaEnvelope />
                </Icon>
              </Link>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box bg="blue.600" color="white" py={20}>
        <Container maxW="6xl">
          <VStack gap={6} align="start">
            <Heading size="4xl">技術者ポートフォリオ</Heading>
            <Text fontSize="xl">
              AWSとモダンWebテクノロジーを活用したフルスタック開発
            </Text>
            <HStack gap={4}>
              <Button colorPalette="blue" size="lg">
                プロジェクトを見る
              </Button>
              <Button variant="outline" size="lg">
                お問い合わせ
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Skills Section */}
      <Container maxW="6xl" py={20}>
        <VStack gap={12} align="stretch">
          <Box>
            <Heading size="3xl" mb={8} textAlign="center">
              技術スキル
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
              <Card.Root>
                <Card.Body>
                  <VStack align="start" gap={4}>
                    <Icon color="blue.500" fontSize="4xl">
                      <FaCode />
                    </Icon>
                    <Heading size="lg">フロントエンド</Heading>
                    <Text>
                      React, Next.js, TypeScript, Chakra UIを使用したモダンなWebアプリケーション開発
                    </Text>
                    <HStack gap={2} flexWrap="wrap">
                      <Badge colorPalette="blue">React</Badge>
                      <Badge colorPalette="blue">Next.js</Badge>
                      <Badge colorPalette="blue">TypeScript</Badge>
                      <Badge colorPalette="blue">Chakra UI</Badge>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root>
                <Card.Body>
                  <VStack align="start" gap={4}>
                    <Icon color="orange.500" fontSize="4xl">
                      <FaCloud />
                    </Icon>
                    <Heading size="lg">AWS / クラウド</Heading>
                    <Text>
                      AWSサービスを活用したインフラストラクチャのコード化とサーバーレスアーキテクチャ
                    </Text>
                    <HStack gap={2} flexWrap="wrap">
                      <Badge colorPalette="orange">S3</Badge>
                      <Badge colorPalette="orange">CloudFront</Badge>
                      <Badge colorPalette="orange">CodePipeline</Badge>
                      <Badge colorPalette="orange">CloudFormation</Badge>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root>
                <Card.Body>
                  <VStack align="start" gap={4}>
                    <Icon color="green.500" fontSize="4xl">
                      <FaServer />
                    </Icon>
                    <Heading size="lg">DevOps / IaC</Heading>
                    <Text>
                      Infrastructure as CodeとCI/CDパイプラインによる自動化されたデプロイメント
                    </Text>
                    <HStack gap={2} flexWrap="wrap">
                      <Badge colorPalette="green">CloudFormation</Badge>
                      <Badge colorPalette="green">CodeBuild</Badge>
                      <Badge colorPalette="green">GitHub Actions</Badge>
                      <Badge colorPalette="green">IaC</Badge>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </Box>

          <Separator />

          {/* Projects Section */}
          <Box>
            <Heading size="3xl" mb={8} textAlign="center">
              プロジェクト
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
              <Card.Root>
                <Card.Body>
                  <VStack align="start" gap={4}>
                    <Heading size="lg">このポートフォリオサイト</Heading>
                    <Text>
                      Next.js + Chakra UIで構築し、AWSのサーバーレスアーキテクチャでホスティング。
                      CloudFormationによるIaCとCodePipelineによる自動デプロイメントを実装。
                    </Text>
                    <HStack gap={2} flexWrap="wrap">
                      <Badge>Next.js</Badge>
                      <Badge>TypeScript</Badge>
                      <Badge>AWS</Badge>
                      <Badge>IaC</Badge>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root>
                <Card.Body>
                  <VStack align="start" gap={4}>
                    <Heading size="lg">サンプルプロジェクト</Heading>
                    <Text>
                      その他のプロジェクトの説明がここに入ります。
                      実際のプロジェクトに合わせてカスタマイズしてください。
                    </Text>
                    <HStack gap={2} flexWrap="wrap">
                      <Badge>React</Badge>
                      <Badge>Node.js</Badge>
                      <Badge>AWS</Badge>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </Box>

          <Separator />

          {/* About Section */}
          <Box>
            <Heading size="3xl" mb={8} textAlign="center">
              このサイトについて
            </Heading>
            <Card.Root>
              <Card.Body>
                <VStack align="start" gap={4}>
                  <Heading size="lg">アーキテクチャ</Heading>
                  <Text>
                    本サイトは以下のAWSサービスとテクノロジーを使用して構築されています：
                  </Text>
                  <Stack gap={2}>
                    <Text>• <strong>Next.js (Static Export)</strong>: React フレームワーク</Text>
                    <Text>• <strong>Chakra UI</strong>: UIコンポーネントライブラリ</Text>
                    <Text>• <strong>Amazon S3</strong>: 静的ファイルホスティング</Text>
                    <Text>• <strong>Amazon CloudFront</strong>: CDNによる高速配信</Text>
                    <Text>• <strong>AWS WAF</strong>: Webアプリケーションファイアウォール</Text>
                    <Text>• <strong>AWS CodePipeline</strong>: CI/CDパイプライン</Text>
                    <Text>• <strong>AWS CodeBuild</strong>: ビルド自動化</Text>
                    <Text>• <strong>AWS CloudFormation</strong>: Infrastructure as Code</Text>
                  </Stack>
                  <Text mt={4}>
                    GitHubにプッシュすると自動的にCodePipelineが起動し、
                    CodeBuildでビルドされたHTMLファイルがS3に配置され、
                    CloudFront経由で配信されます。
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </Box>
        </VStack>
      </Container>

      {/* Footer */}
      <Box bg="gray.800" color="white" py={8} mt={20}>
        <Container maxW="6xl">
          <VStack gap={4}>
            <Text>&copy; 2024 Portfolio. All rights reserved.</Text>
            <HStack gap={4}>
              <Link href="https://github.com" target="_blank">
                GitHub
              </Link>
              <Text>•</Text>
              <Link href="mailto:contact@example.com">
                Contact
              </Link>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}
