// src/app/page.tsx

// 1. ローカルデータを定義したファイルからデータをインポート
import { PROJECTS_DATA } from '../lib/data'; 
import { Box, SimpleGrid, Heading, ChakraProvider } from '@chakra-ui/react';
import ProjectCard from '../components/ProjectCard'; 

// ページコンポーネントは同期関数として定義し直します
export default function Home() { 
  // APIからの取得ではなく、インポートしたローカルデータを直接使用
  const projects = PROJECTS_DATA; 
  
  return (
      <Box p={8}>
        <Heading as="h2" size="xl" mb={6}>Projects</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
          {/* ローカルデータをマップしてカードを表示 */}
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} /> 
          ))}
        </SimpleGrid>
      </Box>
  );
}