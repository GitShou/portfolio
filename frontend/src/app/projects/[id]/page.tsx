import { notFound } from "next/navigation";
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
  Link
} from "@chakra-ui/react";
import { fetchProjectById, fetchProjects } from "@/lib/projects/api";
import { Project } from "@/lib/projects/types";

export const dynamicParams = false;


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
  if (!project || !project.detail) return notFound();
  const { sections, role, pdf } = project.detail;

  const renderBody = (body?: string) => {
    if (!body) return null;
    return body.split("\n").map((line, index) => (
      <Text key={`${line}-${index}`} mt={index === 0 ? 4 : 2} fontSize="lg" color="gray.700">
        {line}
      </Text>
    ));
  };

  return (
    <Container maxW="6xl" py={12}>
      {/* ヘッダー・概要・技術スタック */}
      <VStack spacing={4} align="stretch" mb={10}>
        <Heading as="h1" size="2xl" color="teal.600">
          {project.title}
        </Heading>
        <Text fontSize="xl" color="gray.600">
          {project.summary}
        </Text>
        {role && (
          <Box mt={2}>
            <Text fontWeight="bold" color="gray.700">
              役割
            </Text>
            <Text>{role}</Text>
          </Box>
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
      <VStack spacing={12} align="stretch">
        {sections.map((section, index) => {
          const sectionHeading = section.heading ?? section.title;
          return (
            <Box key={`${sectionHeading ?? "section"}-${index}`}>
              {sectionHeading && (
                <Heading as="h2" size="xl" mb={section.summary ? 2 : 4}>
                  {sectionHeading}
                </Heading>
              )}
            {section.summary && (
              <Text fontSize="lg" color="gray.500" mb={4}>
                {section.summary}
              </Text>
            )}
            {renderBody(section.body)}
            {section.list && section.list.length > 0 && (
              <UnorderedList spacing={2} pl={4} fontSize="lg" mt={section.body ? 4 : 2}>
                {section.list.map((item) => (
                  <ListItem key={item} fontWeight="semibold">
                    {item}
                  </ListItem>
                ))}
              </UnorderedList>
            )}
            {section.details && section.details.length > 0 && (
              <SimpleGrid
                columns={{ base: 1, md: Math.min(section.details.length, 2), lg: Math.min(section.details.length, 3) }}
                spacing={6}
                mt={6}
              >
                {section.details.map((detail) => (
                  <Box key={detail.heading} p={6} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
                    <Heading as="h3" size="md" mb={2} color="teal.600">
                      {detail.heading}
                    </Heading>
                    <Text color="gray.700">{detail.body}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            )}
            {section.image && (
              <Box mt={6}>
                <Box border="1px solid" borderColor="gray.200" p={6} borderRadius="md" bg="white">
                  <Image src={section.image} alt={section.heading ?? "section image"} objectFit="contain" mx="auto" />
                </Box>
                {section.imgURL && (
                  <Link href={section.imgURL} isExternal color="teal.500" mt={3} display="inline-block">
                    高解像度の画像を開く
                  </Link>
                )}
              </Box>
            )}
            {section.more && section.more.length > 0 && (
              <VStack spacing={8} align="stretch" mt={6}>
                {section.more.map((item) => (
                  <Box key={item.title} p={6} shadow="lg" borderWidth="1px" borderRadius="lg" bg="white">
                    <Heading as="h3" size="md" mb={2} color="orange.600">
                      {item.title}
                    </Heading>
                    <Text color="gray.700">{item.description}</Text>
                  </Box>
                ))}
              </VStack>
            )}
            </Box>
          );
        })}
      </VStack>
    </Container>
  );
}