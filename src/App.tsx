import { useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BadgeCheck, BookOpen, ChartNoAxesCombined, ChevronDown, CircleAlert, Database, FileSpreadsheet, FilterX, Layers3, Search, ShieldCheck, SlidersHorizontal, Wallet } from "lucide-react";

type Page = "overview" | "etfs" | "portfolio" | "sources";

const principles = [
  { title: "Source obligatoire", detail: "Chaque chiffre doit renvoyer à une source identifiable.", icon: Database },
  { title: "Date visible", detail: "La date de collecte et la fraîcheur des données sont affichées.", icon: Activity },
  { title: "Fait ≠ analyse", detail: "Les observations, calculs et scénarios sont séparés.", icon: ShieldCheck },
];

const filterOptions = {
  asset: ["Toutes les classes", "Actions", "Obligations", "Monétaire", "Matières premières", "Multi-actifs"],
  region: ["Toutes les zones", "Monde", "États-Unis", "Europe", "France", "Marchés émergents", "Asie-Pacifique"],
  replication: ["Tous les modes", "Physique", "Synthétique"],
  income: ["Capitalisation et distribution", "Capitalisation", "Distribution"],
  currency: ["Toutes les devises", "EUR", "USD", "GBP", "CHF"],
  venue: ["Toutes les places", "Euronext Paris", "Xetra", "London Stock Exchange", "SIX Swiss Exchange"],
};

function App() {
  const [page, setPage] = useState<Page>("overview");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ asset: filterOptions.asset[0], region: filterOptions.region[0], replication: filterOptions.replication[0], income: filterOptions.income[0], currency: filterOptions.currency[0], venue: filterOptions.venue[0] });
  const [grouped, setGrouped] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const hasFilters = search.trim().length > 0 || Object.entries(filters).some(([key, value]) => value !== filterOptions[key as keyof typeof filterOptions][0]);

  const resetFilters = () => {
    setSearch("");
    setFilters({ asset: filterOptions.asset[0], region: filterOptions.region[0], replication: filterOptions.replication[0], income: filterOptions.income[0], currency: filterOptions.currency[0], venue: filterOptions.venue[0] });
  };

  const nav = [
    { id: "overview" as const, label: "Vue d'ensemble", icon: ChartNoAxesCombined },
    { id: "etfs" as const, label: "Catalogue ETF", icon: Layers3 },
    { id: "portfolio" as const, label: "Portefeuille", icon: Wallet },
    { id: "sources" as const, label: "Sources & données", icon: Database },
  ];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setPage("overview"); }}><span className="brand-mark">I</span><span>invest<span className="brand-light">pilot</span></span></a>
        <div className="workspace-label">ESPACE PERSONNEL</div>
        <nav>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => setPage(id)}><Icon size={18} /> {label}</button>)}</nav>
        <div className="sidebar-bottom">
          <div className="integrity"><ShieldCheck size={17} /><span>Mode factuel activé</span></div>
          <p>Les données non vérifiées ne sont jamais présentées comme des faits.</p>
          <span className="version">VERSION 0.2.0 · EN CONSTRUCTION</span>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div><span className="eyebrow">{page === "etfs" ? "UNIVERS D'INVESTISSEMENT" : page === "portfolio" ? "SUIVI PERSONNEL" : page === "sources" ? "TRAÇABILITÉ" : "TABLEAU DE BORD"}</span><h1>{page === "etfs" ? "Catalogue des ETF Amundi" : page === "portfolio" ? "Votre portefeuille" : page === "sources" ? "Sources & qualité des données" : "Décider sur des faits."}</h1></div>
          <div className="topbar-right"><span className="status-dot" /> Sources non connectées <span className="avatar">P</span></div>
        </header>

        {page === "overview" && <>
          <section className="intro">
            <div><div className="eyebrow pale">VOTRE COCKPIT D'INVESTISSEMENT</div><h2>Moins d'intuition.<br /><em>Plus de preuves.</em></h2><p>Comparer, comprendre et arbitrer à partir de données vérifiables — jamais à partir de chiffres inventés.</p></div>
            <div className="intro-stamp"><BadgeCheck size={18} /><span>Engagement<br /><strong>zéro donnée inventée</strong></span></div>
          </section>
          <section className="section-heading"><div><span className="eyebrow">SITUATION ACTUELLE</span><h2>Vos indicateurs</h2></div><span className="muted small">En attente de connexion aux sources</span></section>
          <div className="metric-grid">
            <article className="metric-card"><div className="metric-label">Portefeuille analysé <Wallet size={17}/></div><div className="metric-value">—</div><div className="metric-note">Aucune donnée importée</div></article>
            <article className="metric-card"><div className="metric-label">ETF comparables <FileSpreadsheet size={17}/></div><div className="metric-value">—</div><div className="metric-note">Catalogue à intégrer</div></article>
            <article className="metric-card"><div className="metric-label">Dernière actualisation <Activity size={17}/></div><div className="metric-value">—</div><div className="metric-note">Aucune source connectée</div></article>
            <article className="metric-card"><div className="metric-label">Alertes de fiabilité <CircleAlert size={17}/></div><div className="metric-value">—</div><div className="metric-note">Contrôles non activés</div></article>
          </div>
          <section className="section-heading"><div><span className="eyebrow">MÉTHODE</span><h2>Notre règle de décision</h2></div><span className="tag"><ShieldCheck size={14}/> Factuel uniquement</span></section>
          <div className="principle-grid">{principles.map(({ title, detail, icon: Icon }, index) => <article className="principle-card" key={title}><div className="principle-top"><span>0{index + 1}</span><Icon size={19}/></div><h3>{title}</h3><p>{detail}</p></article>)}</div>
          <section className="decision-panel"><div className="decision-icon"><BookOpen size={20}/></div><div><span className="eyebrow">AIDE À LA DÉCISION</span><h2>Aucune recommandation sans éléments vérifiables.</h2><p>Chaque analyse présentera les faits observés, les calculs reproductibles, les limites des données et les risques. Une conclusion pourra être « données insuffisantes ».</p></div><div className="decision-mark"><ArrowUpRight size={20}/><ArrowDownRight size={20}/></div></section>
        </>}

        {page === "etfs" && <section className="catalog-page">
          <div className="catalog-intro"><div><span className="eyebrow">AMUNDI · UNIVERS COMPLET</span><h2>Explorer les ETF, sans perdre le fil.</h2><p>Un produit peut regrouper plusieurs cotations. Dépliez une gamme pour retrouver chaque ligne cotée, son ISIN, son marché et sa devise.</p></div><div className="catalog-count"><Layers3 size={19}/><span><strong>Catalogue non chargé</strong><small>Connexion à la source officielle requise</small></span></div></div>
          <div className="catalog-toolbar">
            <div className="search-field"><Search size={17}/><input aria-label="Rechercher un ETF" placeholder="Rechercher par nom, ISIN, ticker ou indice…" value={search} onChange={e => setSearch(e.target.value)}/>{search && <button className="clear-search" onClick={() => setSearch("")} aria-label="Effacer la recherche">×</button>}</div>
            <button className={`secondary-button ${showFilters ? "selected" : ""}`} onClick={() => setShowFilters(v => !v)}><SlidersHorizontal size={16}/> Filtres <ChevronDown size={14}/></button>
            <div className="view-switch"><button className={grouped ? "chosen" : ""} onClick={() => setGrouped(true)} title="Regrouper les cotations par produit">Par produit</button><button className={!grouped ? "chosen" : ""} onClick={() => setGrouped(false)} title="Afficher chaque cotation séparément">Par cotation</button></div>
          </div>
          {showFilters && <div className="filter-panel">
            {(Object.keys(filterOptions) as Array<keyof typeof filterOptions>).map(key => <label className="filter-control" key={key}><span>{({asset:"Classe d'actifs",region:"Zone géographique",replication:"Réplication",income:"Politique de revenus",currency:"Devise",venue:"Place de cotation"})[key]}</span><select value={filters[key]} onChange={e => setFilters(prev => ({...prev,[key]:e.target.value}))}>{filterOptions[key].map(option => <option key={option}>{option}</option>)}</select></label>)}
            <button className="reset-button" onClick={resetFilters} disabled={!hasFilters}><FilterX size={15}/> Réinitialiser</button>
          </div>}
          <div className="catalog-summary"><div><strong>Résultats</strong><span>— produits · — cotations</span></div><span className="data-status"><i/> Flux de données non connecté</span></div>
          <div className="catalog-table-wrap">
            <div className="catalog-table-head"><span>PRODUIT / COTATION</span><span>ISIN / TICKER</span><span>PLACE</span><span>DEVISE</span><span>DERNIER COURS</span><span>VAR. SÉANCE</span><span>ÉTAT DU FLUX</span></div>
            <div className="catalog-empty"><div className="empty-icon"><Database size={23}/></div><h3>Le catalogue Amundi sera affiché ici</h3><p>Les filtres et le mode de regroupement sont prêts. Aucun produit n'est affiché tant que la source n'a pas été connectée : nous évitons ainsi les exemples fictifs et les cours non vérifiés.</p><div className="empty-checks"><span><ShieldCheck size={14}/> ISIN comme identifiant de référence</span><span><Activity size={14}/> Horodatage de chaque cotation</span><span><Layers3 size={14}/> Plusieurs cotations par produit</span></div></div>
          </div>
          <div className="catalog-footnote">Le cours, la valeur liquidative et le cours indicatif seront présentés séparément. Le statut « temps réel » ne sera affiché qu'après validation du flux et des droits de diffusion.</div>
        </section>}

        {page === "portfolio" && <section className="placeholder-page"><Wallet size={24}/><h2>Suivi du portefeuille</h2><p>Import des positions et rapprochement des ISIN : cette section sera activée après la mise en place du référentiel instruments.</p></section>}
        {page === "sources" && <section className="placeholder-page"><Database size={24}/><h2>Registre des sources</h2><p>Chaque fournisseur sera documenté avec sa couverture, sa fréquence, son horodatage, ses conditions d'utilisation et son statut de vérification.</p></section>}
        <footer><span>INVESTPILOT · 2026</span><span>Les performances passées ne préjugent pas des performances futures.</span></footer>
      </section>
    </main>
  );
}

export default App;