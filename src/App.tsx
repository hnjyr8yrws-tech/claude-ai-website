import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgentWidget from './components/AgentWidget';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import LeadCaptureModal from './components/LeadCaptureModal';

// ── Eagerly loaded (above the fold on first visit) ──────────────────────────
import Home from './pages/Home';

// ── Lazy-loaded pages ───────────────────────────────────────────────────────
const Tools               = lazy(() => import('./pages/Tools'));
const ToolDetail          = lazy(() => import('./pages/ToolDetail'));
const Equipment           = lazy(() => import('./pages/Equipment'));
const EquipmentSEND       = lazy(() => import('./pages/EquipmentSEND'));
const EquipmentSchools    = lazy(() => import('./pages/EquipmentSchools'));
const SafetyMethodology   = lazy(() => import('./pages/SafetyMethodology'));
const AITraining          = lazy(() => import('./pages/AITraining'));
const AITrainingFree      = lazy(() => import('./pages/AITrainingFree'));
const AITrainingPaid      = lazy(() => import('./pages/AITrainingPaid'));
const AITrainingTeachers  = lazy(() => import('./pages/AITrainingTeachers'));
const AITrainingParents   = lazy(() => import('./pages/AITrainingParents'));
const AITrainingStudents  = lazy(() => import('./pages/AITrainingStudents'));
const AITrainingSEND      = lazy(() => import('./pages/AITrainingSEND'));
const AITrainingLeaders   = lazy(() => import('./pages/AITrainingLeaders'));
const PromptsHub          = lazy(() => import('./pages/PromptsHub'));
const PromptsLibrary      = lazy(() => import('./pages/PromptsLibrary'));
const PromptsCategory     = lazy(() => import('./pages/PromptsCategory'));
const PromptsPack         = lazy(() => import('./pages/PromptsPack'));
const PromptsTeachers     = lazy(() => import('./pages/PromptsTeachers'));
const PromptsSchoolLeaders = lazy(() => import('./pages/PromptsSchoolLeaders'));
const PromptsSENCO        = lazy(() => import('./pages/PromptsSENCO'));
const PromptsParents      = lazy(() => import('./pages/PromptsParents'));
const PromptsStudents     = lazy(() => import('./pages/PromptsStudents'));
const PromptsAdmin        = lazy(() => import('./pages/PromptsAdmin'));
const AIEquipment         = lazy(() => import('./pages/AIEquipment'));
const AIEquipmentTeachers = lazy(() => import('./pages/AIEquipmentTeachers'));
const AIEquipmentSchools  = lazy(() => import('./pages/AIEquipmentSchools'));
const AIEquipmentParents  = lazy(() => import('./pages/AIEquipmentParents'));
const AIEquipmentStudents = lazy(() => import('./pages/AIEquipmentStudents'));
const AIEquipmentSEND     = lazy(() => import('./pages/AIEquipmentSEND'));
const AIEquipmentCompare  = lazy(() => import('./pages/AIEquipmentCompare'));
const AIEquipmentCategory = lazy(() => import('./pages/AIEquipmentCategory'));
const AIEquipmentProduct  = lazy(() => import('./pages/AIEquipmentProduct'));
const WhoWeAre            = lazy(() => import('./pages/WhoWeAre'));
const Schools             = lazy(() => import('./pages/Schools'));
const Legal               = lazy(() => import('./pages/Legal'));

// ── Role-first pages ─────────────────────────────────────────────────────────
const TeachersPage        = lazy(() => import('./pages/RolePage').then(m => ({ default: m.TeachersPage })));
const LeadersPage         = lazy(() => import('./pages/RolePage').then(m => ({ default: m.LeadersPage })));
const SencoPage           = lazy(() => import('./pages/RolePage').then(m => ({ default: m.SencoPage })));
const ParentsRolePage     = lazy(() => import('./pages/RolePage').then(m => ({ default: m.ParentsRolePage })));
const StudentsRolePage    = lazy(() => import('./pages/RolePage').then(m => ({ default: m.StudentsRolePage })));
const AdminRolePage       = lazy(() => import('./pages/RolePage').then(m => ({ default: m.AdminRolePage })));

// ── Loading fallback ────────────────────────────────────────────────────────
const PageLoader = () => (
  <div
    className="flex items-center justify-center min-h-[60vh]"
    style={{ background: '#F8F5F0' }}
  >
    <div
      className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
      style={{ borderColor: '#ECE7DD', borderTopColor: '#BEFF00' }}
      role="status"
      aria-label="Loading page"
    />
  </div>
);

const App = () => (
  <>
    <ScrollToTop />

    {/* Skip link — first focusable element on every page, visible on keyboard focus */}
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>

    <Navbar />

    <main id="main-content" tabIndex={-1} role="main">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/tools"          element={<Tools />} />
          <Route path="/tools/:slug"    element={<ToolDetail />} />

          {/* Old equipment routes → redirect to new hub */}
          <Route path="/equipment"         element={<Navigate to="/ai-equipment" replace />} />
          <Route path="/equipment/send"    element={<Navigate to="/ai-equipment/send" replace />} />
          <Route path="/equipment/schools" element={<Navigate to="/ai-equipment/schools" replace />} />

          {/* Legacy pages */}
          <Route path="/equipment-legacy"         element={<Equipment />} />
          <Route path="/equipment-legacy/send"    element={<EquipmentSEND />} />
          <Route path="/equipment-legacy/schools" element={<EquipmentSchools />} />

          {/* AI Equipment hub */}
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

          {/* Role-first pages */}
          <Route path="/teachers"                        element={<TeachersPage />} />
          <Route path="/school-leaders"                  element={<LeadersPage />} />
          <Route path="/senco"                           element={<SencoPage />} />
          <Route path="/parents"                         element={<ParentsRolePage />} />
          <Route path="/students"                        element={<StudentsRolePage />} />
          <Route path="/admin"                           element={<AdminRolePage />} />

          <Route path="/who-we-are"                     element={<WhoWeAre />} />
          <Route path="/schools"                        element={<Schools />} />
          <Route path="/for-schools"                    element={<Navigate to="/schools" replace />} />
          <Route path="/legal"                          element={<Legal />} />
          <Route path="/privacy-policy"                 element={<Navigate to="/legal#privacy" replace />} />
          <Route path="/cookie-policy"                  element={<Navigate to="/legal#cookies" replace />} />
        </Routes>
      </Suspense>
    </main>

    <Footer />
    <AgentWidget />
    <CookieBanner />
    <LeadCaptureModal />
  </>
);

export default App;
