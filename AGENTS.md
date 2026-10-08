# Project Architecture Rules

- Keep standalone legal documents as leaf routes under `src/routes` using the shared `LegalPage` shell, because each document needs a stable public URL and its own metadata.