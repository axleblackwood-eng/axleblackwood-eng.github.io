@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --bg-main: #161615;
    --bg-surface: #232321;
    --bg-flat: #1c1c1a;
    --bg-hover: #2c2c2a;
    --text-primary: #e8e6e1;
    --text-secondary: #a3a099;
    --text-disabled: #6b6965;
    --brand-primary: #7c9082;
    --brand-primary-hover: #677a6d;
    --brand-accent: #a96f5d;
    --brand-highlight: #d4a373;
    --brand-danger: #8c4a4a;
    --border-default: rgba(232, 230, 225, 0.05);
}

* {
    border-color: var(--border-default);
}

html,
body,
#root {
    background-color: var(--bg-main);
    color: var(--text-primary);
    min-height: 100vh;
}

body {
    margin: 0;
    font-family: "Manrope", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: "ss01", "ss02";
}

.font-serif {
    font-family: "Cormorant Garamond", serif;
}

.font-mono {
    font-family: "JetBrains Mono", monospace;
}

.label-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--brand-primary);
}

.surface {
    background-color: var(--bg-surface);
    border-radius: 2rem;
    border: 1px solid var(--border-default);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.surface-flat {
    background-color: var(--bg-flat);
    border-radius: 1.25rem;
    border: 1px solid var(--border-default);
}

.btn-primary {
    background-color: var(--brand-primary);
    color: var(--bg-main);
    border-radius: 9999px;
    padding: 0.85rem 1.75rem;
    font-weight: 500;
    transition: all 0.25s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    cursor: pointer;
}
.btn-primary:hover {
    background-color: var(--brand-primary-hover);
    transform: translateY(-1px);
}
.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.btn-ghost {
    background-color: transparent;
    color: var(--text-primary);
    border-radius: 9999px;
    padding: 0.7rem 1.5rem;
    border: 1px solid var(--border-default);
    transition: all 0.25s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
}
.btn-ghost:hover {
    background-color: var(--bg-hover);
    border-color: rgba(232, 230, 225, 0.15);
}

.input-cozy {
    width: 100%;
    background-color: var(--bg-flat);
    border: 1px solid var(--border-default);
    border-radius: 0.85rem;
    padding: 0.85rem 1rem;
    color: var(--text-primary);
    transition: border-color 0.2s ease;
    font-family: inherit;
    font-size: 0.95rem;
}
.input-cozy::placeholder {
    color: var(--text-disabled);
}
.input-cozy:focus {
    outline: none;
    border-color: var(--brand-primary);
}

textarea.input-cozy {
    resize: vertical;
    min-height: 4.5rem;
    line-height: 1.6;
}

/* Selection */
::selection {
    background: rgba(124, 144, 130, 0.35);
    color: var(--text-primary);
}

/* Markdown / prose */
.prose-cozy {
    color: var(--text-primary);
    line-height: 1.7;
    font-size: 0.97rem;
}
.prose-cozy h1,
.prose-cozy h2,
.prose-cozy h3,
.prose-cozy h4 {
    font-family: "Cormorant Garamond", serif;
    color: var(--text-primary);
    margin-top: 1.6rem;
    margin-bottom: 0.6rem;
    font-weight: 500;
    line-height: 1.2;
}
.prose-cozy h1 {
    font-size: 1.85rem;
}
.prose-cozy h2 {
    font-size: 1.5rem;
}
.prose-cozy h3 {
    font-size: 1.25rem;
}
.prose-cozy p {
    margin: 0.6em 0;
    color: var(--text-primary);
}
.prose-cozy a {
    color: var(--brand-highlight);
}
.prose-cozy strong {
    color: var(--text-primary);
    font-weight: 600;
}
.prose-cozy em {
    color: var(--brand-highlight);
    font-style: italic;
}
.prose-cozy ul,
.prose-cozy ol {
    margin: 0.6em 0;
    padding-left: 1.4em;
}
.prose-cozy ul {
    list-style: disc;
}
.prose-cozy ol {
    list-style: decimal;
}
.prose-cozy li {
    margin: 0.2em 0;
}
.prose-cozy li input[type="checkbox"] {
    margin-right: 0.4em;
    accent-color: var(--brand-primary);
}
.prose-cozy blockquote {
    border-left: 2px solid var(--brand-primary);
    padding-left: 1em;
    color: var(--text-secondary);
    margin: 0.8em 0;
    font-style: italic;
}
.prose-cozy code {
    background: var(--bg-flat);
    padding: 0.12em 0.4em;
    border-radius: 0.35em;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.85em;
    color: var(--brand-highlight);
}
.prose-cozy pre {
    background: var(--bg-flat);
    padding: 1rem;
    border-radius: 0.85rem;
    overflow-x: auto;
    border: 1px solid var(--border-default);
}
.prose-cozy pre code {
    background: transparent;
    padding: 0;
    color: var(--text-primary);
}
.prose-cozy hr {
    border: none;
    border-top: 1px solid var(--border-default);
    margin: 1.5em 0;
}
.prose-cozy table {
    border-collapse: collapse;
    margin: 0.8em 0;
    width: 100%;
}
.prose-cozy th,
.prose-cozy td {
    border: 1px solid var(--border-default);
    padding: 0.5em 0.8em;
    text-align: left;
}
.prose-cozy th {
    background: var(--bg-flat);
    font-weight: 600;
}
.prose-cozy img {
    max-width: 100%;
    border-radius: 0.85rem;
    margin: 0.6em 0;
}
.prose-cozy mark {
    background: rgba(212, 163, 115, 0.25);
    color: var(--brand-highlight);
    padding: 0 0.2em;
    border-radius: 0.2em;
}
.prose-cozy kbd {
    background: var(--bg-flat);
    border: 1px solid var(--border-default);
    border-radius: 0.3em;
    padding: 0.1em 0.4em;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.85em;
}
.prose-cozy details {
    background: var(--bg-flat);
    padding: 0.6em 1em;
    border-radius: 0.6em;
    margin: 0.6em 0;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
::-webkit-scrollbar-track {
    background: var(--bg-main);
}
::-webkit-scrollbar-thumb {
    background: #2e2e2c;
    border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
    background: #3a3a37;
}

/* Soft glow */
.glow-warm::before {
    content: "";
    position: absolute;
    top: -40%;
    right: -20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(
        circle,
        rgba(212, 163, 115, 0.07) 0%,
        transparent 70%
    );
    pointer-events: none;
}

@layer base {
    [data-debug-wrapper="true"] {
        display: contents !important;
    }
}
