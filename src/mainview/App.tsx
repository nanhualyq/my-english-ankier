import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle";
import ReadArticle from "./pages/ReadArticle";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/add-article" element={<AddArticle />} />
			<Route path="/edit-article/:id" element={<EditArticle />} />
			<Route path="/read-article/:id" element={<ReadArticle />} />
		</Routes>
	);
}

export default App;
