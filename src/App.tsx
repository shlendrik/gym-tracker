import { Route, Routes } from "react-router-dom";
import HistoryPage from "./pages/HistoryPage";
import TemplateEditor from "./pages/TemplateEditor";
import TemplatesPage from "./pages/TemplatesPage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";
import WorkoutPage from "./pages/WorkoutPage";
import WorkoutSavedPage from "./pages/WorkoutSavedPage";
import TabBar from "./ui/TabBar";

export default function App() {
  return (
    <div className="app">
      <main className="content">
        <Routes>
          <Route path="/" element={<WorkoutPage />} />
          <Route path="/saved/:id" element={<WorkoutSavedPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/templates/new" element={<TemplateEditor />} />
          <Route path="/templates/:id" element={<TemplateEditor />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<WorkoutDetailPage />} />
          <Route path="*" element={<WorkoutPage />} />
        </Routes>
      </main>
      <TabBar />
    </div>
  );
}
