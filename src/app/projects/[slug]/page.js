import { getProjectData, getAllProjectSlugs } from '@/lib/markdown';
import { getNotionPosts, getNotionPostBlocks } from '@/lib/notion';
import NotionRenderer from '@/components/NotionRenderer';
import Link from 'next/link';

export const revalidate = 60; // ISR support (if deployed to Vercel/similar), otherwise static

export async function generateStaticParams() {
  const localSlugs = getAllProjectSlugs();
  const notionPosts = await getNotionPosts();
  const notionSlugs = notionPosts.map(post => post.slug);
  
  const allSlugs = [...localSlugs, ...notionSlugs];
  
  return allSlugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function Project({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Try to load as a local markdown project first
  const localSlugs = getAllProjectSlugs();
  const isLocal = localSlugs.includes(slug);
  
  let projectData = null;
  let notionBlocks = null;
  
  if (isLocal) {
    projectData = await getProjectData(slug);
  } else {
    // If not local, fetch from Notion
    const notionPosts = await getNotionPosts();
    const notionPost = notionPosts.find(p => p.slug === slug);
    
    if (!notionPost) {
      return (
        <main className="container">
          <Link href="/" className="back-link">← Back to Notebook</Link>
          <article className="project-container">
            <h1>404 - Post Not Found</h1>
            <p>The requested post could not be found.</p>
          </article>
        </main>
      );
    }
    
    projectData = notionPost;
    notionBlocks = await getNotionPostBlocks(notionPost.id);
  }
  
  return (
    <main className="container">
      <Link href="/" className="back-link">← Back to Notebook</Link>
      <article className="project-container">
        <h1>{projectData.title}</h1>
        <div className="project-meta">{projectData.date}</div>
        
        {isLocal ? (
          <div 
            className="project-content"
            dangerouslySetInnerHTML={{ __html: projectData.contentHtml }} 
          />
        ) : (
          <div className="project-content">
            <NotionRenderer blocks={notionBlocks} />
          </div>
        )}
        
        {projectData.type === 'project' && projectData.link && (
          <div className="project-link-wrapper">
            <a href={projectData.link} target="_blank" rel="noopener noreferrer" className="external-link-btn">
              Visit Project ↗
            </a>
          </div>
        )}
      </article>
    </main>
  );
}
