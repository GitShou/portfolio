"use client";

import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  HStack,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import ProjectCard from "./ProjectCard";
import Header from "./Header";
import Footer from "./Footer";
import { Project } from "@/lib/projects/types";

interface HomePageClientProps {
  projects: Project[];
}

const HomePageClient = ({ projects }: HomePageClientProps) => {
  const projectsRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToOutput = () => {
    outputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Header />

      <Container
        maxW="1200px"
        mt={8}
        mb={12}
        px={8}
        py={12}
        bg="gray.800"
        color="white"
        borderRadius="xl"
      >
        <Flex align="center" justify="space-between">
          <Box flex="1">
            <Heading as="h1" size="lg" mb={4}>
              10年弱のITエンジニア経験
              <br />
              AWS・サーバーレス・技術研修のスペシャリスト
            </Heading>
            <Text mb={2}>
              最新技術のキャッチアップと社内外への知見共有を強みとし、
              <br />
              AWSを中心としたシステム設計・構築・運用、技術研修講師、業務自動化まで幅広く対応。
            </Text>
            <Text mb={6}>
              研修講師経験を活かし、延べ200名以上を対象とした技術研修の企画・実施実績があります。
              <br />
              複雑なAWS認証などの技術課題も、分かりやすい資料作成を通じて組織へ還元しています。
              <br />
              プロジェクトリーダー・フリーランス・大手勤務の多様な経験
            </Text>
            <Text fontSize="sm" color="teal.200" mb={2}>
              「未知を既知に変える」――技術力と伝える力で、組織や現場に新しい価値をもたらします。
            </Text>
            <HStack spacing={4}>
              <Button colorScheme="teal" variant="solid" onClick={scrollToProjects}>
                プロジェクト
              </Button>
              <Button colorScheme="whiteAlpha" variant="outline" onClick={scrollToOutput}>
                アウトプット
              </Button>
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

      <Container as="section" id="portfolio-project" maxW="1200px" px={8} mb={12}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={{ base: 8, md: 12 }}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          p={{ base: 6, md: 10 }}
        >
          <Box flex="1">
            <Heading as="h2" size="md" mb={4} color="teal.700">
              技術ポートフォリオサイト開発の舞台裏
            </Heading>
            <Text mb={4} color="gray.700" fontSize="sm">
              このサイトは Next.js と Chakra UI、AWS サーバーレス基盤を活用したフルマネージド構成で構築しています。
              CloudFront や API Gateway、Lambda、DynamoDB を組み合わせ、CI/CD まで自動化したアーキテクチャを採用しています。
            </Text>
            <Text mb={6} color="gray.600" fontSize="sm">
              アーキテクチャ図と実装の詳細、得られた知見はプロジェクトページにまとめています。ぜひご覧ください。
            </Text>
            <Button as={Link} href="/projects/1" colorScheme="teal" variant="solid">
              プロジェクト詳細を見る
            </Button>
          </Box>
          <Box flex="1" w="full">
            <Image
              src="/img/portfolio-architecture.svg"
              alt="技術ポートフォリオサイトのアーキテクチャ図"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
              bg="white"
              p={{ base: 4, md: 6 }}
            />
          </Box>
        </Flex>
      </Container>

      <Container as="section" id="about" maxW="1200px" px={8} mb={12}>
        <Flex align="flex-start" gap={12}>
          <Box flex="1">
            <Heading as="h2" size="md" mb={4}>
              ABOUT ME
            </Heading>
            <Text mb={2} fontSize="sm" color="gray.600" lineHeight="1.9">
              AWSサーバーレスとクラウド設計を専門とするフルスタックエンジニア。
              <br />
              未開拓技術の導入から研修設計まで担い、延べ200名超へ登壇した実績あり。
              <br />
              フリーランスと大手企業でリーダーを務め、設計・実装・運用改善を横断。
              <br />
              自走力と学習意欲を武器に、短期間で成果を出すチームづくりを支援しています。
            </Text>
          </Box>
          <Box flex="1">
            <Heading as="h3" size="md" mb={2}>
              TECHNICAL SKILLS
            </Heading>
            <HStack spacing={2} mb={2} flexWrap="wrap">
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
                "athena_64.svg",
                "glue_64.svg",
                "cloudwatch_64.svg",
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
            <Text fontSize="xs" color="teal.600">
              フルスクラッチ／サーバーレス設計／CI/CD／技術研修資料作成・講師／自動化・効率化
            </Text>
          </Box>
        </Flex>
      </Container>

      <Container as="section" id="highlights" maxW="1200px" px={8} mb={12}>
        <Box bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100" p={{ base: 6, md: 8 }}>
          <Heading as="h2" size="md" mb={2} color="teal.700">
            HIGHLIGHTS
          </Heading>
          <Text fontSize="sm" color="gray.600" mb={6}>
            現場で実践してきた強みと提供価値を4つの視点でまとめました。
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            {[
              {
                title: "未知領域への適応力",
                body: "未経験分野でも背景を素早く理解し、短期間で成果を創出。PoCから本番導入までリード。"
              },
              {
                title: "自走力と継続学習",
                body: "日々のインプットと検証で知識を更新し、課題設定から解決まで主体的にドライブ。"
              },
              {
                title: "知見共有と教育設計",
                body: "登壇や資料化を通じて複雑なサーバーレス構成を分かりやすく伝え、組織全体に展開。"
              },
              {
                title: "AWSサーバーレス×自動化",
                body: "アーキテクチャ設計とCI/CD・運用自動化を組み合わせ、継続的な改善が可能な体制を構築。"
              }
            ].map((highlight) => (
              <Box key={highlight.title} bg="gray.50" borderRadius="lg" p={5} borderWidth="1px" borderColor="gray.100" boxShadow="xs">
                <Heading as="h3" size="sm" mb={2} color="teal.700">
                  {highlight.title}
                </Heading>
                <Text fontSize="sm" color="gray.700">
                  {highlight.body}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>

      <div ref={projectsRef}>
        <Container as="section" id="projects" maxW="1200px" px={8} mb={12}>
          <Heading as="h2" size="md" mb={4}>
            PROJECTS
          </Heading>
          <Text fontSize="sm" color="teal.600" mb={2}>
            AWS移行／サーバーレス開発／技術研修／自動化／システム設計レビューなど多様なPJ経験
          </Text>
          <Box overflowX="auto" pb={2}>
            <HStack spacing={6} align="stretch" minW="fit-content">
              {projects.map((project) => (
                <Box key={project.id} minW={{ base: "280px", md: "320px" }} maxW="320px">
                  <ProjectCard project={project} />
                </Box>
              ))}
            </HStack>
          </Box>
        </Container>
      </div>

      <div ref={outputRef}>
        <Container as="section" id="output" maxW="1200px" px={8} mb={12}>
          <Heading as="h2" size="md" mb={4}>
            OUTPUT
          </Heading>
          <Text fontSize="sm" color="teal.600" mb={2}>
            技術研修資料・登壇資料・社内外向けナレッジ共有実績
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm">
              <Text fontWeight="bold" mb={2}>
                最新事例!AWS Lambdaを使った サーバレスのアプリケーション開発
              </Text>
              <Link
                href="https://www.exa-corp.co.jp/technews/file/EVF2018_A-2.pdf"
                color="teal.500"
                isExternal
              >
                PDFを読む
              </Link>
            </Box>
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm">
              <Text fontWeight="bold" mb={2}>
                クラウドの真骨頂！ 2時間でクラウドネイティブな 「動く」アプリを開発する
              </Text>
              <Link
                href="https://www.exa-corp.co.jp/technews/file/EVF2019_E-1.pdf"
                color="teal.500"
                isExternal
              >
                PDFを読む
              </Link>
            </Box>
          </SimpleGrid>
        </Container>
      </div>

      <Footer />
    </Box>
  );
};

export default HomePageClient;
