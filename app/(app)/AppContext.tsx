"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lesson, Instrument } from "@/types/lesson";

export type PaymentMethod = "Pix" | "Dinheiro" | "Cartão" | "Transferência";

export interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  instrument: string;
  lessonPrice: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: "ativo" | "inativo";
}

export interface Payment {
  id: string;
  studentName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  notes?: string;
  status: "pago" | "pendente";
}

interface AppContextData {
  students: Student[];
  setStudents: (students: Student[]) => void;
  lessons: Lesson[];
  setLessons: (lessons: Lesson[]) => void;
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

// Dados iniciais hardcoded para fallbacks
const initialStudents: Student[] = [
  { id: "s1", name: "Lucas Silva", phone: "(11) 99999-1111", email: "lucas@email.com", instrument: "Violão", lessonPrice: 450, paymentMethod: "Pix", status: "ativo" },
  { id: "s2", name: "Ana Santos", phone: "(21) 98888-2222", email: "ana@email.com", instrument: "Piano", lessonPrice: 600, paymentMethod: "Transferência", status: "ativo" },
  { id: "s3", name: "Marcos Vinicius", phone: "(11) 97777-3333", email: "marcos@email.com", instrument: "Guitarra", lessonPrice: 500, paymentMethod: "Cartão", status: "ativo" },
  { id: "s4", name: "Julia Mendonça", phone: "(21) 96666-4444", email: "julia@email.com", instrument: "Canto", lessonPrice: 850, paymentMethod: "Pix", status: "ativo" },
  { id: "s5", name: "Roberto Carlos", phone: "(11) 95555-5555", email: "roberto@email.com", instrument: "Violão", lessonPrice: 1200, paymentMethod: "Transferência", status: "ativo" },
  { id: "s6", name: "Camila Rocha", phone: "(21) 94444-6666", email: "camila@email.com", instrument: "Teclado", lessonPrice: 400, paymentMethod: "Dinheiro", status: "ativo" },
];

const getWeekDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

const initialLessons: Lesson[] = [
  { id: "1", studentName: "Lucas Silva", teacherName: "Prof.", instrument: "violao", date: getWeekDate(0), startTime: "14:00", endTime: "14:50", status: "agendada" },
  { id: "2", studentName: "Ana Santos", teacherName: "Prof.", instrument: "piano", date: getWeekDate(1), startTime: "09:00", endTime: "09:50", status: "agendada" },
  { id: "3", studentName: "Marcos Vinicius", teacherName: "Prof.", instrument: "guitarra", date: getWeekDate(0), startTime: "16:00", endTime: "16:50", status: "realizada" },
  { id: "4", studentName: "Julia Mendonça", teacherName: "Prof.", instrument: "canto", date: getWeekDate(2), startTime: "10:00", endTime: "10:50", status: "agendada" },
  { id: "5", studentName: "Roberto Carlos", teacherName: "Prof.", instrument: "violao", date: getWeekDate(-1), startTime: "11:00", endTime: "11:50", status: "realizada" },
];

const initialPayments: Payment[] = [
  { id: "p1", studentName: "Lucas Silva", amount: 450, date: getWeekDate(-5), method: "Pix", status: "pago", notes: "Mensalidade" },
  { id: "p2", studentName: "Ana Santos", amount: 600, date: getWeekDate(-3), method: "Transferência", status: "pago", notes: "Mensalidade" },
  { id: "p3", studentName: "Marcos Vinicius", amount: 500, date: getWeekDate(-2), method: "Cartão", status: "pago", notes: "Mensalidade" },
  { id: "p4", studentName: "Julia Mendonça", amount: 850, date: getWeekDate(-1), method: "Pix", status: "pago", notes: "Plano Intensivo" },
  { id: "p5", studentName: "Roberto Carlos", amount: 1200, date: getWeekDate(0), method: "Transferência", status: "pago", notes: "Semestre" },
  { id: "p6", studentName: "Camila Rocha", amount: 400, date: getWeekDate(2), method: "Dinheiro", status: "pendente", notes: "Mensalidade" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [students, setStudentsState] = useState<Student[]>(initialStudents);
  const [lessons, setLessonsState] = useState<Lesson[]>(initialLessons);
  const [payments, setPaymentsState] = useState<Payment[]>(initialPayments);

  // Carrega do localStorage no ínicio
  useEffect(() => {
    const savedStudents = localStorage.getItem("agenda_pro_v2_students");
    const savedLessons = localStorage.getItem("agenda_pro_v2_lessons");
    const savedPayments = localStorage.getItem("agenda_pro_v2_payments");

    if (savedStudents) setStudentsState(JSON.parse(savedStudents));
    if (savedLessons) setLessonsState(JSON.parse(savedLessons));
    if (savedPayments) setPaymentsState(JSON.parse(savedPayments));
    
    setIsLoaded(true);
  }, []);

  const setStudents = (newStudents: Student[]) => {
    setStudentsState(newStudents);
    localStorage.setItem("agenda_pro_v2_students", JSON.stringify(newStudents));
  };

  const setLessons = (newLessons: Lesson[]) => {
    setLessonsState(newLessons);
    localStorage.setItem("agenda_pro_v2_lessons", JSON.stringify(newLessons));
  };

  const setPayments = (newPayments: Payment[]) => {
    setPaymentsState(newPayments);
    localStorage.setItem("agenda_pro_v2_payments", JSON.stringify(newPayments));
  };

  // Evita reidratações falsas do server-side
  if (!isLoaded) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="animate-pulse text-amber-500">Carregando Banco de Dados...</div></div>;

  return (
    <AppContext.Provider value={{ students, setStudents, lessons, setLessons, payments, setPayments }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext deve ser usado dentro de um AppProvider");
  }
  return context;
}
