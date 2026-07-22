import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle";
import ReadArticle from "./pages/ReadArticle";
import ListenArticle from "./pages/ListenArticle";
import SpeakArticle from "./pages/SpeakArticle";
import WriteSkill from "./pages/WriteSkill";
import DevRibbon from "./components/DevRibbon";

function App() {
	return (
		<>
		<DevRibbon />
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/add-article" element={<AddArticle />} />
			<Route path="/edit-article/:id" element={<EditArticle />} />
			<Route path="/read-article/:id" element={<ReadArticle />} />
			<Route path="/listen-article/:id" element={<ListenArticle />} />
			<Route path="/speak-article/:id" element={<SpeakArticle />} />
			<Route path="/write-skill/:id" element={<WriteSkill />} />
		</Routes>
		</>
	);
}

export default App;
