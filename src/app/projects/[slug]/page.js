import { getProjectData, getAllProjectSlugs } from '@/lib/markdown';

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function Project({ params }) {
  const resolvedParams = await params;
  const projectData = await getProjectData(resolvedParams.slug);
  
  return (
    <article className="project-container">
      <h1>{projectData.title}</h1>
      <div className="project-meta">{projectData.date}</div>
      <div 
        className="project-content"
        dangerouslySetInnerHTML={{ __html: projectData.contentHtml }} 
      />
    </article>
  );
}
