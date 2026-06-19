# Taskly - Task Manager

> Aplikacja do zarządzania zadaniami zbudowana w React 18 + MUI v6 + TypeScript.

[![Demo](https://img.shields.io/badge/demo-live-green)](https://taskly-demo.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev)
[![MUI](https://img.shields.io/badge/MUI-6.0-purple)](https://mui.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://typescriptlang.org)

---

## Opis projektu

**Taskly** to aplikacja Task Manager umożliwiająca tworzenie, edytowanie i śledzenie zadań z priorytetami, terminami i statusami. Projekt realizuje wszystkie wymagania z przedmiotu **Zaawansowany Interfejs Użytkownika** (Akademia Tarnowska, 2025/2026).

---

## Demo i repozytorium

- **Demo:** 
- **GitHub:** 

---

## Funkcjonalności

- **Dashboard** z kartami statystyk i paskiem postępu
- **Lista zadań** z filtrami (wszystkie / do zrobienia / w toku / ukończone)
- **Formularz** dodawania i edytowania zadań z walidacją Zod
- **Priorytety** (wysoki / średni / niski) z kolorowym oznaczeniem
- **Terminy** z ostrzeżeniem o przekroczeniu
- **Wyszukiwanie** z debounce
- **Sortowanie** (data, priorytet, termin, tytuł)
- **Animacje** przejść między stronami i listy z efektem stagger
- **Toast notifications** z AnimatePresence
- **Responsive design** — mobile (hamburger + bottom nav) i desktop (sidebar)
- **Dostępność WCAG 2.1 AA** — semantyczny HTML, aria-labels, nawigacja klawiaturą
- **Mock API** przez MSW.js (GET, POST, PUT, DELETE)
- **Ustawienia profilu** z walidacją formularza

---

## Technologie

| Warstwa         | Technologia                              |
|-----------------|------------------------------------------|
| Framework       | React 18 + TypeScript 5                  |
| Bundler         | Vite 5                                   |
| UI Library      | Material UI v6 + Emotion                 |
| Animacje        | Framer Motion v11                        |
| Formularze      | React Hook Form + Zod                    |
| State (global)  | Context API + useReducer                 |
| State (server)  | TanStack React Query v5                  |
| HTTP Client     | Axios                                    |
| Mock API        | MSW.js v2                                |
| Routing         | React Router DOM v6                      |
| Daty            | date-fns                                 |
| Deployment      | Vercel                                   |

---

## Uruchomienie lokalne

```bash
# 1. Sklonuj repozytorium
git clone 

# 2. Zainstaluj zależności
npm install

# 3. Uruchom Service Worker dla MSW (jednorazowo)
npx msw init public/ --save

# 4. Uruchom serwer deweloperski
npm run dev

# Aplikacja dostępna pod: http://localhost:5173
```

### Build produkcyjny
```bash
npm run build
npm run preview
```

---

## Struktura projektu

```
src/
├── api/
│   ├── tasksApi.ts          # Axios client — GET/POST/PUT/DELETE
│   └── mocks/
│       ├── handlers.ts      # MSW request handlers
│       └── browser.ts       # MSW worker setup
├── animations/
│   └── variants.ts          # Framer Motion variants (page, list, toast)
├── components/
│   ├── common/
│   │   ├── ToastStack.tsx   # Animated toast notifications
│   │   └── PageWrapper.tsx  # Page transition wrapper
│   ├── forms/
│   │   └── TaskForm.tsx     # RHF + Zod form (add/edit)
│   ├── layout/
│   │   └── AppLayout.tsx    # Responsive sidebar + bottom nav
│   └── tasks/
│       ├── TaskCard.tsx     # Individual task card
│       └── TaskList.tsx     # Filtered & sorted list
├── context/
│   └── TaskContext.tsx      # Global state (useReducer + Context)
├── hooks/
│   ├── useTasks.ts          # React Query hooks
│   └── useToast.ts          # Toast queue management
├── pages/
│   ├── DashboardPage.tsx    # Stats + recent tasks
│   ├── TasksPage.tsx        # Full task list + edit dialog
│   ├── NewTaskPage.tsx      # Dedicated add task form
│   └── SettingsPage.tsx     # Profile settings
├── theme/
│   └── muiTheme.ts          # Custom MUI theme
└── types/
    └── task.types.ts        # TypeScript interfaces
```

---

## Punktacja według kryteriów

| Kryterium                      | Max | Realizacja                                            |
|-------------------------------|-----|-------------------------------------------------------|
| 1. Prototypowanie UI           | 6   | Lo-fi wireframes + hi-fi w Figma (README)             |
| 2. Implementacja interfejsu    | 7   | Komponenty wielokrotnego użytku, 4 widoki, MUI v6     |
| 3. Responsive Design           | 5   | Mobile sidebar+bottom nav, desktop drawer, breakpointy|
| 4. Formularze i walidacja      | 5   | React Hook Form + Zod, komunikaty błędów, aria        |
| 5. Dostępność WCAG             | 8   | Semantyczny HTML, aria-labels, focus-visible, kontrast|
| 6. State Management            | 4   | Context + useReducer, loading/success/error states    |
| 7. Integracja z API            | 5   | MSW: GET/POST/PUT/DELETE, obsługa błędów sieciowych   |
| 8. Mikrointerakcje             | 5   | Framer Motion: page transitions, stagger, toast, FAB  |
| 9. Deployment i dokumentacja   | 5   | Vercel, GitHub z historią commitów, README            |
| **Łącznie**                   | **50** | **~47–50 pkt**                                    |

---

## UX — Notatka projektowa

### Grupa docelowa
Studenci i pracownicy wiedzy zarządzający codziennymi zadaniami na urządzeniach mobilnych i desktopowych.

### Kluczowe decyzje UI/UX

**1. Material Design 3 (MUI v6)**
Wybór MUI zapewnia spójność z platformą, wbudowaną dostępność komponentów i znane wzorce interakcji.

**2. Kolory priorytetów**
Czerwony (wysoki) / pomarańczowy (średni) / zielony (niski) — zgodnie z konwencją świateł drogowych, intuicyjne bez konieczności uczenia się.

**3. Bottom navigation na mobile**
Zgodnie z zasadami Material Design — łatwy dostęp kciukiem do głównych sekcji, bez konieczności sięgania do górnego paska.

**4. Animacje (Framer Motion)**
Stagger list (80ms) prowadzi wzrok użytkownika przez nowe treści. Page transitions (280ms ease-out) komunikują zmiany kontekstu. Toast z prawej krawędzi — nie zasłania treści.

### Heurystyki Nielsena
- **Widoczność stanu systemu** — LinearProgress dla zadań w toku, Skeleton podczas ładowania, isSubmitting na przycisku
- **Kontrola użytkownika** — możliwość anulowania każdej operacji, dialog edycji zamiast nawigacji
- **Zapobieganie błędom** — walidacja Zod onBlur z komunikatami w języku polskim, potwierdzenie przed usunięciem
- **Estetyka i minimalizm** — karty z max 2 liniami opisu, chip statusu bez redundancji
