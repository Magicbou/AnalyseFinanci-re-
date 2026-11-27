import { Activity, ArrowDownRight, ArrowUpRight, BadgeCheck, BookOpen, ChartNoAxesCombined, CircleAlert, Database, FileSpreadsheet, ShieldCheck, SlidersHorizontal, Wallet } from "lucide-react";

const principles = [
  { title: "Source obligatoire", detail: "Chaque chiffre doit renvoyer à une source identifiable.", icon: Database },
  { title: "Date visible", detail: "La date de collecte et la fraîcheur des données sont affichées.", icon: Activity },
  { title: "Fait ≠ analyse", detail: "Les observations, calculs et scénarios sont séparés.", icon: ShieldCheck },
];

function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark">I</span><span>invest<span className="brand-light">pilot</span></span></a>
        <div className="workspace-label">ESPACE PERSONNEL</div>
        <nav>
          <a className="nav-item active" href="#"><ChartNoAxesCombined size={18} /> Vue d'ensemble</a>
          <a className="nav-item" href="#analyse"><SlidersHorizontal size={18} /> Analyse ETF</a>
          <a className="nav-item" href="#portefeuille"><Wallet size={18} /> Portefeuille</a>
          <a className="nav-item" href="#sources"><Database size={18} /> Sources & données</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="integrity"><ShieldCheck size={17} /><span>Mode factuel activé</span></div>
          <p>Les données non vérifiées ne sont jamais présentées comme des faits.</p>
          <span className="version">VERSION 0.1.0 · PROTOTYPE</span>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div><span className="eyebrow">TABLEAU DE BORD</span><h1>Décider sur des faits.</h1></div>
          <div className="topbar-right"><span className="status-dot" /> Données non connectées <span className="avatar">P</span></div>
        </header>

        <section className="intro">
          <div>
            <div className="eyebrow pale">VOTRE COCKPIT D'INVESTISSEMENT</div>
            <h2>Moins d'intuition.<br /><em>Plus de preuves.</em></h2>
            <p>Comparer, comprendre et arbitrer à partir de données vérifiables — jamais à partir de chiffres inventés.</p>
          </div>
          <div className="intro-stamp"><BadgeCheck size={18} /><span>Engagement<br /><strong>zéro donnée inventée</strong></span></div>
        </section>

        <section className="section-heading">
          <div><span className="eyebrow">SITUATION ACTUELLE</span><h2>Vos indicateurs</h2></div>
          <span className="muted small">En attente de connexion aux sources</span>
        </section>
        <div className="metric-grid">
          <article className="metric-card"><div className="metric-label">Portefeuille analysé <Wallet size={17}/></div><div className="metric-value">—</div><div className="metric-note">Aucune donnée importée</div></article>
          <article className="metric-card"><div className="metric-label">ETF comparables <FileSpreadsheet size={17}/></div><div className="metric-value">—</div><div className="metric-note">Catalogue à intégrer</div></article>
          <article className="metric-card"><div className="metric-label">Dernière actualisation <Activity size={17}/></div><div className="metric-value">—</div><div className="metric-note">Aucune source connectée</div></article>
          <article className="metric-card"><div className="metric-label">Alertes de fiabilité <CircleAlert size={17}/></div><div className="metric-value">0</div><div className="metric-note">Contrôles à implémenter</div></article>
        </div>

        <section className="section-heading" id="analyse">
          <div><span className="eyebrow">MÉTHODE</span><h2>Notre règle de décision</h2></div>
          <span className="tag"><ShieldCheck size={14}/> Factuel uniquement</span>
        </section>
        <div className="principle-grid">
          {principles.map(({ title, detail, icon: Icon }, index) => <article className="principle-card" key={title}><div className="principle-top"><span>0{index + 1}</span><Icon size={19}/></div><h3>{title}</h3><p>{detail}</p></article>)}
        </div>

        <section className="decision-panel" id="portefeuille">
          <div className="decision-icon"><BookOpen size={20}/></div>
          <div><span className="eyebrow">AIDE À LA DÉCISION</span><h2>Aucune recommandation sans éléments vérifiables.</h2><p>Chaque analyse présentera les faits observés, les calculs reproductibles, les limites des données et les risques. Une conclusion pourra être « données insuffisantes ».</p></div>
          <div className="decision-mark"><ArrowUpRight size={20}/><ArrowDownRight size={20}/></div>
        </section>

        <section className="sources-section" id="sources">
          <div><span className="eyebrow">TRANSPARENCE</span><h2>Registre des sources</h2><p>Les fournisseurs de données ne seront activés qu'après vérification de leur couverture, de leurs conditions d'accès et de leur historique.</p></div>
          <div className="source-empty"><Database size={20}/><span><strong>Aucune source connectée</strong><small>Les cours et caractéristiques ne sont pas encore chargés.</small></span><span className="pending">À CONFIGURER</span></div>
        </section>
        <footer><span>INVESTPILOT · 2026</span><span>Les performances passées ne préjugent pas des performances futures.</span></footer>
      </section>
    </main>
  );
}

export default App;