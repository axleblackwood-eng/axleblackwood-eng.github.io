/* Layout-specific tweaks live here. Most styling is in index.css. */

.App {
    min-height: 100vh;
    background: var(--bg-main);
}

.nav-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    border-radius: 9999px;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
}
.nav-link:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
}
.nav-link.active {
    background: rgba(124, 144, 130, 0.12);
    color: var(--text-primary);
}

.dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 9999px;
    display: inline-block;
}
