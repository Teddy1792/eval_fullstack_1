import { useState, useEffect } from "react";
import { CustomButton } from "./component/CustomButton";
import { CustomInput } from "./component/CustomInput";
import { CustomSelect } from "./component/CustomSelect";
import {
  getCategories,
  createCategory,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./services/api";
import "./App.css";

export default function App() {
  const [categories, setCategories] = useState([]); // [{id,name}]
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [filterCategorie, setFilterCategorie] = useState("Toutes");
  const [newCategory, setNewCategory] = useState("");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Édition
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState(null);

  // État async global
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // État async + erreurs par interaction
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [editingSubmittingId, setEditingSubmittingId] = useState(null);

  const [categoryError, setCategoryError] = useState(""); // erreur création catégorie
  const [taskErrors, setTaskErrors] = useState({
    description: "",
    category: "",
  }); // création tâche
  const [editErrors, setEditErrors] = useState({
    description: "",
    category: "",
  }); // édition tâche

  // Chargement initial
  useEffect(() => {
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const [cats, t] = await Promise.all([getCategories(), getTasks()]);
        setCategories(cats);
        setTasks(t);
      } catch (err) {
        console.error(err);
        setLoadError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Utilitaire pour extraire les erreurs DRF
  const extractErrors = (err) => {
    if (!err?.response?.data) return {};
    const data = err.response.data;
    const result = {};
    for (const key in data) {
      if (Array.isArray(data[key])) {
        result[key] = data[key].join(" ");
      } else {
        result[key] = String(data[key]);
      }
    }
    return result;
  };

  // Ajouter catégorie
  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    setCreatingCategory(true);
    setCategoryError("");

    try {
      const category = await createCategory(trimmed);
      setCategories((prev) => [...prev, category]);
      setNewCategory("");
    } catch (err) {
      console.error(err);
      const errs = extractErrors(err);
      if (errs.name) {
        setCategoryError(errs.name);
      } else {
        setCategoryError("Erreur lors de la création de la catégorie.");
      }
    } finally {
      setCreatingCategory(false);
    }
  };

  // Ajouter task
  const handleAddTask = async () => {
    setTaskErrors({ description: "", category: "" });

    if (!newTask.trim() || !selectedCategorie) {
      if (!newTask.trim()) {
        setTaskErrors((prev) => ({
          ...prev,
          description: "La description est obligatoire.",
        }));
      }
      if (!selectedCategorie) {
        setTaskErrors((prev) => ({
          ...prev,
          category: "La catégorie est obligatoire.",
        }));
      }
      return;
    }

    setCreatingTask(true);

    try {
      const newT = await createTask({
        description: newTask,
        category: selectedCategorie, // ID direct
        is_completed: false,
      });

      setTasks((prev) => [...prev, newT]);
      setNewTask("");
    } catch (err) {
      console.error(err);
      const errs = extractErrors(err);
      setTaskErrors({
        description: errs.description || "",
        category: errs.category || "",
      });
    } finally {
      setCreatingTask(false);
    }
  };

  // Toggle completion
  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setUpdatingTaskId(id);
    try {
      const updated = await updateTask(id, {
        is_completed: !task.is_completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error(err);
      // Ici, tu pourrais afficher un message global si tu veux
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    setDeletingTaskId(id);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      // Ici aussi, message global possible
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Nom catégorie
  const categoryName = (catId) => {
    const c = categories.find((cat) => cat.id === catId);
    return c ? c.name : "Inconnue";
  };

  // Filtrage
  const filteredTasks = tasks.filter((task) => {
    if (filterCategorie === "Toutes") return true;
    return categoryName(task.category) === filterCategorie;
  });

  // Valider édition
  const handleValidateEdit = async (taskId) => {
    setEditErrors({ description: "", category: "" });

    if (!editText.trim() || !editCategory) {
      if (!editText.trim()) {
        setEditErrors((prev) => ({
          ...prev,
          description: "La description est obligatoire.",
        }));
      }
      if (!editCategory) {
        setEditErrors((prev) => ({
          ...prev,
          category: "La catégorie est obligatoire.",
        }));
      }
      return;
    }

    setEditingSubmittingId(taskId);

    try {
      const updated = await updateTask(taskId, {
        description: editText,
        category: editCategory,
      });

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));

      setEditingId(null);
      setEditText("");
      setEditCategory(null);
    } catch (err) {
      console.error(err);
      const errs = extractErrors(err);
      setEditErrors({
        description: errs.description || "",
        category: errs.category || "",
      });
    } finally {
      setEditingSubmittingId(null);
    }
  };

  // ------------------ RENDER ------------------

  if (loading) {
    return (
      <div className="app-container">
        <p>Chargement...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="app-container">
        <p className="error">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <section className="vertical-gap">
        <h1>Ma To-Do List par Catégories</h1>

        {/* Ajouter catégorie */}
        <div className="row">
          <div>
            <CustomInput
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nouvelle catégorie"
            />
            {categoryError && <p className="error-message">{categoryError}</p>}
          </div>

          <CustomButton onClick={handleAddCategory} disabled={creatingCategory}>
            {creatingCategory ? "Création..." : "Ajouter une catégorie"}
          </CustomButton>
        </div>

        {/* Filtrer */}
        <div className="row w-full">
          <CustomSelect
            value={filterCategorie}
            onChange={(e) => setFilterCategorie(e.target.value)}
            options={["Toutes", ...categories.map((c) => c.name)]}
            placeholder="Filtrer par catégorie"
          />
        </div>

        {/* Ajouter task */}
        <div className="row">
          <div>
            <CustomInput
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nouvelle tâche"
            />
            {taskErrors.description && (
              <p className="error-message">{taskErrors.description}</p>
            )}
          </div>

          <div>
            <CustomSelect
              value={selectedCategorie || ""}
              onChange={(e) => setSelectedCategorie(Number(e.target.value))}
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              placeholder="Sélectionnez une catégorie"
            />
            {taskErrors.category && (
              <p className="error-message">{taskErrors.category}</p>
            )}
          </div>

          <CustomButton onClick={handleAddTask} disabled={creatingTask}>
            {creatingTask ? "Ajout..." : "Ajouter une tâche"}
          </CustomButton>
        </div>
      </section>

      {/* Liste des tâches */}
      <section className="task-list">
        {filteredTasks.length === 0 ? (
          <p>Aucune tâche à afficher.</p>
        ) : (
          <ul>
            {filteredTasks.map((task) => (
              <li key={task.id} className="task-item">
                {editingId === task.id ? (
                  <>
                    <div>
                      <CustomInput
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      {editErrors.description && (
                        <p className="error-message">
                          {editErrors.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <CustomSelect
                        value={editCategory || ""}
                        onChange={(e) =>
                          setEditCategory(Number(e.target.value))
                        }
                        options={categories.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        placeholder="Sélectionnez une catégorie"
                      />
                      {editErrors.category && (
                        <p className="error-message">{editErrors.category}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleValidateEdit(task.id)}
                      disabled={editingSubmittingId === task.id}
                    >
                      {editingSubmittingId === task.id
                        ? "Validation..."
                        : "Valider"}
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleComplete(task.id)}
                      disabled={updatingTaskId === task.id}
                    />

                    <span className={task.is_completed ? "completed" : ""}>
                      [{categoryName(task.category)}] {task.description}
                    </span>

                    <button
                      onClick={() => {
                        setEditingId(task.id);
                        setEditText(task.description);
                        setEditCategory(task.category);
                        setEditErrors({ description: "", category: "" });
                      }}
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={deletingTaskId === task.id}
                    >
                      {deletingTaskId === task.id
                        ? "Suppression..."
                        : "Supprimer"}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
