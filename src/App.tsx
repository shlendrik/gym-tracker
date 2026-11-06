import { Route, Routes } from "react-router-dom";
import ProgressPage from "./pages/ProgressPage";
import TemplatesPage from "./pages/TemplatesPage";
import WorkoutPage from "./pages/WorkoutPage";
import TabBar from "./ui/TabBar";

export default function App() {
  return (
    <div className="app">
      <main className="content">
        <Routes>
          <Route path="/" element={<WorkoutPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<WorkoutPage />} />
        </Routes>
      </main>
      <TabBar />
    </div>
  );
}
