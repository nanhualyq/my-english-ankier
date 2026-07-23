import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle";
import ReadSkill from "./pages/ReadSkill";
import ListenSkill from "./pages/ListenSkill";
import SpeakSkill from "./pages/SpeakSkill";
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
			<Route path="/read-skill/:id" element={<ReadSkill />} />
			<Route path="/listen-skill/:id" element={<ListenSkill />} />
			<Route path="/speak-skill/:id" element={<SpeakSkill />} />
			<Route path="/write-skill/:id" element={<WriteSkill />} />
		</Routes>
		</>
	);
}

export default App;
