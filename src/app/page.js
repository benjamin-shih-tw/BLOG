import { getSortedProjectsData } from "@/lib/markdown";
import { getNotionPosts } from "@/lib/notion";
import PortfolioFilter from "@/components/PortfolioFilter";

export const revalidate = 60; // revalidate every 60 seconds (ISR) for Notion posts

export default async function Home() {
	const localProjects = getSortedProjectsData();
	const notionPosts = await getNotionPosts();

	// Merge and sort all projects by date
	const allProjects = [...localProjects, ...notionPosts].sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});

	// 分類邏輯：如果 type 是 'project' 就歸類在 GitHub Projects，其他預設為 Blog
	const blogPosts = allProjects.filter((p) => p.type !== "project");
	const githubProjects = allProjects.filter((p) => p.type === "project");

	return (
		<main className="container">
			<header className="header">
				<h1>
					Write notes that <span className="accent-red">stick</span>,<br />
					plan weeks that run.
				</h1>
				<p>This notebook saves my projects, notes. Made for a developer<br/>who thinks in pencil and ink.</p>

				<div className="sticky-note">
					<h2>Hey there!</h2>
					<p>
						This is my personal notebook. Grab a coffee, ignore the scribbles,
						and check out my projects.
					</p>
				</div>
			</header>

			<PortfolioFilter
				localProjects={blogPosts}
				githubProjects={githubProjects}
			/>
		</main>
	);
}
