// src/components/ProjectCard.tsx

import { Heading, Text, Box } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import Link from "next/link";
import { Button } from "@chakra-ui/react";

// プロジェクトのデータ構造を定義します (page.tsxからデータを受け取るための型)
interface ProjectProps {
    project: {
        id: number;
        title: string;
        summary: string;
        techStack: string[];
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
                    <Text fontSize="xs" color="gray.700">
                        {project.techStack.join(', ')}
                    </Text>
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