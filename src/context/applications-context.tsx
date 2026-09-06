import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname } from 'expo-router';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ApplicationStatus =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Follow-up'
  | 'Offer'
  | 'Rejected';

export type ApplicationTask = {
  id: string;
  title: string;
  due?: string;
  notes?: string;
  completed: boolean;
};

export type Application = {
  id: string;
  company: string;
  role: string;
  location: string;
  workSetup: string;
  dateApplied: string;
  jobLink: string;
  appliedVia: string;
  salary: string;
  contact: string;
  contactInfo: string;
  notes: string;
  status: ApplicationStatus;
  tasks: ApplicationTask[];
  createdAt: number;
  updatedAt: number;
};

type ApplicationInput = Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'tasks' | 'status'> & {
  status?: ApplicationStatus;
  tasks?: ApplicationTask[];
};

type ApplicationsContextValue = {
  applications: Application[];
  loading: boolean;
  addApplication: (input: ApplicationInput) => Promise<Application>;
  updateApplication: (id: string, input: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  updateStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  toggleTask: (applicationId: string, taskId: string) => Promise<void>;
  addTask: (applicationId: string, title: string, due?: string, notes?: string) => Promise<void>;
  updateTask: (applicationId: string, taskId: string, input: Partial<ApplicationTask>) => Promise<void>;
  deleteTask: (applicationId: string, taskId: string) => Promise<void>;
  getApplication: (id: string) => Application | undefined;
};

const STORAGE_KEY = '@koda/applications/v3';

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!active) return;
        setApplications(raw ? JSON.parse(raw) : []);
      } catch {
        if (active) setApplications([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(applications)).catch(() => {});
  }, [applications, loading]);

  const value = useMemo<ApplicationsContextValue>(() => {
    const addApplication = async (input: ApplicationInput) => {
      const now = Date.now();
      const item: Application = {
        ...input,
        id: makeId(),
        status: input.status ?? 'Applied',
        tasks: input.tasks ?? [],
        createdAt: now,
        updatedAt: now,
      };
      setApplications((prev) => [item, ...prev]);
      return item;
    };

    const updateApplication = async (id: string, input: Partial<Application>) => {
      setApplications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...input, updatedAt: Date.now() } : item
        )
      );
    };

    const deleteApplication = async (id: string) => {
      setApplications((prev) => prev.filter((item) => item.id !== id));
    };

    const updateStatus = async (id: string, status: ApplicationStatus) => {
      await updateApplication(id, { status });
    };

    const toggleTask = async (applicationId: string, taskId: string) => {
      setApplications((prev) =>
        prev.map((item) =>
          item.id !== applicationId
            ? item
            : {
                ...item,
                updatedAt: Date.now(),
                tasks: item.tasks.map((task) =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                ),
              }
        )
      );
    };

    const addTask = async (applicationId: string, title: string, due?: string, notes?: string) => {
      const clean = title.trim();
      if (!clean) return;
      setApplications((prev) =>
        prev.map((item) =>
          item.id !== applicationId
            ? item
            : {
                ...item,
                updatedAt: Date.now(),
                tasks: [
                  ...item.tasks,
                  { id: makeId(), title: clean, due: due?.trim(), notes: notes?.trim(), completed: false },
                ],
              }
        )
      );
    };

    const updateTask = async (applicationId: string, taskId: string, input: Partial<ApplicationTask>) => {
      setApplications((prev) =>
        prev.map((item) =>
          item.id !== applicationId
            ? item
            : {
                ...item,
                updatedAt: Date.now(),
                tasks: item.tasks.map((task) =>
                  task.id === taskId ? { ...task, ...input } : task
                ),
              }
        )
      );
    };

    const deleteTask = async (applicationId: string, taskId: string) => {
      setApplications((prev) =>
        prev.map((item) =>
          item.id !== applicationId
            ? item
            : { ...item, updatedAt: Date.now(), tasks: item.tasks.filter((task) => task.id !== taskId) }
        )
      );
    };

    return {
      applications,
      loading,
      addApplication,
      updateApplication,
      deleteApplication,
      updateStatus,
      toggleTask,
      addTask,
      updateTask,
      deleteTask,
      getApplication: (id: string) => applications.find((item) => item.id === id),
    };
  }, [applications, loading]);

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>;
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) throw new Error('useApplications must be used inside ApplicationsProvider');
  return context;
}

export function useApplicationFromRoute() {
  const pathname = usePathname();
  const id = pathname.split('/').filter(Boolean).pop() ?? '';
  return useApplications().getApplication(id);
}
