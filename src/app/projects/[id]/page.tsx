import { PROJECTS_DATA } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Container,
  Box,
  Heading,
  Text,
  HStack,
  Tag,
  VStack,
  Divider,
  SimpleGrid,
  Alert,
  AlertIcon,
  List,
  ListItem,
  Code,
  Image,
} from "@chakra-ui/react";

type Props = {
  params: { id: string };
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = params;
  const project = PROJECTS_DATA.find((p) => String(p.id) === id);

  if (!project || !project.detail) return notFound();

  return (
    <Container maxW="container.lg" py={10}>
      {/* 1. ページヘッダー */}
      <VStack align="start" spacing={4} mb={8}>
        <Heading as="h1" size="lg" color="teal.700">
          【R&D実績】サーバレスアーキテクチャによる大規模社内システムのリプレースと課題解決
        </Heading>
        <Text fontSize="md" color="gray.700">
          既存システムの老朽化に対し、AWS Lambdaをコアとした
          <strong>フルサーバレス</strong>でのリプレースを主導。チャットボットとWebアプリの二軸提供、および
          <strong>複雑な認証・パフォーマンス課題</strong>を自力で解決したR&D事例。
        </Text>
        <HStack spacing={2}>
          {project.techStack.map((tech) => (
            <Tag key={tech} colorScheme="teal" variant="solid">
              {tech}
            </Tag>
          ))}
        </HStack>
      </VStack>

      <Divider my={6} />

      {/* 2. 課題と解決策 */}
      <Box mb={10}>
        <Heading as="h2" size="md" color="teal.600" mb={4}>
          自走した課題解決：妥協しない根本原因の追究
        </Heading>
        <VStack align="start" spacing={6}>
          {project.detail.challenges.map((c: any, i: number) => (
            <Box key={i}>
              <Heading as="h3" size="sm" color="gray.700" mb={1}>
                {c.title}
              </Heading>
              <Text fontSize="sm" color="gray.600" mb={1}>
                <strong>課題:</strong> {c.description}
              </Text>
              <Text fontSize="sm" color="gray.600">
                <strong>解決策:</strong> {c.solution}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>

      <Divider my={6} />

      {/* 3. システムアーキテクチャ */}
      <Box mb={10}>
        <Heading as="h2" size="md" color="teal.600" mb={4}>
          システムアーキテクチャとセキュリティ
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={4}>
          <Box>
            {/* アーキテクチャ図（画像パスは適宜差し替え） */}
            <Image
              src="/images/architecture.png"
              alt="アーキテクチャ図"
              borderRadius="md"
              mb={2}
            />
            <Text fontSize="xs" color="gray.500">
              ※アーキテクチャ図はイメージです
            </Text>
          </Box>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">主要構成:</Text>
            <List spacing={1} fontSize="sm">
              <ListItem>
                認証・認可: Cognito + G Suite (Google OpenID Connect)
              </ListItem>
              <ListItem>API層: API Gateway</ListItem>
              <ListItem>コンピューティング層: Lambda</ListItem>
              <ListItem>データ層: DynamoDB</ListItem>
            </List>
            <Alert status="info" variant="left-accent" mt={2}>
              <AlertIcon />
              WAF/CloudFront/API Gatewayによる多層的なアクセス制御とG Suite認証で堅牢なセキュリティを実現
            </Alert>
          </VStack>
        </SimpleGrid>
      </Box>

      <Divider my={6} />

      {/* 4. 自動化と成果 */}
      <Box mb={10}>
        <Heading as="h2" size="md" color="teal.600" mb={4}>
          自動化と成果・知見の還元
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={4}>
          <Box>
            {/* CI/CDフロー図（画像パスは適宜差し替え） */}
            <Image
              src="/images/cicd.png"
              alt="CI/CDフロー図"
              borderRadius="md"
              mb={2}
            />
            <Text fontSize="xs" color="gray.500">
              ※CI/CDフロー図はイメージです
            </Text>
          </Box>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">IaCによる自動化:</Text>
            <Code
              fontSize="sm"
              p={2}
              borderRadius="md"
              colorScheme="teal"
              whiteSpace="pre-line"
            >
              {`CodeCommit → CodePipeline → CodeBuild → CloudFormation\nStaging/Productionの複数環境デプロイを自動化`}
            </Code>
            <Text fontWeight="bold" mt={2}>
              成果:
            </Text>
            <List spacing={1} fontSize="sm">
              {project.detail.outcomes.map((o: string, i: number) => (
                <ListItem key={i}>{o}</ListItem>
              ))}
            </List>
            <Text fontWeight="bold" mt={2}>
              知見の還元:
            </Text>
            <List spacing={1} fontSize="sm">
              <ListItem>
                本プロジェクトの内容を「AWS Lambdaを使った サーバレスのアプリケーション開発」として資料化し、社外フォーラムで発表。
                <br />
                複雑な技術課題を体系的に整理し、他者に分かりやすく伝えるスキルも証明。
              </ListItem>
            </List>
          </VStack>
        </SimpleGrid>
      </Box>
    </Container>
  );
}
