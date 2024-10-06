'use client';
import React, { useRef, useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { TouchBackend } from 'react-dnd-touch-backend';

interface Developer {
  _id: string;
  name: string;
}

interface Task {
  _id: string;
  title: string;
  status: 'tasks' | 'inprogress' | 'testing' | 'done';
  developer: Developer | null;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface DragItem {
  id: string;
  index: number;
  status: string;
  type: string;
}

const TaskCard: React.FC<{ 
  task: Task; 
  index: number; 
  status: string;
  moveTask: (fromStatus: string, toStatus: string, dragIndex: number, hoverIndex: number) => void 
}> = ({ task, index, status, moveTask }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>( {
    type: 'TASK',
    item: { id: task._id, index, status, type: 'TASK' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop<DragItem, unknown, unknown>({
    accept: 'TASK',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex && item.status === status) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveTask(item.status, status, dragIndex, hoverIndex);
      item.index = hoverIndex;
      item.status = status;
    },
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '8px 0',
        backgroundColor: '#456C86',
        color: 'white',
        borderRadius: '4px',
        cursor: 'move',
        maxWidth: '100%', // Ensure the task card doesn't exceed its parent's width
        boxSizing: 'border-box', // Include padding and border in the element's total width and height
      }}
    >
      <div>{task.title}</div>
      <div style={{ fontSize: '0.8em', marginTop: '4px' }}>
        {task.developer ? task.developer.name : 'Unassigned'}
      </div>
    </div>
  );
};

const Column: React.FC<{ 
  column: Column; 
  moveTask: (fromStatus: string, toStatus: string, dragIndex: number, hoverIndex: number) => void 
}> = ({ column, moveTask }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<DragItem, unknown, unknown>({
    accept: 'TASK',
    drop(item: DragItem) {
      const dragIndex = item.index;
      const hoverIndex = column.tasks.length;
      if (item.status !== column.id) {
        moveTask(item.status, column.id, dragIndex, hoverIndex);
        item.index = hoverIndex;
        item.status = column.id;
      }
    },
  });

  drop(ref);

  return (
    <div 
      ref={ref} 
      style={{ 
        flex: '1 1 250px', // Flexible width for responsiveness
        backgroundColor: '#f4f5f7',
        borderRadius: '4px',
        padding: '8px',
        marginRight: '16px',
        minWidth: '200px', // Minimum width for smaller screens
        boxSizing: 'border-box', // Include padding and border in the element's total width and height
      }}
    >
      <h3 style={{ marginBottom: '8px' }}>{column.title}</h3>
      {column.tasks.map((task, index) => (
        <TaskCard 
          key={task._id} 
          task={task} 
          index={index}
          status={column.id}
          moveTask={moveTask} 
        />
      ))}
    </div>
  );
};

const Board: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'tasks', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'testing', title: 'Testing', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ]);
  const [, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tasksRes, devsRes] = await Promise.all([
          axios.get<Task[]>('/api/tasks'),
          axios.get<Developer[]>('/api/developer')
        ]);

        setDevelopers(devsRes.data);

        const newColumns = columns.map(column => ({
          ...column,
          tasks: tasksRes.data.filter(task => task.status === column.id)
        }));

        setColumns(newColumns);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const moveTask = async (fromStatus: string, toStatus: string, dragIndex: number, hoverIndex: number) => {
    const newColumns = JSON.parse(JSON.stringify(columns));
    const fromColumn = newColumns.find((col: Column) => col.id === fromStatus);
    const toColumn = newColumns.find((col: Column) => col.id === toStatus);
    const [removedTask] = fromColumn.tasks.splice(dragIndex, 1);

    removedTask.status = toStatus;
    toColumn.tasks.splice(hoverIndex, 0, removedTask);

    setColumns(newColumns);

    try {
      await axios.patch(`/api/tasks/${removedTask._id}`, { status: toStatus });
    } catch (error) {
      console.error('Error updating task:', error);
      // Optionally, revert the state if the API call fails
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Task Tracker</h1>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => router.push('/createTasks')} 
            style={{ marginRight: '10px', padding: '10px 15px', cursor: 'pointer', borderRadius: '4px', backgroundColor: '#5CB85C', color: 'white' }}
          >
            Create Task
          </button>
          <button 
            onClick={() => router.push('/addDeveloper')} 
            style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '4px', backgroundColor: '#0275D8', color: 'white' }}
          >
            Add Developer
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '20px' }}>
          {columns.map(column => (
            <Column key={column.id} column={column} moveTask={moveTask} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Board;
