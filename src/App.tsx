import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CookieBanner from './components/CookieBanner';
import { HomePage } from './site/pages/SitePages';

/**
 * The public site, design v0.5 (carried over from the approved prototype, 10 November 2026).
 *
 * Nine kinds of page: the homepage, Reviews, a tool's public page, How we review, Membership, About us, Legal, the
 * Standing Record and Sign in. Founder decisions of 10 November: no scores on the public site; every tool is shown as
 * under review until reviewed under the updated methodology; AI Equipment, AI Training and Prompts are no longer
 * needed, so their old addresses lead to the nearest page that still exists. The old pages' files are left in the
 * repository, unrouted, for a later clean-up.
 */
const site = () => import('./site/pages/SitePages');
const library = () => import('./site/pages/LibraryPages');
const MembershipPage  = lazy(() => site().then((m) => ({ default: m.MembershipPage })));
const AboutPage       = lazy(() => site().then((m) => ({ default: m.AboutPage })));
const HowWeReviewPage = lazy(() => site().then((m) => ({ default: m.HowWeReviewPage })));
const LegalPage       = lazy(() => site().then((m) => ({ default: m.LegalPage })));
const ReviewsPage     = lazy(() => library().then((m) => ({ default: m.ReviewsPage })));
const ToolPage        = lazy(() => library().then((m) => ({ default: m.ToolPage })));
const RecordPage      = lazy(() => library().then((m) => ({ default: m.RecordPage })));
const NotFoundPage    = lazy(() => library().then((m) => ({ default: m.NotFoundPage })));
const SignInPage      = lazy(() => import('./site/pages/SignInPage').then((m) => ({ default: m.SignInPage })));

const to = (path: string) => <Navigate to={path} replace />;

const App = () => (
  <>
    <Suspense fallback={<div className="pv" role="status" aria-label="Loading page" />}>
      <Routes>
        <Route path="/"                element={<HomePage />} />
        <Route path="/tools"           element={<ReviewsPage />} />
        {/* RL-017: legacy short slug → canonical retired record (one content record, not two) */}
        <Route path="/tools/flip"      element={to('/tools/flipgrid-flip')} />
        <Route path="/tools/:slug"     element={<ToolPage />} />
        <Route path="/how-we-review"   element={<HowWeReviewPage />} />
        <Route path="/membership"      element={<MembershipPage />} />
        <Route path="/about"           element={<AboutPage />} />
        <Route path="/legal"           element={<LegalPage />} />
        <Route path="/standing-record" element={<RecordPage />} />
        <Route path="/sign-in"         element={<SignInPage />} />

        {/* earlier addresses that still have a home */}
        <Route path="/reviews"            element={to('/tools')} />
        <Route path="/methodology"        element={to('/how-we-review')} />
        <Route path="/safety-methodology" element={to('/how-we-review')} />
        <Route path="/who-we-are"         element={to('/about')} />
        <Route path="/privacy-policy"     element={to('/legal#privacy')} />
        <Route path="/cookie-policy"      element={to('/legal#cookies')} />
        {/* role pages: the library, where the reader's choice is carried in the address */}
        <Route path="/teachers"       element={to('/tools')} />
        <Route path="/school-leaders" element={to('/tools')} />
        <Route path="/senco"          element={to('/tools')} />
        <Route path="/parents"        element={to('/tools')} />
        <Route path="/students"       element={to('/tools')} />
        <Route path="/admin"          element={to('/tools')} />
        <Route path="/role/*"         element={to('/tools')} />
        <Route path="/schools"        element={to('/membership')} />
        <Route path="/for-schools"    element={to('/membership')} />
        {/* sections no longer needed (founder decision, 10 November 2026) */}
        <Route path="/equipment/*"        element={to('/')} />
        <Route path="/equipment-legacy/*" element={to('/')} />
        <Route path="/ai-equipment/*"     element={to('/')} />
        <Route path="/training"           element={to('/')} />
        <Route path="/ai-training/*"      element={to('/')} />
        <Route path="/prompts/*"          element={to('/')} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
    <CookieBanner />
  </>
);

export default App;
