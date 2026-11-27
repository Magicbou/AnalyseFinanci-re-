# Sources de données — InvestPilot

## Catalogue des produits Amundi

Source primaire utilisée par le connecteur :
- https://www.amundietf.fr/fr/particuliers/produits-etf/recherche
- Consultation du catalogue : 27 novembre 2026
- Le moteur de recherche Amundi affichait 654 produits sur cette page à cette date.

Le connecteur Cloudflare Pages lit les lignes de résultats et extrait les champs réellement présents : ticker tel que publié, WKN, nom, ISIN, devise de part, frais de gestion affichés, encours affiché, classification SFDR, exposition, valeur liquidative et date de VL, performances YTD et 1 an.

L'ISIN identifie le produit/compartiment dans InvestPilot. Le ticker accompagné du suffixe de place identifie la ligne de cotation publiée. Les lignes sont regroupées par ISIN et peuvent être dépliées dans l'interface.

### Contrôle d'exhaustivité

Le nombre annoncé par Amundi et le nombre de lignes réellement extraites sont comparés. La réponse API indique `completeness: complete` uniquement si les deux nombres concordent. Sinon, elle indique `partial`. Le connecteur suit les liens de pagination présents dans le HTML de la page ; si Amundi ne publie pas ces liens dans la réponse HTML, la collecte doit être complétée par le mécanisme officiel d'export avant de revendiquer l'exhaustivité.

Les champs absents restent vides. Aucun ticker, ISIN, frais, cours ou historique n'est fabriqué.

## Valeur liquidative et cours de Bourse

La VL Amundi est une valeur publiée par la société de gestion, avec sa propre date de calcul. Elle n'est pas assimilée au dernier cours négocié en Bourse. Les deux séries doivent être conservées séparément.

## Flux de marché

Pour les cotations Euronext, Euronext Web Services documente un accès HTTP/JSON REST aux cours, derniers prix, transactions et données de référence, en temps réel, différé ou historique. L'accès temps réel peut entraîner des frais. L'usage différé interne est annoncé gratuit sous conditions ; l'affichage ou la redistribution à des tiers peut nécessiter des accords et licences spécifiques.

Source documentation :
- https://www.euronext.com/en/data/how-access-market-data
- https://www.euronext.com/en/data/real-time-data/pricing-specs-agreements/market-data-pricing-policies
- https://www.euronext.com/en/data/pricing-specs-agreements/data-agreements-types

Pour les autres places (Xetra, Londres, SIX, Milan, etc.), un fournisseur couvrant chaque marché sera nécessaire. Un fournisseur unique ne sera retenu qu'après vérification de la couverture, des horodatages, des droits d'affichage, de l'historique, du coût et des conditions de redistribution.

## Statut de mise en service

- Catalogue Amundi : connecteur développé, validation d'exécution et d'exhaustivité encore requise.
- Cours temps réel : non connecté ; aucun droit de marché ni identifiant fournisseur n'est configuré.
- Cloudflare D1 : schéma initial présent dans `migrations/0001_initial.sql`, base et binding à créer.
- Production : non validée tant que CI, collecte réelle, migration D1, sécurité et tests de déploiement ne sont pas passés.
