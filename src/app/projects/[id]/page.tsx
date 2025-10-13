
import { PROJECTS_DATA } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Container, Box, Heading, Text, HStack, Tag, VStack, SimpleGrid, Image, Divider, UnorderedList, ListItem, GridItem, Link as ChakraLink
} from "@chakra-ui/react";

type Props = {
  params: { id: string };
};


export default async function ProjectDetailPage({ params }: Props) {
  const { id } = params;
  const project = PROJECTS_DATA.find((p) => String(p.id) === id);
  if (!project || !project.detail) return notFound();
  const { pdf, sections, role, tasks, features, architectureUrl, improvements } = project.detail;

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
        <HStack spacing={3} wrap="wrap" pt={4}>
          {project.techStack.map((tech, idx) =>
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

      {/* 2. ポジションと業務内容 / プロジェクトの詳細 (左右分割) */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={10}>
        <GridItem>
          <Heading as="h2" size="lg" mb={4}>自分のポジションと業務内容</Heading>
          <Text fontWeight="bold" mb={2}>ポジション: {role}</Text>
          <UnorderedList spacing={1} pl={4}>
            {tasks && tasks.map((task: string, idx: number) => <ListItem key={idx}>{task}</ListItem>)}
          </UnorderedList>
        </GridItem>
        <GridItem>
          <Heading as="h2" size="lg" mb={4}>プロジェクトの詳細</Heading>
          <Text fontSize="lg">{sections?.[0]?.body || "詳細情報"}</Text>
        </GridItem>
      </SimpleGrid>
      <Divider mb={8} />
      {/* 3. システムの特徴 */}
      <Box mb={10}>
        <Heading as="h2" size="xl" mb={4}>システムの特徴</Heading>
        <UnorderedList spacing={2} pl={4} fontSize="lg">
          {features && features.map((feature: string, idx: number) => <ListItem key={idx} fontWeight="semibold">{feature}</ListItem>)}
        </UnorderedList>
      </Box>
      {/* 4. アーキテクチャ図 */}
      <Box mb={10}>
        <Heading as="h2" size="xl" mb={4}>システムアーキテクチャ図</Heading>
        <Box border="1px solid" borderColor="gray.300" p={6} borderRadius="md">
          {architectureUrl && <Image src={architectureUrl} alt="システムアーキテクチャ図" objectFit="contain" />}
          <Text align="center" mt={3} fontSize="sm" color="gray.500">（S3, CloudFront, API Gateway, Lambda, DynamoDB を中心としたサーバレス構成）</Text>
        </Box>
      </Box>
      {/* 5. 工夫点 (強みアピールの核) */}
      <Box mb={10}>
        <Heading as="h2" size="xl" mb={6}>工夫点・課題解決への貢献 💡</Heading>
        <VStack spacing={8} align="stretch">
          {improvements && improvements.map((item: { title: string; description: string }, idx: number) => (
            <Box key={idx} p={6} shadow="lg" borderWidth="1px" borderRadius="lg" bg="white">
              <Heading as="h3" size="md" mb={2} color="orange.600">{item.title}</Heading>
              <Text>{item.description}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Container>
  );
}