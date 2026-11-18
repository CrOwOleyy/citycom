# CityCom

Navigateur basé sur Firefox, avec une interface inspirée du RPOS et des terminaux CityCom de Neocron.

## Compiler et lancer (Windows, PowerShell)

Prérequis : Visual Studio, Rust et [MozillaBuild](https://wiki.mozilla.org/MozillaBuild) installé dans `C:\mozilla-build`.

```powershell
.\citycom.ps1            # build rapide puis lancement
.\citycom.ps1 -Faster    # recompile seulement l'interface (JS, CSS, prefs)
.\citycom.ps1 -Release   # build final optimisé (PGO, LTO, CPU natif), plusieurs heures
```

Le script télécharge les traductions françaises de Mozilla et installe le pack de langue français.

## Où sont les modifications

| Dossier | Contenu |
| --- | --- |
| `browser/branding/citycom/` | Nom, icônes, prefs par défaut, page d'accueil, styles CityCom |
| `browser/themes/addons/citycom/` | Thème sombre vert, activé par défaut |
| `mozconfig-citycom-dev`, `mozconfig-citycom-release` | Configurations de build |
| `.github/workflows/citycom-sync-upstream.yml` | Synchronisation automatique avec Firefox |

Les fichiers de Firefox modifiés se limitent à quelques lignes :
`AboutNewTabRedirector.sys.mjs` (page d'accueil perso), `BuiltInThemeConfig.sys.mjs` et `themes/addons/jar.mn` (thème),
`global-shared.css` et `in-content/common-shared.css` (import des styles CityCom).

## Releases

Pousser un tag `v*` (ou lancer les actions à la main depuis l'onglet Actions) publie une release avec :

- `CityCom-<tag>-win64.zip` : construit sur les serveurs de GitHub en une trentaine de minutes, avec le moteur
  précompilé de Mozilla (`citycom-release.yml`).
- `CityCom-<tag>-win64-natif.zip` : build complet PGO + LTO + CPU natif, compilé sur le PC du propriétaire par un
  runner auto-hébergé portant l'étiquette `citycom-native` (`citycom-release-native.yml`). Ce binaire ne tourne que
  sur des processeurs de la même génération.

```bash
git tag v1.0 && git push origin v1.0
```

Le runner se lance avec `C:\Users\<toi>\actions-runner-citycom\run.cmd`. Son fichier `.env` contient
`CITYCOM_SRC`, le chemin du dépôt local qu'il réutilise. Les workflows de pull requests externes exigent une
approbation manuelle : n'ajoute jamais de déclencheur `pull_request` à un workflow qui tourne sur ce runner.

## Mises à jour de Firefox

L'action GitHub `CityCom - Sync Firefox upstream` fusionne `mozilla-firefox/firefox` dans `main` toutes les 4 heures.
En cas de conflit, elle ouvre une issue avec l'étiquette `sync-upstream`.

Si Firefox modifie ses propres workflows, le jeton par défaut de GitHub ne suffit pas : ajoute un secret `SYNC_TOKEN`
(jeton fine-grained avec les droits Contents et Workflows en écriture sur ce dépôt).

En local :

```bash
git pull origin main
```
