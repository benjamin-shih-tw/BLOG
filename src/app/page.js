import { getSortedProjectsData } from '@/lib/markdown';
import { getGithubProjects } from '@/lib/github';
import PortfolioFilter from '@/components/PortfolioFilter';

export default async function Home() {
  const localProjects = getSortedProjectsData();
  const githubProjects = await getGithubProjects('benjamin-shih-tw');

  return (
    <main className="container">
      <header className="header">
        <h1>Write notes that <span className="accent-red">stick</span>,<br/>plan weeks that run.</h1>
        <p>This notebook saves my coursework, homework, and<br/>small experiments into one warm page. Made for a developer<br/>who thinks in pencil and ink.</p>
        
        <div className="sticky-note">
          <h2>Hey there!</h2>
          <p>This is my personal notebook. Grab a coffee, ignore the scribbles, and check out my projects.</p>
        </div>
      </header>

      <PortfolioFilter localProjects={localProjects} githubProjects={githubProjects} />
    </main>
  );
}
