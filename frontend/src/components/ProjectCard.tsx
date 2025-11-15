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

const CARD_HEIGHTS = {
    regular: "550px",
    compact: "400px",
} as const;

const ProjectCard = ({ project }: ProjectProps) => {
    const cardSize = project.cardSize === "compact" ? "compact" : "regular";
    const visibleTechStack = project.techStack.filter(
        (tech) => Boolean(tech.icon && tech.icon.trim() !== "")
    );

    return (
        <Card
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            height={{ base: "auto", md: CARD_HEIGHTS[cardSize] }}
            display="flex"
            flexDirection="column"
            data-card-size={cardSize}
        >
                    <CardHeader pb={2}>
                        <Heading size="md" mb={2}>
                    {project.title}
                </Heading>
            </CardHeader>
            <CardBody display="flex" flexDirection="column" gap={3} flex="1">
                <Text fontSize="sm" whiteSpace="pre-line" flex="1">
                    {project.summary}
                </Text>
                        {visibleTechStack.length > 0 ? (
                            <Box>
                                <Text fontSize="xs" color="gray.500" fontWeight="bold">
                                    Tech Stack:
                                </Text>
                                <SimpleGrid columns={3} spacing={1} mt={2} justifyItems="center">
                                    {visibleTechStack.map((tech) => (
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
                                                    bg="white"
                                                />
                                            </Box>
                                        </Tag>
                                    ))}
                                </SimpleGrid>
                            </Box>
                        ) : null}
                {project.hasOwnProperty("detail") && project.detail ? (
                    <Box mt="auto">
                        <Link href={`/projects/${project.id}`} data-testid="project-detail-link">
                            <Button colorScheme="teal" size="sm">
                                詳細を見る
                            </Button>
                        </Link>
                    </Box>
                ) : null}
            </CardBody>
        </Card>
    );
};

export default ProjectCard;