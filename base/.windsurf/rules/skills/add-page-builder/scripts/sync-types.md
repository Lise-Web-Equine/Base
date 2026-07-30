#!/bin/bash
set -e

echo "🔄 Extraction des types Sanity Studio..."
cd studio && npm run extract-types

echo "🔄 Préparation des types Nuxt Frontend..."
cd ../frontend && npx nuxt prepare

echo "✅ Types du Page Builder régénérés avec succès !"