📝 To-Do List – React + Django REST Framework

Application permettant de gérer des catégories et des tâches, avec CRUD complet, filtres, édition, et gestion d’erreurs renvoyées par l’API.

⸻

🚀 Stack technique

Frontend (Vite + React)
• React
• Axios
• Composants custom :
CustomInput
CustomButton
CustomSelect

Backend (Django + DRF)
• Django
• Django REST Framework
• django-cors-headers

⸻

🗂️ Fonctionnalités

Catégories
• Affichage complet des catégories
• Ajout de catégorie
• Validation d’unicité avec message d’erreur en français
• Sélection dans les formulaires de tâches
• Blocage des catégories vides / null
• Suppression possible depuis l’admin Django pour éviter la suppression de catégories utilisées

Tâches
• Liste complète avec catégorie associée
• Création avec sélection de catégorie
• Suppression
• Changement d’état is_completed
• Édition (texte et catégorie)
• Filtrage par catégorie

Validation & erreurs
• Le backend renvoie :
• 201 en cas de succès
• 400 avec JSON détaillé en cas d’erreur (ex : champ obligatoire, doublon)
• Le frontend affiche les messages d’erreur directement sous les champs concernés

⸻

⚙️ Installation

Backend

cd backend
source venv/bin/activate # si environnement virtuel
python manage.py runserver

L’API sera accessible sur :

http://localhost:8000/api/

Frontend

cd frontend
npm install
npm run dev

Le front tournera sur :

http://localhost:5173

⸻

📌 Endpoints API

Catégories

Méthode URL Description
GET /api/categories/ Liste des catégories
POST /api/categories/ Création

Tâches

Méthode URL Description
GET /api/tasks/ Liste des tâches
POST /api/tasks/ Création
PATCH /api/tasks/<id>/ Mise à jour (texte/catégorie/état)
DELETE /api/tasks/<id>/ Suppression

⸻

📁 Structure

backend/
api/
models.py
views.py
serializers.py
admin.py
backend/
settings.py
urls.py

frontend/
src/
App.jsx
services/api.js
components/
CustomInput.jsx
CustomSelect.jsx
CustomButton.jsx

⸻

🧪 Exemple d’erreur backend (unicité)

Réponse renvoyée par l’API :

{
"name": ["Une catégorie portant ce nom existe déjà."]
}

Le front l’affiche sous l’input.
