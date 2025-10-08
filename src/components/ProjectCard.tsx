// src/components/ProjectCard.tsx

import { Heading, Text, Box } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';

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
                {/* 技術スタックの表示ロジックは後で追加してもOK */}
            </CardBody>
        </Card>);
};

export default ProjectCard;