import Calendar from "../components/calendar";
import Contact from "../components/contactform";

export default async function Home() {
	return (
		<main className="flex flex-col items-center justify-center p-8">
			<div className="flex flex-col items-center gap-4">
				<h1 className="text-7xl">Hello</h1>
				<p>You are logged in as...</p>
			</div>
			<Contact />
			<Calendar />
		</main>
	);
}
