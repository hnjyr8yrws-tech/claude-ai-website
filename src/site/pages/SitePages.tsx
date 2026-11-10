/**
 * The pages built on the homepage's stylesheet (design v0.5): the homepage, Membership, About us, How we review and Legal.
 * Copy is the approved prototype's, word for word, except where a note says the live site needs the real thing.
 */
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/site.css';
import { AreaKey, Footer, Header, Page, Wordmark } from '../Chrome';
import { AREAS, HELD_LETTERS, JOIN, LETTERS, MAIL, REQUEST, sample } from '../data';

const LUNA_IS = 'Luna is Promptly’s librarian. She is AI, not a person.';

// ---------------------------------------------------------------------------------------------------------- homepage
const HEIGHTS = [248, 236, 256, 240, 252, 238];

export function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const books = sample(6);
  const submit = (e: FormEvent) => { e.preventDefault(); navigate('/tools' + (q.trim() ? '?q=' + encodeURIComponent(q.trim()) : '')); };
  return (
    <Page family="pv-site" path="" title="Promptly — reviews of AI tools used in education"
      description="Promptly reviews the evidence behind AI tools used in education: what they’re good for, and what to know before you use them.">
      <div className="dark-band">
        <Header />
        <section className="cover" aria-labelledby="h1"><div className="shell">
          <div className="orient">
            <div>
              <h1 className="fr or-h" id="h1">Be prompt with AI.<br />Be sure of it.</h1>
              <p className="or-p">Promptly reviews the evidence behind AI tools used in education: what they’re good for, and what to know before you use them.</p>
            </div>
            <div>
              <form className="look" role="search" action="/tools" onSubmit={submit}>
                <label className="lab" htmlFor="q">Look a tool up</label>
                <div className="look-f"><input id="q" name="q" type="search" placeholder="Type a tool’s name" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} /></div>
              </form>
              <p className="or-luna"><Link className="go" to="/sign-in">Or ask Luna, Promptly’s librarian</Link></p>
              <p className="lab who">Start with who you are</p>
              <ul className="routes">
                <li><Link to="/tools?reader=schools">Schools &amp; Trusts</Link></li>
                <li><Link to="/tools?reader=early">Nurseries &amp; Early Years</Link></li>
                <li><Link to="/tools?reader=parents">Parents &amp; Carers</Link></li>
                <li><Link to="/tools?reader=students">Students</Link></li>
              </ul>
            </div>
          </div>
          <nav className="az" aria-label="Every tool, A to Z"><ol>
            {LETTERS.map((c) => (
              <li key={c}>{HELD_LETTERS.has(c) ? <Link to={'/tools#letter-' + c.toLowerCase()}>{c}</Link> : <span aria-label={c + ', no tools yet'}>{c}</span>}</li>
            ))}
          </ol></nav>
        </div></section>
      </div>
      <main id="main">
        <section className="trust" id="trust" aria-labelledby="h-trust"><div className="shell"><div className="t9-grid">
          <div><h2 className="fr" id="h-trust">Why trust Promptly</h2><Link className="go" to="/how-we-review">How we review</Link></div>
          <ol className="t9-steps">
            <li><span className="n" aria-hidden="true">01</span><h3>Know what you’re using.</h3><p>Every review explains what a tool does and who it’s for.</p></li>
            <li><span className="n" aria-hidden="true">02</span><h3>See the evidence.</h3><p>Every finding shows where it came from.</p></li>
            <li><span className="n" aria-hidden="true">03</span><h3>One method for every tool.</h3><p>Five areas, the same way, every time.</p></li>
            <li><span className="n" aria-hidden="true">04</span><h3>No surprises.</h3><p>When a review changes, you’ll know.</p></li>
          </ol>
          <div className="hm-areas"><p className="lab" id="h-areas">Five areas in every review</p><AreaKey labelledBy="h-areas" /></div>
        </div></div></section>
        <section className="library" id="membership" aria-labelledby="h-lib"><div className="shell lib">
          <div className="lib-copy">
            <p className="lab">Membership</p>
            <h2 className="fr" id="h-lib">Ask Luna.</h2>
            <p className="fr lib-line">She’ll guide you, and she won’t guess.</p>
            <p className="body big">Members get every full review, the evidence behind it, shelves for the tools they use and alerts when a review changes.</p>
            <div className="acts"><Link className="btn" to={JOIN}>Become a member</Link><Link className="go" to="/membership">What members get</Link></div>
            <p className="small">{LUNA_IS}</p>
          </div>
          <div>
            <div className="libcard" aria-labelledby="lc-h">
              <div className="lc-head"><p className="lab" id="lc-h">The library</p><Link className="lc-az" to="/tools" aria-label="Every tool, A to Z">A–Z <span aria-hidden="true">→</span></Link></div>
              <div className="lc-shelf">
                <div className="lc-row">
                  {books.map((t, i) => (
                    <Link key={t.slug} className="cb" to={'/tools/' + t.slug} style={{ ['--h' as string]: HEIGHTS[i] + 'px' }}>
                      <span className="cb-l" aria-hidden="true">{t.letter}</span><span className="cb-t">{t.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="lc-plank"></div>
              </div>
              <div className="lc-yours"><p className="lc-big fr">A shelf for every department.</p><p className="lc-small">Build your own shelves from the library and be ready for questions about the tools you use.</p></div>
            </div>
            {/* the live card shows six real tools, evenly spaced through the A to Z list, so the prototype's "Illustrative titles." no longer applies */}
            <p className="shelf-note">Six from the library, A to Z. Being listed isn’t a recommendation.</p>
          </div>
        </div></section>
        <section className="safe" id="safe-mode" aria-labelledby="h-safe"><div className="shell"><div className="plate sm6">
          <h2 className="fr" id="h-safe">Safe Mode</h2>
          <div className="sm6-copy">
            <p className="fr sm6-line">Your information. Your rules.</p>
            <p className="body">We’re developing Safe Mode to help you protect sensitive information and stay in control of the digital tools you use, starting with AI.</p>
            <span className="tag">In development</span>
          </div>
        </div></div></section>
      </main>
      <Footer />
    </Page>
  );
}

// ---------------------------------------------------------------------------------------------------------- Membership
const ROWS: [string, boolean, boolean?][] = [
  ['Look a tool up, A to Z', true], ['What each tool is for', true], ['Review dates, checked every week', true],
  ['The full review: who can use it, what to look out for, what to do first', false],
  ['What we found, in five areas', false, true],
  ['The evidence behind every finding', false],
  ['Alerts when a review changes, with “What to do” steps to tick off', false],
  ['Shelves for the tools you use', false], ['Ask Luna', false],
];
const Yes = () => <><span className="y" aria-hidden="true"></span><span className="vh">Included</span></>;
const No = () => <><span className="no" aria-hidden="true"></span><span className="vh">Not included</span></>;
const FAQ: [string, JSX.Element | string][] = [
  ['What is Promptly?', 'Clear, honest guidance on AI tools in education: what each tool is for, what to look out for and which questions to ask. A person checks and approves every review.'],
  ['Who is it for?', 'Anyone in education: schools and trusts, nurseries, teachers, governors, parents and carers.'],
  ['How much is membership?', 'Prices will be announced before launch.'],
  ['How often are reviews updated?', 'We check every tool every week. A person approves any change before it appears, and members see what changed and what to do.'],
  ['Can I ask you to review a tool?', <>Yes. Email <a href={REQUEST}>info@getpromptly.co.uk</a> and we’ll reply within 48 hours. A request doesn’t guarantee a review or change its outcome.</>],
];

export function MembershipPage() {
  return (
    <Page family="pv-site" path="/membership" title="Membership — Promptly"
      description="Membership is your library card. It opens every full review, the evidence behind it, and Luna to guide you.">
      <div className="dark-band">
        <Header current="membership" />
        <section className="ph" aria-labelledby="h-mem"><div className="shell"><div className="ph-grid">
          <div>
            <p className="lab">Membership</p>
            <h1 className="fr ph-h" id="h-mem">One card.<br /> The whole library.</h1>
            <p className="ph-p">Membership is your library card. It opens every full review, the evidence behind it, and Luna to guide you.</p>
            <div className="acts"><Link className="btn" to={JOIN}>Become a member</Link><Link className="go" to="/sign-in">Sign in</Link></div>
          </div>
          <figure className="rc">
            <div className="rc-card" role="img" aria-label="A Promptly library card, stamped Member. This card opens every full review, the evidence behind it, Ask Luna, and your shelves and alerts">
              <div className="rc-top"><span className="rc-wm"><Wordmark /></span><span className="rc-k">Library card</span></div>
              <div className="rc-row"><span className="rc-l">Name</span><span className="rc-v fr i">Luna</span></div>
              <span className="rc-l rc-wl">This card opens</span>
              <ul className="rc-open"><li>Every full review</li><li>The evidence behind it</li><li>Ask Luna</li><li>Your shelves and alerts</li></ul>
              <span className="rc-stamp">Member</span>
            </div>
          </figure>
        </div></div></section>
      </div>
      <main id="main">
        <section className="s9" aria-labelledby="h-cmp"><div className="shell">
          <div className="s9-head"><h2 className="fr" id="h-cmp">Free to look. Members read it all.</h2><p>Anyone can look a tool up. Members get everything behind it.</p></div>
          <div className="s9-body">
            <table className="cmp"><caption className="vh">What everyone can see, and what members get</caption>
              <thead><tr><th scope="col"><span className="vh">What you get</span></th><th scope="col" className="c">Everyone</th><th scope="col" className="c cm">Members</th></tr></thead>
              <tbody>
                {ROWS.map(([text, free, areas]) => (
                  <tr key={text}><th scope="row">{text}{areas && <AreaKey className="a5m" label="The five areas" />}</th><td>{free ? <Yes /> : <No />}</td><td><Yes /></td></tr>
                ))}
              </tbody>
            </table>
            <div className="acts"><Link className="btn" to={JOIN}>Become a member</Link></div>
          </div>
        </div></section>
        <section className="ml" id="luna" aria-labelledby="h-luna"><div className="shell"><div className="plate">
          <div>
            <p className="lab">Luna, Promptly’s librarian</p><h2 className="fr" id="h-luna">She’ll guide you, and she won’t guess.</h2>
            <p className="ml-p">{LUNA_IS} She’ll guide you through most questions about AI in education. If she doesn’t know something, she’ll say so and point you the right way.</p>
          </div>
          <div>
            <p className="lab" id="h-asks">Members ask her things like</p>
            <ul className="asks9" aria-labelledby="h-asks">
              <li>“What should we ask a vendor before we sign?”</li><li>“Which planning tools keep pupil data in the UK?”</li>
              <li>“My daughter wants to use a chatbot for homework. Where do I start?”</li>
            </ul>
          </div>
        </div></div></section>
        <section className="s9" aria-labelledby="h-faq"><div className="shell"><div className="s9-split">
          <div className="s9-l"><h2 className="fr" id="h-faq">Questions</h2></div>
          <div className="faq-list">{FAQ.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div></div></section>
      </main>
      <Footer />
    </Page>
  );
}

// ---------------------------------------------------------------------------------------------------------- About us
export function AboutPage() {
  return (
    <Page family="pv-site" path="/about" title="About us — Promptly" description="Why Promptly exists: clear, honest guidance on where AI can help in education, what risks to look out for and which questions to ask.">
      <div className="dark-band">
        <Header current="about" />
        <section className="ph" aria-labelledby="h-about"><div className="shell"><div className="ab-grid">
          <div><p className="lab">About us</p><h1 className="fr ph-h" id="h-about">Why Promptly exists</h1></div>
          <div>
            <p className="fr ab-lead">We believe AI can make a real difference in education.</p>
            <p className="ab-p">But it moves fast. With so many tools to choose from, it’s easy to feel overwhelmed, especially when you’re unsure what’s safe to use.</p>
            <p className="ab-p">That’s why we started Promptly. We want to give you clear, honest guidance on where AI can help, what risks to look out for and which questions to ask. You can explore what AI has to offer with confidence, without having to keep up with every new tool yourself.</p>
          </div>
        </div></div></section>
      </div>
      <main id="main">
        {/* the prototype's "Our founders" section holds blank placeholders ("Photo", "Details to follow"); it is left off the live site until the founders' details exist */}
        <section className="s9" aria-label="Luna"><div className="shell"><div className="s9-split">
          <div className="s9-l"><h2 className="fr">Who you’ll meet</h2></div>
          <div><p className="fd-luna" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>Luna, who guides our members, is Promptly’s librarian. She is AI, not a member of the team.</p></div>
        </div></div></section>
        <section className="ct" id="contact" aria-labelledby="h-ct"><div className="shell"><div className="plate">
          <div><h2 className="fr" id="h-ct">Get in touch</h2></div>
          <div className="ct-cols">
            <div><p className="lab">Email us</p><p className="fr ct-mail"><a href={MAIL}>info@getpromptly.co.uk</a></p><p className="ct-s">We reply within 48 hours.</p></div>
            <div>
              <p className="lab">Ask us to review a tool</p><p className="ct-p">Tell us the tool’s name and how you use it.</p>
              <div className="acts"><a className="btn" href={REQUEST}>Ask for a review</a></div>
              <p className="ct-s">A request doesn’t guarantee a review or change its outcome.</p>
            </div>
          </div>
        </div></div></section>
      </main>
      <Footer />
    </Page>
  );
}

// ---------------------------------------------------------------------------------------------------------- How we review
const RULES: [string, JSX.Element | string][] = [
  ['See the proof.', 'Every finding names the document it came from and the date we read it.'],
  ['No favourites.', 'Tools are listed A to Z. Nobody pays for a better place.'],
  ['Checked every week.', 'When a tool changes, its review changes.'],
  ['A person approves every change.', 'Nothing reaches a review without one.'],
  ['Every change on the record.', <>What changed, when and why. <Link className="go" to="/standing-record">See the Standing Record</Link></>],
];

export function HowWeReviewPage() {
  return (
    <Page family="pv-site" path="/how-we-review" title="How we review — Promptly" description="One method, every tool: five questions asked of every tool, and every answer shows its evidence.">
      <div className="dark-band">
        <Header current="how" />
        <section className="ph" aria-labelledby="h-hw"><div className="shell">
          <p className="lab">How we review</p>
          <h1 className="fr ph-h" id="h-hw">One method. Every tool.</h1>
          <p className="ph-p">Five questions, asked of every tool. Every answer shows its evidence.</p>
        </div></section>
      </div>
      <main id="main">
        <section className="s9" aria-labelledby="h-a5"><div className="shell">
          <div className="s9-head"><h2 className="fr" id="h-a5">Five questions, every time</h2><p>The colour names the area. It never grades it.</p></div>
          <div className="s9-body"><ol className="a5 q5">{AREAS.map(([name, colour, question]) => <li key={name} style={{ ['--c' as string]: colour }}><h3>{name}</h3><p>{question}</p></li>)}</ol></div>
        </div></section>
        <section className="s9" aria-labelledby="h-rules"><div className="shell"><div className="s9-split">
          <div className="s9-l"><h2 className="fr" id="h-rules">Five rules we keep</h2></div>
          <ol className="t9-steps r5">
            {RULES.map(([title, line], i) => <li key={title}><span className="n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{line}</p></li>)}
          </ol>
        </div></div></section>
        <section className="s9" aria-label="Membership"><div className="shell"><div className="cta9">
          <p className="fr cta9-t">Members read every review in full.</p>
          <div className="acts"><Link className="btn" to={JOIN}>Become a member</Link><Link className="go" to="/membership">What members get</Link></div>
        </div></div></section>
      </main>
      <Footer />
    </Page>
  );
}

// ---------------------------------------------------------------------------------------------------------- Legal
/**
 * Company details as the design draws them, then the privacy and cookie policies the live site already publishes
 * (carried over word for word from the previous Legal page: they are the site's current legal text, not design copy).
 */
export function LegalPage() {
  return (
    <Page family="pv-site" path="/legal" title="Legal — Promptly" description="Company details, privacy notice and cookie policy for Promptly, published by GetPromptly Ltd.">
      <div className="dark-band">
        <Header />
        <section className="ph" aria-labelledby="h-legal"><div className="shell">
          <p className="lab">Legal</p>
          <h1 className="fr ph-h" id="h-legal">Company details</h1>
        </div></section>
      </div>
      <main id="main">
        <section className="s9" aria-labelledby="h-co"><div className="shell"><div className="s9-split">
          <div className="s9-l"><h2 className="fr" id="h-co">GetPromptly Ltd</h2></div>
          <div><dl className="lg-dl">
            <div><dt>Company</dt><dd>GetPromptly Ltd, a private limited company</dd></div>
            <div><dt>Registered in</dt><dd>England and Wales</dd></div>
            <div><dt>Company number</dt><dd>17137647</dd></div>
            <div><dt>Contact</dt><dd><a href={MAIL}>info@getpromptly.co.uk</a></dd></div>
          </dl></div>
        </div></div></section>
        <section className="s9" id="privacy" aria-labelledby="h-priv"><div className="shell"><div className="s9-split">
          <div className="s9-l"><h2 className="fr" id="h-priv">Privacy notice</h2><p>Last updated: April 2026.</p></div>
          <div className="lg-text">
            <p className="lg-p">GetPromptly (“we”, “our”, “us”) is committed to protecting your privacy. This policy explains what data we collect, why we collect it, and how we use it.</p>
            <h3>What data we collect</h3>
            <ul>
              <li><b>Usage data:</b> Pages visited, time on site, clicks and searches, collected anonymously via Google Analytics 4. No personally identifiable information is captured without consent.</li>
              <li><b>Contact form submissions:</b> If you use our consultation request form, we collect your name, school name, role and message. This data is used only to respond to your enquiry.</li>
              <li><b>Cookie data:</b> See the Cookie Policy section below.</li>
            </ul>
            <h3>How we use your data</h3>
            <ul>
              <li>To improve the site based on how it is used</li><li>To respond to consultation and contact requests</li>
              <li>We do not sell data to third parties</li><li>We do not use data for targeted advertising</li>
            </ul>
            <h3>Your rights (UK GDPR)</h3>
            <p className="lg-p">Under UK GDPR you have the right to access, correct or delete your personal data. To exercise these rights, contact us at <a href={MAIL}>info@getpromptly.co.uk</a>.</p>
            <h3>Data retention</h3>
            <p className="lg-p">Analytics data is retained for 14 months per Google Analytics default settings. Contact form submissions are retained for up to 12 months then securely deleted.</p>
          </div>
        </div></div></section>
        <section className="s9" id="cookies" aria-labelledby="h-cook"><div className="shell"><div className="s9-split">
          <div className="s9-l"><h2 className="fr" id="h-cook">Cookie policy</h2></div>
          <div className="lg-text">
            <p className="lg-p">GetPromptly uses a small number of cookies. We never use cookies for advertising or tracking across other sites.</p>
            <dl className="lg-dl">
              <div><dt>_ga, _ga_*</dt><dd>Google Analytics: anonymous usage statistics. 13 months.</dd></div>
              <div><dt>promptly_cookie</dt><dd>Records whether you have accepted our cookie notice. 12 months.</dd></div>
            </dl>
            <p className="lg-p" style={{ marginTop: 18 }}>You can withdraw cookie consent at any time by clearing your browser cookies and refreshing the page. Our cookie notice will reappear and you may decline analytics cookies.</p>
          </div>
        </div></div></section>
      </main>
      <Footer />
    </Page>
  );
}
