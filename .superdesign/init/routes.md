# Routes

The frontend is a Vite React single-page application without React Router.

| URL | Entry | Layout |
| --- | --- | --- |
| `/` | `frontend/src/main.jsx` → `frontend/src/App.jsx` | App shell in `App.jsx` |

The page uses hash anchors for `#home`, `#about`, `#skills`, `#projects`, `#investment`, and `#contact`.

## Application entry

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

