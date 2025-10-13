"use client";

// src/app/page.tsx

// 1. ローカルデータを定義したファイルからデータをインポート
import { PROJECTS_DATA } from '../lib/data';
import { Box, SimpleGrid, Heading, Text, VStack, HStack, Link, Flex, Button, Avatar, Container } from '@chakra-ui/react';
import ProjectCard from '../components/ProjectCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import React, { useRef } from 'react';

// ページコンポーネントは同期関数として定義し直します
export default function Home() {
  // APIからの取得ではなく、インポートしたローカルデータを直接使用
  const projects = PROJECTS_DATA;
  const projectsRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToOutput = () => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Header />

      {/* ヒーローセクション */}
      <Container maxW="1200px" mt={8} mb={12} px={8} py={12} bg="gray.800" color="white" borderRadius="xl">
        <Flex align="center" justify="space-between">
          <Box flex="1">
            <Heading as="h1" size="lg" mb={4}>
              10年弱のITエンジニア経験<br />
              AWS・サーバーレス・技術研修のスペシャリスト
            </Heading>
            <Text mb={2}>
              最新技術のキャッチアップと社内外への知見共有を強みとし、<br />
              AWSを中心としたシステム設計・構築・運用、技術研修講師、業務自動化まで幅広く対応。
            </Text>
            <Text mb={6}>
              研修講師経験を活かし、延べ200名以上を対象とした技術研修の企画・実施実績があります。<br />
              複雑なAWS認証などの技術課題も、分かりやすい資料作成を通じて組織へ還元しています。<br />
              プロジェクトリーダー・フリーランス・大手勤務の多様な経験
            </Text>
            <Text fontSize="sm" color="teal.200" mb={2}>
              「未知を既知に変える」――技術力と伝える力で、組織や現場に新しい価値をもたらします。
            </Text>
            <HStack spacing={4}>
              <Button colorScheme="teal" variant="solid" onClick={scrollToProjects}>プロジェクト</Button>
              <Button colorScheme="whiteAlpha" variant="outline" onClick={scrollToOutput}>アウトプット</Button>
            </HStack>
          </Box>
          <Box flexShrink={0} ml={8}>
            <Avatar
              size="2xl"
              src="/dummy-face.jpg"
              name="YOUR NAME"
              bg="gray.300"
              border="4px solid white"
            />
          </Box>
        </Flex>
      </Container>

      {/* About Me / Skills */}
      <Container as="section" id="about" maxW="1200px" px={8} mb={12}>
        <Flex align="flex-start" gap={12}>
          <Box flex="1">
            <Heading as="h2" size="md" mb={4}>ABOUT ME</Heading>
            <Text mb={2} fontSize="sm" color="gray.600">
              ITエンジニア歴10年弱。<br />
              社内外で未開拓技術の導入・システム開発・技術研修講師を担当し、<br />
              200名以上への登壇やチームリーダー経験も豊富。<br />
              <br />
              <b>強み：</b><br />
              ・未知技術のキャッチアップと分かりやすい知見共有<br />
              ・AWSサーバーレスアーキテクチャ設計・構築・運用<br />
              ・業務自動化やコスト最適化の現場改善<br />
              ・チームの強みを引き出すリーダーシップと適材適所の推進<br />
              <br />
              前職では技術研修の企画・講師を3回主導し、<br />
              フリーランスや大手企業での多様なPJ経験を活かして、<br />
              現場に新しい価値を生み出してきました。
            </Text>
          </Box>
          <Box flex="1">
            <Heading as="h3" size="sm" mb={2}>TECHNICAL SKILLS</Heading>
            <HStack spacing={2} mb={2} flexWrap="wrap">
              {/* public/aws-icons配下のアイコンをすべて表示 */}
              {[
                "api-gateway_64.svg",
                "lambda_64.svg",
                "dynamodb_64.svg",
                "cloudfront_64.svg",
                "s3_64.svg",
                "cognito_64.svg",
                "cloudformation_64.svg",
                "codecommit_64.svg",
                "codebuild_64.svg",
                "billing_64.svg",
                "cost-explorer_64.svg",
                "tag-editor_64.svg",
                "athena_64.svg",
                "glue_64.svg",
                "cloudwatch_64.svg"
              ].map((icon) => (
                <Box
                  key={icon}
                  bg="white"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minW="48px"
                  minH="48px"
                  m={1}
                >
                  <img
                    src={`/aws-icons/${icon}`}
                    alt={icon.replace("_64.svg", "")}
                    width={48}
                    height={48}
                    style={{ borderRadius: "50%" }}
                  />
                </Box>
              ))}
            </HStack>
            {/* 技術力アピール追加 */}
            <Text fontSize="xs" color="teal.600">
              AWS認定資格／サーバーレス設計／CI/CD／技術研修資料作成・講師／自動化・効率化／マルチクラウド
            </Text>
          </Box>
        </Flex>
      </Container>

      {/* Projects */}
      <div ref={projectsRef}>
        <Container as="section" id="projects" maxW="1200px" px={8} mb={12}>
          <Heading as="h2" size="md" mb={4}>PROJECTS</Heading>
          {/* 技術力アピール追加 */}
          <Text fontSize="sm" color="teal.600" mb={2}>
            AWS移行／サーバーレス開発／技術研修／自動化／システム設計レビューなど多様なPJ経験
          </Text>
          {/* 横スクロール対応: SimpleGrid → Flex */}
          <Box overflowX="auto">
            <Flex gap={6} wrap="nowrap">
              {projects.map((project) => (
                <Box minW={{ base: "300px", md: "350px" }} key={project.id}>
                  <ProjectCard project={project} />
                </Box>
              ))}
            </Flex>
          </Box>
        </Container>
      </div>

      {/* Output */}
      <div ref={outputRef}>
        <Container as="section" id="output" maxW="1200px" px={8} mb={12}>
          <Heading as="h2" size="md" mb={4}>OUTPUT</Heading>
          {/* 技術力アピール追加 */}
          <Text fontSize="sm" color="teal.600" mb={2}>
            技術研修資料・登壇資料・社内外向けナレッジ共有実績
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm">
              <Text fontWeight="bold" mb={2}>最新事例!AWS Lambdaを使った サーバレスのアプリケーション開発</Text>
              <Link href="https://www.exa-corp.co.jp/technews/file/EVF2018_A-2.pdf" color="teal.500" isExternal>
                PDFを読む
              </Link>
            </Box>
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm">
              <Text fontWeight="bold" mb={2}>クラウドの真骨頂！ 2時間でクラウドネイティブな 「動く」アプリを開発する</Text>
              <Link href="https://www.exa-corp.co.jp/technews/file/EVF2019_E-1.pdf" color="teal.500" isExternal>
                PDFを読む
              </Link>
            </Box>
          </SimpleGrid>
        </Container>
      </div>

      <Footer />
    </Box>
  );
}