import { useState, useEffect } from 'react';
import {
  FiPlus,
  FiGrid,
  FiList,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiUsers,
  FiTag,
} from 'react-icons/fi';
// import { useAuth } from '../hooks/useAuth';
import '../styles/project-planning.css';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignees: string[];
  labels: string[];
  dueDate?: string;
  createdAt: string;
}

interface Board {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

export default function ProjectPlanning() {
  // const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<string>('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  // const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    // TODO: API call
    setBoards([
      {
        id: '1',
        name: 'Arduino IoT Project',
        description: 'Smart home automation system',
        tasks: [
          {
            id: 't1',
            title: 'Setup Arduino IDE',
            description: 'Install and configure development environment',
            status: 'done',
            priority: 'high',
            assignees: ['user1'],
            labels: ['setup', 'environment'],
            dueDate: '2025-01-20',
            createdAt: '2025-01-10',
          },
        ],
      },
    ]);
    setActiveBoard('1');
  };

  const currentBoard = boards.find((b) => b.id === activeBoard);
  const columns = [
    { id: 'todo', title: 'To Do', color: 'var(--blue)' },
    { id: 'in-progress', title: 'In Progress', color: 'var(--yellow)' },
    { id: 'review', title: 'Review', color: 'var(--mauve)' },
    { id: 'done', title: 'Done', color: 'var(--green)' },
  ];

  return (
    <div className="project-planning-page">
      <div className="planning-header">
        <div className="container">
          <div className="header-top">
            <div>
              <h1>Project Planning</h1>
              <p>Manage your projects with boards, tasks, and milestones</p>
            </div>
            <button className="btn-primary">
              <FiPlus /> New Board
            </button>
          </div>

          <div className="board-tabs">
            {boards.map((board) => (
              <button
                key={board.id}
                className={`board-tab ${activeBoard === board.id ? 'active' : ''}`}
                onClick={() => setActiveBoard(board.id)}
              >
                {board.name}
              </button>
            ))}
          </div>

          <div className="planning-controls">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="view-toggle">
              <button
                className={viewMode === 'board' ? 'active' : ''}
                onClick={() => setViewMode('board')}
              >
                <FiGrid /> Board
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <FiList /> List
              </button>
            </div>

            <button className="filter-btn">
              <FiFilter /> Filter
            </button>
          </div>
        </div>
      </div>

      <div className="planning-content container">
        {viewMode === 'board' ? (
          <div className="kanban-board">
            {columns.map((column) => (
              <div key={column.id} className="kanban-column">
                <div className="column-header" style={{ borderTopColor: column.color }}>
                  <h3>{column.title}</h3>
                  <span className="task-count">
                    {currentBoard?.tasks.filter((t) => t.status === column.id).length || 0}
                  </span>
                </div>
                <div className="column-tasks">
                  {currentBoard?.tasks
                    .filter((t) => t.status === column.id)
                    .map((task) => (
                      <div key={task.id} className="task-card">
                        <div className="task-header">
                          <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                        </div>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <div className="task-meta">
                          {task.dueDate && (
                            <span className="meta-item">
                              <FiCalendar size={14} />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {task.assignees.length > 0 && (
                            <span className="meta-item">
                              <FiUsers size={14} />
                              {task.assignees.length}
                            </span>
                          )}
                        </div>
                        <div className="task-labels">
                          {task.labels.map((label) => (
                            <span key={label} className="label">
                              <FiTag size={10} />
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  <button className="add-task-btn">
                    <FiPlus /> Add Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="task-list">
            {currentBoard?.tasks.map((task) => (
              <div key={task.id} className="task-list-item">
                <input type="checkbox" checked={task.status === 'done'} />
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
                <span className={`status-badge ${task.status}`}>{task.status}</span>
                <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
