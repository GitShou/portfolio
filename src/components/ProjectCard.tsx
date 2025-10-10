// src/components/ProjectCard.tsx

import { Heading, Text, Box, VStack, Avatar, Image, SimpleGrid } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import Link from "next/link";
import { Button } from "@chakra-ui/react";

// プロジェクトのデータ構造を定義します (page.tsxからデータを受け取るための型)
interface ProjectProps {
    project: {
        id: number;
        title: string;
        summary: string;
        techStack: { name: string; icon: string }[];
    };
}

const ProjectCard = ({ project }: ProjectProps) => {
    return (
        <Card p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <CardHeader>
                <Heading size="md" mb={2}>{project.title}</Heading>
            </CardHeader>
            <CardBody>
                <Text fontSize="sm">{project.summary}</Text>
                {/* 技術スタックの表示を追加 */}
                <Box mt={3}>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">Tech Stack:</Text>
                    <SimpleGrid
                        columns={3}
                        spacingY={2}
                        spacingX={1}
                        mt={1}
                        mb={2}
                        width="100%"
                        justifyItems="center"
                    >
                        {project.techStack.map((tech, idx) => (
                            <VStack
                                key={tech.name + idx}
                                spacing={1}
                                minW="64px"
                                maxW="80px"
                                align="center"
                            >
                                {tech.icon ? (
                                    <Box
                                        boxSize="32px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        bg="gray.100"
                                        borderRadius="full"
                                        boxShadow="sm"
                                        border="1px solid #e2e8f0"
                                    >
                                        <Image
                                            src={tech.icon}
                                            alt={tech.name}
                                            boxSize="20px"
                                            objectFit="contain"
                                            borderRadius="full"
                                        />
                                    </Box>
                                ) : (
                                    <Avatar
                                        size="sm"
                                        name={tech.name}
                                        bg="gray.200"
                                        width="32px"
                                        height="32px"
                                        fontSize="xs"
                                        boxShadow="sm"
                                        border="1px solid #e2e8f0"
                                    />
                                )}
                                <Text
                                    fontSize="xs"
                                    textAlign="center"
                                    mt={1}
                                    maxW="64px"
                                    isTruncated
                                >
                                    {tech.name}
                                </Text>
                            </VStack>
                        ))}
                    </SimpleGrid>
                </Box>
                {/* マイグレーションプロジェクトのみ詳細ページへのボタンを表示 */}
                {project.id === 1 && (
                    <Box mt={4}>
                        <Link href={`/projects/${project.id}`}>
                            <Button colorScheme="teal" size="sm">
                                詳細を見る
                            </Button>
                        </Link>
                    </Box>
                )}
            </CardBody>
        </Card>);
};

export default ProjectCard;