import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgentWidget from './components/AgentWidget';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Equipment from './pages/Equipment';
import EquipmentSEND from './pages/EquipmentSEND';
import EquipmentSchools from './pages/EquipmentSchools';
import SafetyMethodology from './pages/SafetyMethodology';
import AITraining from './pages/AITraining';
import AITrainingFree from './pages/AITrainingFree';
import AITrainingPaid from './pages/AITrainingPaid';
import AITrainingTeachers from './pages/AITrainingTeachers';
import AITrainingParents from './pages/AITrainingParents';
import AITrainingStudents from './pages/AITrainingStudents';
import AITrainingSEND from './pages/AITrainingSEND';
import AITrainingLeaders from './pages/AITrainingLeaders';
import PromptsHub from './pages/PromptsHub';
import PromptsLibrary from './pages/PromptsLibrary';
import PromptsCategory from './pages/PromptsCategory';
import PromptsPack from './pages/PromptsPack';
import PromptsTeachers from './pages/PromptsTeachers';
import PromptsSchoolLeaders from './pages/PromptsSchoolLeaders';
import PromptsSENCO from './pages/PromptsSENCO';
import PromptsParents from './pages/PromptsParents';
import PromptsStudents from './pages/PromptsStudents';
import PromptsAdmin from './pages/PromptsAdmin';
import AIEquipment from './pages/AIEquipment';
import AIEquipmentTeachers from './pages/AIEquipmentTeachers';
import AIEquipmentSchools from './pages/AIEquipmentSchools';
import AIEquipmentParents from './pages/AIEquipmentParents';
import AIEquipmentStudents from './pages/AIEquipmentStudents';
import AIEquipmentSEND from './pages/AIEquipmentSEND';
import AIEquipmentCompare from './pages/AIEquipmentCompare';
import AIEquipmentCategory from './pages/AIEquipmentCategory';
import AIEquipmentProduct from './pages/AIEquipmentProduct';
import WhoWeAre from './pages/WhoWeAre';
import Schools from './pages/Schools';

const App = () => (
  <>
    <ScrollToTop />

    {/* Skip link — first focusable element on every page, visible on keyboard focus */}
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>

    <Navbar />

    {/*
      id="main-content" is the skip-link target.
      tabIndex={-1} allows programmatic focus without showing a browser focus ring.
    */}
    <main id="main-content" tabIndex={-1} role="main">
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/tools"     element={<Tools />} />

        {/* Old equipment routes → redirect to new hub */}
        <Route path="/equipment"         element={<Navigate to="/ai-equipment" replace />} />
        <Route path="/equipment/send"    element={<Navigate to="/ai-equipment/send" replace />} />
        <Route path="/equipment/schools" element={<Navigate to="/ai-equipment/schools" replace />} />

        {/* Keep old pages accessible under legacy paths for any internal links not yet updated */}
        <Route path="/equipment-legacy"         element={<Equipment />} />
        <Route path="/equipment-legacy/send"    element={<EquipmentSEND />} />
        <Route path="/equipment-legacy/schools" element={<EquipmentSchools />} />

        {/* New AI Equipment hub */}
        <Route path="/ai-equipment"                        element={<AIEquipment />} />
        <Route path="/ai-equipment/teachers"               element={<AIEquipmentTeachers />} />
        <Route path="/ai-equipment/schools"                element={<AIEquipmentSchools />} />
        <Route path="/ai-equipment/parents"                element={<AIEquipmentParents />} />
        <Route path="/ai-equipment/students"               element={<AIEquipmentStudents />} />
        <Route path="/ai-equipment/send"                   element={<AIEquipmentSEND />} />
        <Route path="/ai-equipment/compare"                element={<AIEquipmentCompare />} />
        <Route path="/ai-equipment/category/:categorySlug" element={<AIEquipmentCategory />} />
        <Route path="/ai-equipment/product/:productSlug"   element={<AIEquipmentProduct />} />

        <Route path="/training"             element={<Navigate to="/ai-training" replace />} />
        <Route path="/ai-training"          element={<AITraining />} />
        <Route path="/ai-training/free"     element={<AITrainingFree />} />
        <Route path="/ai-training/paid"     element={<AITrainingPaid />} />
        <Route path="/ai-training/teachers" element={<AITrainingTeachers />} />
        <Route path="/ai-training/parents"  element={<AITrainingParents />} />
        <Route path="/ai-training/students" element={<AITrainingStudents />} />
        <Route path="/ai-training/send"     element={<AITrainingSEND />} />
        <Route path="/ai-training/leaders"  element={<AITrainingLeaders />} />
        <Route path="/safety-methodology"   element={<SafetyMethodology />} />
        <Route path="/prompts"                        element={<PromptsHub />} />
        <Route path="/prompts/library"                element={<PromptsLibrary />} />
        <Route path="/prompts/category/:categorySlug" element={<PromptsCategory />} />
        <Route path="/prompts/pack/:packSlug"         element={<PromptsPack />} />
        <Route path="/prompts/teachers"               element={<PromptsTeachers />} />
        <Route path="/prompts/school-leaders"         element={<PromptsSchoolLeaders />} />
        <Route path="/prompts/senco"                  element={<PromptsSENCO />} />
        <Route path="/prompts/parents"                element={<PromptsParents />} />
        <Route path="/prompts/students"               element={<PromptsStudents />} />
        <Route path="/prompts/admin"                  element={<PromptsAdmin />} />
        <Route path="/who-we-are"                     element={<WhoWeAre />} />
        <Route path="/schools"                        element={<Schools />} />
        <Route path="/for-schools"                    element={<Navigate to="/schools" replace />} />
      </Routes>
    </main>

    <Footer />
    <AgentWidget />
    <CookieBanner />
  </>
);

export default App;
