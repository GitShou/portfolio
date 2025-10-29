import HomePageClient from "../components/HomePageClient";
import { fetchProjects } from "@/lib/projects/api";

export default async function Home() {
  const projects = await fetchProjects();
  return <HomePageClient projects={projects} />;
}