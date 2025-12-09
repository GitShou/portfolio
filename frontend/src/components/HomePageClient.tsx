"use client";

import {
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
import React, { useMemo, useRef } from "react";
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
  const techIcons = useMemo(() => {
    const seen = new Set<string>();
    const sortedProjects = [...projects].sort((a, b) => {
      const aId = Number(a.id);
      const bId = Number(b.id);
      if (!Number.isNaN(aId) && !Number.isNaN(bId)) {
        return aId - bId;
      }
      return String(a.id).localeCompare(String(b.id));
    });

    const icons: { src: string; alt: string }[] = [];
    sortedProjects.forEach((project) => {
      project.techStack?.forEach((tech) => {
        const src = tech.icon?.trim();
        if (!src || seen.has(src)) {
          return;
        }
        seen.add(src);
        icons.push({ src, alt: tech.name || src });
      });
    });

    return icons;
  }, [projects]);

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
        px={{ base: 4, md: 8 }}
        py={12}
        bg="gray.800"
        color="white"
        borderRadius="xl"
        display="flex"
        justifyContent="center"
      >
        <Box maxW="720px" w="full">
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
              研修講師経験を活かし、延べ150名以上を対象とした技術研修の企画・実施実績があります。
              <br />
              複雑なAWS認証などの技術課題も、分かりやすい資料作成を通じて組織へ還元しています。
              <br />
              プロジェクトリーダー・フリーランス・大手勤務の多様な経験があります。
            </Text>
            <Text fontSize="sm" color="teal.200" mb={2}>
              「未知を既知に変える」――技術力と伝える力で、組織や現場に新しい価値をもたらします。
            </Text>
            <HStack spacing={4} flexWrap="wrap">
              <Button colorScheme="teal" variant="solid" onClick={scrollToProjects}>
                プロジェクト
              </Button>
              <Button colorScheme="whiteAlpha" variant="outline" onClick={scrollToOutput}>
                アウトプット
              </Button>
            </HStack>
        </Box>
      </Container>

  <Container as="section" id="portfolio-project" maxW="1200px" px={{ base: 4, md: 8 }} mb={12}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={{ base: 8, md: 12 }}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          px={{ base: 4, md: 0 }}
          p={{ base: 6, md: 10 }}
        >
          <Box flex="1">
            <Heading as="h2" size="md" mb={4} color="teal.700">
              技術ポートフォリオサイト開発の舞台裏
            </Heading>
            <Text mb={4} color="gray.700" fontSize="sm">
              このサイトは私の現時点(2025年11月)での技術力を端的に証明するために、AWS サーバーレス基盤を活用したフルマネージド構成で構築しています。<br />
              自動化を最優先した作りになっており、デプロイの際に手動での介入を一切排除しています。<br />
              フルスクラッチで開発されており、着手開始からWebサイト公開までの時間はトータルで100時間程度です。<br />
              それ以降も空白の時間を見つけては、Webサイトとしての最適化に向けて改善を続けています。
            </Text>
            <Text mb={6} color="gray.600" fontSize="sm">
              アーキテクチャ図と実装の詳細、得られた知見はプロジェクトページにまとめています。ぜひご覧ください。
            </Text>
            <HStack spacing={3} mt={4} flexWrap="wrap">
              <Button
                as={Link}
                href="/projects/1"
                colorScheme="teal"
                variant="solid"
                w={{ base: "full", sm: "auto" }}
              >
                プロジェクト詳細を見る
              </Button>
              <Button
                as={Link}
                href="https://github.com/GitShou/portfolio"
                colorScheme="teal"
                variant="outline"
                isExternal
                w={{ base: "full", sm: "auto" }}
              >
                GitHubでソースコードを見る
              </Button>
            </HStack>
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

  <Container as="section" id="about" maxW="1200px" px={{ base: 4, md: 8 }} mb={12}>
        <Flex align="flex-start" gap={12}>
          <Box flex="1">
            <Heading as="h2" size="md" mb={4}>
              ABOUT ME
            </Heading>
            <Text mb={2} fontSize="sm" color="gray.600" lineHeight="1.9">
              AWSサーバーレスとクラウド設計を専門とするフルスタックエンジニア。
              <br />
              未開拓技術の導入から研修設計まで担い、延べ150名超へ登壇した実績あり。
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
              {techIcons.map((icon) => (
                <Box
                  key={icon.src}
                  bg="white"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minW="48px"
                  minH="48px"
                  m={1}
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    boxSize="48px"
                    borderRadius="full"
                    bg="white"
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

  <Container as="section" id="highlights" maxW="1200px" px={{ base: 4, md: 8 }} mb={12}>
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
                title: "強力な自走力と探求力",
                body: "本Webページをフルスタックで一人で開発し、未知の技術や課題に対しても自ら学び、最適な解決策をAIなどの技術も駆使しながら一人で模索しました。"
              },
              {
                title: "未知領域への適応力",
                body: "未経験分野でも積極的に探究し、その場限りの理解で済ませず、応用します。"
              },
              {
                title: "自身の領域だけに留まらない広い視野",
                body: "システムの構造を俯瞰的に捉え、専門外の領域に関する技術でも積極的に学び、最適な構造を見出します。"
              },
              {
                title: "知見共有と教育設計",
                body: "登壇や資料化を通じて複雑なサーバーレス構成を分かりやすく伝え、組織全体に展開することを惜しみません。"
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
  <Container as="section" id="projects" maxW="1200px" px={{ base: 4, md: 8 }} mb={12}>
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
  <Container as="section" id="output" maxW="1200px" px={{ base: 4, md: 8 }} mb={12}>
          <Heading as="h2" size="md" mb={4}>
            OUTPUT
          </Heading>
          <Text fontSize="sm" color="teal.600" mb={2}>
            ソースコード・技術研修資料・登壇資料・社内外向けナレッジ共有実績
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm">
              <Text fontWeight="bold" mb={2}>
                本WebシステムのGitHubリポジトリ
              </Text>
              <Link
                href="https://github.com/GitShou/portfolio"
                color="teal.500"
                isExternal
              >
                GitHubリポジトリを見る
              </Link>
            </Box>
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
