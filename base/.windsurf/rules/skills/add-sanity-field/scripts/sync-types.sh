#!/bin/bash
# Régénération automatique des types Studio + Frontend
echo "🔄 Extraction des types Studio..."
cd studio && npm run extract-types

echo "🔄 Génération des types Nuxt Frontend..."
cd ../frontend && npm run typegen

echo "✅ Synchronisation des types terminée !"