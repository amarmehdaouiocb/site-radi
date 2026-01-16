# Upload des vidéos sur YouTube

Guide pour ajouter les vidéos de chantier au site RA Bâtiment.

---

## 1. Préparer les vidéos

Les 2 vidéos MP4 sont dans `/public/portfolio/` :
- `WhatsApp Video 2026-01-05 at 19.25.52.mp4`
- `WhatsApp Video 2026-01-05 at 19.25.52 (1).mp4`

**Recommandations avant upload :**
- Durée idéale : 30s - 2min
- Pas de musique copyright (YouTube peut les bloquer)
- Vérifier qu'aucune info sensible n'est visible

---

## 2. Créer/Accéder à la chaîne YouTube

1. Va sur [studio.youtube.com](https://studio.youtube.com)
2. Connecte-toi avec un compte Google
3. Si pas de chaîne : "Créer une chaîne" → Nom : "RA Bâtiment BTP"

---

## 3. Uploader les vidéos

1. Clique sur **"Créer"** (bouton + en haut à droite)
2. Sélectionne **"Mettre en ligne une vidéo"**
3. Glisse-dépose le fichier MP4

### Paramètres recommandés :

**Titre** :
```
Rénovation Salle de Bain | RA Bâtiment Artisan BTP
```

**Description** :
```
Découvrez notre réalisation : rénovation complète d'une salle de bain en Île-de-France.

✅ Carrelage mosaïque
✅ WC suspendu
✅ Douche à l'italienne

📞 Devis gratuit : +33 6 89 12 46 21
🌐 Site : [URL du site]

#renovation #salledebain #artisan #BTP #IleDeFrance
```

**Visibilité** :
- `Non répertoriée` (visible via lien uniquement) ou
- `Publique` (visible dans les recherches YouTube)

**Vignette** : Utilise une image du projet terminé

---

## 4. Récupérer l'ID de la vidéo

Après upload, l'URL sera :
```
https://www.youtube.com/watch?v=ABC123XYZ
```

L'**ID** est la partie après `v=` → `ABC123XYZ`

---

## 5. Ajouter au site

Ouvre `src/lib/constants.ts` et modifie la section `VIDEOS` :

```typescript
export const VIDEOS = [
  {
    id: "ABC123XYZ",  // ← ID YouTube
    title: "Rénovation Salle de Bain",
    project: "sdb-mosaique"
  },
  {
    id: "DEF456UVW",  // ← ID YouTube
    title: "Construction Piscine",
    project: "piscine"
  },
];
```

---

## 6. Afficher les vidéos sur le site (optionnel)

Pour ajouter une section vidéos sur la page d'accueil, importer et utiliser :

```tsx
import YouTubeVideo from "@/components/YouTubeVideo";
import { VIDEOS } from "@/lib/constants";

// Dans le JSX :
{VIDEOS.length > 0 && (
  <section className="gold-videos-section">
    <div className="gold-container">
      <div className="gold-section-header">
        <span className="gold-section-label">Nos Chantiers en Vidéo</span>
        <h2 className="gold-section-title">
          Découvrez nos <span className="gold-text-gradient">Réalisations</span>
        </h2>
      </div>
      <div className="gold-videos-grid">
        {VIDEOS.map((video) => (
          <div key={video.id} className="gold-video-card">
            <YouTubeVideo videoId={video.id} title={video.title} />
            <h3 className="gold-video-title">{video.title}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
)}
```

---

## Checklist

- [ ] Vidéos uploadées sur YouTube
- [ ] IDs récupérés
- [ ] `constants.ts` mis à jour
- [ ] Test sur le site (npm run dev)
- [ ] Vidéos visibles et lisibles

---

## Bonnes pratiques YouTube

1. **Optimisation SEO** : Inclure "artisan", "BTP", "Île-de-France" dans titre/description
2. **Vignettes** : Créer des vignettes attractives avec le logo RA Bâtiment
3. **Playlists** : Créer une playlist "Nos Réalisations"
4. **Lien retour** : Ajouter le lien du site dans la description
