import { Lesson } from "@/types/lesson";

export function getWeekDates(date: Date = new Date()): string[] {
  const current = new Date(date);
  const dayOfWeek = current.getDay();
  const monday = new Date(current);
  // Ajusta para segunda-feira (getDay() = 0 é Domingo, 1 é Segunda)
  monday.setDate(current.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

// Inicializa a semana atual como base mock
const week = getWeekDates(new Date());

export const mockLessons: Lesson[] = [
  // Segunda
  {
    id: "1",
    studentName: "Lucas Silva",
    teacherName: "Prof. Ricardo",
    instrument: "violao",
    date: week[0],
    startTime: "08:00",
    endTime: "09:00",
    status: "realizada",
  },
  {
    id: "2",
    studentName: "Ana Santos",
    teacherName: "Prof. Camila",
    instrument: "piano",
    date: week[0],
    startTime: "09:00",
    endTime: "10:00",
    status: "cancelada",
    notes: "A aluna ficou doente",
  },
  {
    id: "3",
    studentName: "Pedro Oliveira",
    teacherName: "Prof. Ricardo",
    instrument: "guitarra",
    date: week[0],
    startTime: "14:00",
    endTime: "15:00",
    status: "realizada",
  },
  // Terça
  {
    id: "4",
    studentName: "Maria Costa",
    teacherName: "Prof. Bruno",
    instrument: "bateria",
    date: week[1],
    startTime: "10:00",
    endTime: "11:00",
    status: "agendada",
  },
  {
    id: "4-remarcada",
    studentName: "João Ferreira",
    teacherName: "Prof. Camila",
    instrument: "canto",
    date: week[1],
    startTime: "13:00", // original era 13h
    endTime: "14:00",
    status: "remarcada",
    notes: "Remarcada para 15h a pedido do professor",
  },
  {
    id: "5",
    studentName: "João Ferreira",
    teacherName: "Prof. Camila",
    instrument: "canto",
    date: week[1],
    startTime: "15:00",
    endTime: "16:00",
    status: "agendada",
  },
  // Quarta
  {
    id: "6",
    studentName: "Beatriz Lima",
    teacherName: "Prof. Ricardo",
    instrument: "violao",
    date: week[2],
    startTime: "08:00",
    endTime: "09:00",
    status: "agendada",
  },
  // Quinta
  {
    id: "8",
    studentName: "Ana Santos",
    teacherName: "Prof. Camila",
    instrument: "piano",
    date: week[3],
    startTime: "09:00",
    endTime: "10:00",
    status: "agendada",
  },
  // Hoje / Sexta (vamos colocar algumas para sexta e sabado)
  {
    id: "10",
    studentName: "Carla Mendes",
    teacherName: "Prof. Bruno",
    instrument: "bateria",
    date: week[4],
    startTime: "10:00",
    endTime: "11:00",
    status: "agendada",
  },
  {
    id: "11",
    studentName: "Pedro Oliveira",
    teacherName: "Prof. Ricardo",
    instrument: "violao",
    date: week[4],
    startTime: "14:00",
    endTime: "15:00",
    status: "agendada",
  },
  // Sábado
  {
    id: "12",
    studentName: "Maria Costa",
    teacherName: "Prof. Camila",
    instrument: "canto",
    date: week[5],
    startTime: "09:00",
    endTime: "10:00",
    status: "agendada",
  },
];

export function getLessonsByDate(date: string): Lesson[] {
  return mockLessons.filter((lesson) => lesson.date === date);
}

// Filtra as aulas baseadas numa data inicial da semana
export function getLessonsByWeek(weekStartIso: string): Lesson[] {
  const dates = getWeekDates(new Date(weekStartIso));
  return mockLessons.filter((lesson) => dates.includes(lesson.date));
}

export function getLessonById(id: string): Lesson | undefined {
  return mockLessons.find((lesson) => lesson.id === id);
}
