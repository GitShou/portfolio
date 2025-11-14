import {
  Container,
  Box,
  Heading,
  Text,
  HStack,
  Tag,
  VStack,
  SimpleGrid,
  Image,
  Divider,
  UnorderedList,
  ListItem,
  Link,
  Button,
  Icon
} from "@chakra-ui/react";
import { fetchProjectById, fetchProjects } from "@/lib/projects/api";
import { Project } from "@/lib/projects/types";

export const dynamicParams = false;


const ArrowLeftIcon = () => (
  <Icon viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M11.414 5.414a2 2 0 0 0-2.828 0l-6 6a2 2 0 0 0 0 2.828l6 6a2 2 0 1 0 2.828-2.828L9.828 14H20a2 2 0 1 0 0-4H9.828l1.586-1.586a2 2 0 0 0 0-2.828Z"
    />
  </Icon>
);

// 静的エクスポート用: 全プロジェクトIDを返す（DynamoDB/API化も容易に対応可能）
export async function generateStaticParams() {
  const projects = await fetchProjects();
  return projects.map((project) => ({ id: String(project.id) }));
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProjectDetailPage(props: any) {
  const { params } = props;
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const project: Project | null = await fetchProjectById(id);
  if (!project) {
    throw new Error(`[StaticExport] Projects API に id=${id} のデータが存在しません`);
  }

  if (!project.detail) {
    throw new Error(`[StaticExport] id=${id} の詳細情報(detail) が未設定です`);
  }
  const { sections, role, pdf } = project.detail;

  const sectionEntries = sections.map((section, index) => {
    const heading = section.heading ?? section.title ?? null;
    const anchorId = `section-${index + 1}`;
    return {
      section,
      heading,
      anchorId,
      displayLabel: heading ?? `セクション ${index + 1}`
    };
  });

  const tocItems = sectionEntries.filter((entry) => entry.heading);

  const renderBody = (body?: string) => {
    if (!body) return null;
    return (
      <Text mt={4} fontSize="lg" color="gray.700" whiteSpace="pre-line">
        {body}
      </Text>
    );
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="6xl" py={12}>
        <Box mb={6}>
          <Button
            as={Link}
            href="/"
            leftIcon={<ArrowLeftIcon />}
            variant="outline"
            colorScheme="teal"
            size="sm"
          >
            トップページへ戻る
          </Button>
        </Box>
      {/* ヘッダー・概要・技術スタック */}
      <VStack spacing={4} align="stretch" mb={10}>
        <Heading as="h1" size="2xl" color="teal.600">
          {project.title}
        </Heading>
        <Text fontSize="xl" color="gray.600" whiteSpace="pre-line">
          {project.summary}
        </Text>
        {(role || project.git) && (
          <HStack
            align={{ base: "flex-start", md: "center" }}
            spacing={{ base: 6, md: 10 }}
            flexWrap="wrap"
            mt={2}
          >
            {role && (
              <Box>
                <Text fontWeight="bold" color="gray.700">
                  役割
                </Text>
                <Text whiteSpace="pre-line">{role}</Text>
              </Box>
            )}
            {project.git && (
              <HStack align="center" spacing={3}>
                <Image src="/img/GitHub.png" alt="GitHub ロゴ" height={{ base: "28px", md: "32px" }} width="auto" />
                <Link href={project.git} color="teal.500" isExternal fontWeight="semibold">
                  {project.git}
                </Link>
              </HStack>
            )}
          </HStack>
        )}
        {pdf && (
          <Link href={pdf} color="teal.500" isExternal fontWeight="semibold">
            関連資料を開く
          </Link>
        )}
        <HStack spacing={3} wrap="wrap" pt={4}>
          {project.techStack.map((tech) =>
            tech.icon ? (
              <Tag key={tech.name} size="lg" colorScheme="blue" variant="solid">
                <HStack>
                  <Image src={tech.icon} alt={tech.name} boxSize="24px" />
                  <span>{tech.name}</span>
                </HStack>
              </Tag>
            ) : (
              <Tag key={tech.name} size="lg" colorScheme="blue" variant="solid">
                {tech.name}
              </Tag>
            )
          )}
        </HStack>
      </VStack>

        <Divider mb={8} />
        {tocItems.length > 0 && (
          <Box
            mb={10}
            borderWidth="1px"
            borderRadius="lg"
            p={{ base: 6, md: 8 }}
            bg="white"
            shadow="md"
          >
            <Heading as="h3" size="md" mb={4} color="gray.700">
              目次
            </Heading>
            <VStack align="stretch" spacing={2}>
              {tocItems.map(({ anchorId, displayLabel }) => (
                <Link key={anchorId} href={`#${anchorId}`} color="teal.600" fontWeight="semibold">
                  {displayLabel}
                </Link>
              ))}
            </VStack>
          </Box>
        )}

        <VStack spacing={12} align="stretch">
          {sectionEntries.map(({ section, heading, anchorId, displayLabel }, index) => (
            <Box
              key={`${anchorId}-${index}`}
              id={anchorId}
              scrollMarginTop={{ base: 20, md: 28 }}
              p={{ base: 6, md: 8 }}
              bg="white"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="gray.100"
              boxShadow="sm"
            >
              <Heading as="h2" size="xl" mb={section.summary ? 2 : 4}>
                {heading ?? displayLabel}
              </Heading>
              {section.summary && (
                <Text fontSize="lg" color="gray.500" mb={4} whiteSpace="pre-line">
                  {section.summary}
                </Text>
              )}

              {renderBody(section.body)}

              {section.list && section.list.length > 0 && (
                <UnorderedList spacing={2} pl={4} fontSize="lg" mt={section.body ? 4 : 2}>
                  {section.list.map((item) => (
                    <ListItem key={item} fontWeight="semibold" whiteSpace="pre-line">
                      {item}
                    </ListItem>
                  ))}
                </UnorderedList>
              )}

              {section.details && section.details.length > 0 && (
                <SimpleGrid
                  columns={{
                    base: 1,
                    md: Math.min(section.details.length, 2),
                    lg: Math.min(section.details.length, 3)
                  }}
                  spacing={6}
                  mt={6}
                >
                  {section.details.map((detail) => (
                    <Box key={detail.heading} p={6} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
                      <Heading as="h3" size="md" mb={2} color="teal.600">
                        {detail.heading}
                      </Heading>
                      <Text color="gray.700" whiteSpace="pre-line">
                        {detail.body}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              )}

              {section.image && (
                <Box mt={6}>
                  <Box border="1px solid" borderColor="gray.200" p={6} borderRadius="md" bg="white">
                    <Image
                      src={section.image}
                      alt={section.heading ?? section.title ?? "section image"}
                      objectFit="contain"
                      mx="auto"
                    />
                  </Box>
                  {section.imgURL && (
                    <Link href={section.imgURL} isExternal color="teal.500" mt={3} display="inline-block">
                      高解像度の画像を開く
                    </Link>
                  )}
                </Box>
              )}

              {section.good && section.good.length > 0 && (
                <Box mt={12}>
                  <Box mb={6}>
                    <HStack spacing={3} align="center">
                      <Heading as="h3" size="lg" letterSpacing="wide" textTransform="uppercase" color="orange.500">
                        Point
                      </Heading>
                      <Image src="/img/good.png" alt="成果ハイライト" boxSize={{ base: "40px", md: "48px" }} pointerEvents="none" />
                    </HStack>
                    <Box borderBottomWidth="3px" borderColor="gray.800" mt={2} />
                  </Box>
                  <VStack spacing={6} align="stretch">
                    {section.good.map((item) => (
                      <Box key={item.title} p={{ base: 6, md: 7 }} shadow="lg" borderWidth="1px" borderRadius="xl" bg="white">
                        <Heading as="h4" size="md" mb={2} color="orange.600">
                          {item.title}
                        </Heading>
                        <Text color="gray.700" whiteSpace="pre-line">
                          {item.description}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              {section.more && section.more.length > 0 && (
                <Box mt={12}>
                  <Box mb={6}>
                    <HStack spacing={3} align="center">
                      <Heading as="h3" size="lg" letterSpacing="wide" textTransform="uppercase" color="blue.500">
                        More
                      </Heading>
                      <Image src="/img/more.png" alt="改善ポイント" boxSize={{ base: "40px", md: "48px" }} pointerEvents="none" />
                    </HStack>
                    <Box borderBottomWidth="3px" borderColor="gray.800" mt={2} />
                  </Box>
                  <VStack spacing={6} align="stretch">
                    {section.more.map((item) => (
                      <Box key={item.title} p={{ base: 6, md: 7 }} shadow="lg" borderWidth="1px" borderRadius="xl" bg="white">
                        <Heading as="h4" size="md" mb={2} color="blue.600">
                          {item.title}
                        </Heading>
                        <Text color="gray.700" whiteSpace="pre-line">
                          {item.description}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}