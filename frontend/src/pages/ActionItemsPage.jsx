import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ListTodo,
  Circle,
} from "lucide-react";

import api from "../api/axios";

import "../styles/ActionItemsPage.css";

function ActionItemsPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const workspaceId =
        localStorage.getItem("workspaceId");

      if (!workspaceId) {
        console.error("No workspace selected");
        return;
      }

      const response = await api.get(
        `/tasks/${workspaceId}`
      );

      console.log("Tasks:", response.data);

      setTasks(response.data.tasks);

    } catch (error) {
      console.error(
        "Failed to fetch tasks:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (
  taskId,
  status
) => {
  try {
    const workspaceId =
      localStorage.getItem("workspaceId");

    if (!workspaceId) {
      return;
    }

    const response = await api.patch(
      `/tasks/${workspaceId}/status/${taskId}`,
      {
        status,
      }
    );

    console.log(
      "Task updated:",
      response.data
    );

    // Update UI immediately
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task
      )
    );

  } catch (error) {
    console.error(
      "Failed to update task:",
      error.response?.data || error
    );
  }
};

  const filteredTasks =
    filter === "ALL"
      ? tasks
      : tasks.filter(
          (task) => task.status === filter
        );

  const pendingCount = tasks.filter(
    (task) => task.status === "PENDING"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  if (loading) {
    return (
      <div className="tasks-loading">
        <ListTodo size={28} />
        <p>Loading action items...</p>
      </div>
    );
  }

  return (
    <div className="tasks-page">

      {/* Header */}
      <header className="tasks-header">

        <button
          className="tasks-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div>
          <div className="tasks-eyebrow">
            <ListTodo size={15} />
            ACTION ITEMS
          </div>

          <h1>
            Turn meetings into action.
          </h1>

          <p>
            Track tasks, owners and deadlines
            extracted from your meetings.
          </p>
        </div>

      </header>


      {/* Stats */}
      <section className="tasks-stats">

        <div className="task-stat">
          <div className="task-stat-icon">
            <Circle size={20} />
          </div>

          <div>
            <strong>{pendingCount}</strong>
            <span>Pending</span>
          </div>
        </div>


        <div className="task-stat">
          <div className="task-stat-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <strong>{inProgressCount}</strong>
            <span>In Progress</span>
          </div>
        </div>


        <div className="task-stat">
          <div className="task-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </div>
        </div>

      </section>


      {/* Filters */}
      <div className="task-filters">

        <button
          className={
            filter === "ALL"
              ? "active"
              : ""
          }
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className={
            filter === "PENDING"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("PENDING")
          }
        >
          Pending
        </button>

        <button
          className={
            filter === "IN_PROGRESS"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("IN_PROGRESS")
          }
        >
          In Progress
        </button>

        <button
          className={
            filter === "COMPLETED"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("COMPLETED")
          }
        >
          Completed
        </button>

      </div>


      {/* Tasks */}
      <main className="tasks-list">

        {filteredTasks.length === 0 ? (

          <div className="tasks-empty">
            <CheckCircle2 size={36} />

            <h2>
              No tasks here
            </h2>

            <p>
              Action items from your meetings
              will appear here.
            </p>
          </div>

        ) : (

          filteredTasks.map((task) => (

            <article
              className="task-card"
              key={task.id}
            >

              <div className="task-status-icon">

                {task.status ===
                "COMPLETED" ? (
                  <CheckCircle2
                    size={24}
                  />
                ) : (
                  <Circle size={24} />
                )}

              </div>


              <div className="task-main">

                <h2>
                  {task.title}
                </h2>

                <div className="task-meta">

                  <span>
                    👤 {task.owner ||
                      "Unassigned"}
                  </span>

                  <span>
                    📅 {task.deadline ||
                      "No deadline"}
                  </span>

                </div>


                {task.meeting && (
                  <button
                    className="task-meeting"
                    onClick={() =>
                      navigate(
                        `/meetings/${task.meeting.id}`
                      )
                    }
                  >
                    From meeting:{" "}
                    {task.meeting.title}
                  </button>
                )}

              </div>


              <div className="task-status">

  <select
    className={`status-select ${task.status.toLowerCase()}`}
    value={task.status}
    onChange={(e) =>
      updateTaskStatus(
        task.id,
        e.target.value
      )
    }
  >
    <option value="PENDING">
      Pending
    </option>

    <option value="IN_PROGRESS">
      In Progress
    </option>

    <option value="COMPLETED">
      Completed
    </option>
  </select>

</div>

            </article>

          ))

        )}

      </main>

    </div>
  );
}

export default ActionItemsPage;