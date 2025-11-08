// src/components/ProjectCard.tsx

import { Heading, Text, Box, Image, SimpleGrid, Tag } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { Project } from "@/lib/projects/types";

// プロジェクトのデータ構造を定義します (page.tsxからデータを受け取るための型)
interface ProjectProps {
    project: Project;
}

const ProjectCard = ({ project }: ProjectProps) => {
    return (
        <Card p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <CardHeader>
                <Heading size="md" mb={2}>{project.title}</Heading>
            </CardHeader>
            <CardBody>
                <Text fontSize="sm" whiteSpace="pre-line">{project.summary}</Text>
                {/* 技術スタックの表示を追加 */}
                <Box mt={3}>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">Tech Stack:</Text>
                    {/* 1行3個まで表示、幅を小さく・中央寄せ */}
                    <SimpleGrid columns={3} spacing={1} mt={2} justifyItems="center">
                        {project.techStack.map((tech) => (
                            <Tag
                                key={tech.name}
                                colorScheme="white"
                                variant="solid"
                                px={1}
                                py={1}
                                minW="56px"
                                minH="56px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontWeight="bold"
                                fontSize="sm"
                                borderRadius="md"
                                bg="white"
                            >
                                {tech.icon && tech.icon.trim() !== "" ? (
                                    <Box
                                        bg="white"
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        minW="48px"
                                        minH="48px"
                                    >
                                        <Image
                                            src={tech.icon}
                                            alt={tech.name}
                                            boxSize="48px"
                                            borderRadius="full"
                                            display="inline-block"
                                            mr={0}
                                            bg="white"
                                        />
                                    </Box>
                                ) : null}
                                {/* サービス名は表示しない */}
                            </Tag>
                        ))}
                    </SimpleGrid>
                </Box>
                {/* 詳細ページへのボタンを表示（detailが存在する場合のみ） */}
                {project.hasOwnProperty("detail") && project.detail ? (
                    <Box mt={4}>
                        <Link href={`/projects/${project.id}/`}>
                            <Button colorScheme="teal" size="sm">
                                詳細を見る
                            </Button>
                        </Link>
                    </Box>
                ) : null}
            </CardBody>
        </Card>);
};

export default ProjectCard;