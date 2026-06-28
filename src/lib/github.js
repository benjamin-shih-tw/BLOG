export async function getGithubProjects(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      // In Next.js App Router, fetch requests are cached by default, but we can set revalidate 
      // if we want it to update occasionally, though for a static export this runs at build time.
    });
    
    if (!res.ok) {
      console.error('Failed to fetch github projects');
      return [];
    }

    const repos = await res.json();
    
    // Filter out forks and map to a unified structure
    return repos
      .filter(repo => !repo.fork)
      .map(repo => ({
        id: repo.id.toString(),
        title: repo.name,
        description: repo.description || 'No description provided.',
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
        source: 'github'
      }));
  } catch (error) {
    console.error('Error fetching github projects:', error);
    return [];
  }
}
