"use client";

import { useState, useMemo, FormEvent, useEffect } from "react";
import Button from "@/components/ui/Button";
import { getWeekDates, mockLessons } from "@/services/mock/lessons";
import { Lesson, Instrument } from "@/types/lesson";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

// Mock da Tabela de Estudantes (Conforme Escopo)
const mockStudents = [
  { id: "s1", name: "Lucas Silva" },
  { id: "s2", name: "Ana Santos" },
  { id: "s3", name: "Pedro Oliveira" },
  { id: "s4", name: "Maria Costa" },
  { id: "s5", name: "João Ferreira" },
  { id: "s6", name: "Beatriz Lima" },
  { id: "s7", name: "Carla Mendes" }
];

const instruments: Instrument[] = [
  "violao", "guitarra", "piano", "teclado", "bateria", "baixo", "canto", "violino", "saxofone", "flauta"
];

export default function AgendaPage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Atualiza a cada 1 minuto
    return () => clearInterval(timer);
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Custom Date Picker State no formato Dark Bubble
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  // Garantimos o estado das aulas baseado no mock para permitir edições
  const [allLessons, setAllLessons] = useState<Lesson[]>(mockLessons);
  
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState<Partial<Lesson>>({});

  const weekDatesStr = useMemo(() => getWeekDates(currentDate), [currentDate]);

  const weeklyLessons = useMemo(() => {
    return allLessons.filter(l => weekDatesStr.includes(l.date));
  }, [allLessons, weekDatesStr]);

  const selectedDayLessons = useMemo(() => {
    return allLessons.filter((l) => l.date === selectedDateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [allLessons, selectedDateStr]);

  // Navegação
  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split("T")[0]);
  };

  // Funções do Pseudo-Date-Picker
  const handleOpenDatePicker = () => {
    setPickerDate(new Date(currentDate));
    setShowDatePicker(!showDatePicker);
  };

  const jumpToDate = (day: number) => {
    const d = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), day, 12, 0, 0);
    setCurrentDate(d);
    setSelectedDateStr(d.toISOString().split("T")[0]);
    setShowDatePicker(false);
  };

  const pickerDaysInMonth = new Date(pickerDate.getFullYear(), pickerDate.getMonth() + 1, 0).getDate();
  const pickerFirstDay = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), 1).getDay(); // 0 is Sunday
  const daysArray = Array.from({ length: pickerDaysInMonth }, (_, i) => i + 1);

  // Funções do Modal
  const openNewLessonModal = (dateOverride?: string, timeOverride?: string) => {
    setEditingLesson(null);
    setFormData({
      date: dateOverride || selectedDateStr,
      startTime: timeOverride || "10:00",
      endTime: timeOverride ? `${String(Number(timeOverride.split(":")[0]) + 1).padStart(2, "0")}:00` : "11:00",
      status: "agendada",
      instrument: "violao",
      teacherName: "Prof. Ricardo",
      studentName: mockStudents[0].name
    });
    setIsModalOpen(true);
  };

  const openEditLessonModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({ ...lesson });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
  };

  const handleSaveLesson = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.date || !formData.startTime || !formData.endTime) return;

    if (editingLesson) {
      // Lógica de Remarcação do RF05
      const isTimeChanged = 
        editingLesson.date !== formData.date || 
        editingLesson.startTime !== formData.startTime || 
        editingLesson.endTime !== formData.endTime;

      if (isTimeChanged) {
        // Original vira "remarcada"
        const updatedOriginal = { ...editingLesson, status: "remarcada" as const };
        
        // Cria nova "agendada" no novo horário
        const newLesson: Lesson = {
          ...(formData as Lesson),
          id: Math.random().toString(36).substr(2, 9),
          status: "agendada",
        };

        setAllLessons(prev => 
          prev.map(l => l.id === editingLesson.id ? updatedOriginal : l).concat(newLesson)
        );
      } else {
        // Apenas edita/atualiza
        setAllLessons(prev =>
          prev.map(l => l.id === editingLesson.id ? (formData as Lesson) : l)
        );
      }
    } else {
      // Trata nova aula padrão
      const newLesson: Lesson = {
        ...(formData as Lesson),
        id: Math.random().toString(36).substr(2, 9),
      };
      setAllLessons(prev => [...prev, newLesson]);
    }
    handleCloseModal();
  };

  const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada":
        return "bg-amber-500/10 text-amber-500 border-l-4 border-l-amber-500 border-y border-y-amber-500/20 border-r border-r-amber-500/20 hover:bg-amber-500/20";
      case "realizada":
        return "bg-green-500/10 text-green-500 border-l-4 border-l-green-500 border-y border-y-green-500/20 border-r border-r-green-500/20 hover:bg-green-500/20";
      case "cancelada":
        return "bg-red-500/10 text-red-500 border-l-4 border-l-red-500 border-y border-y-red-500/20 border-r border-r-red-500/20 hover:bg-red-500/20";
      case "remarcada":
        return "bg-purple-500/10 text-purple-400 border-l-4 border-l-purple-500 border-y border-y-purple-500/20 border-r border-r-purple-500/20 hover:bg-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-300 border-l-4 border-l-gray-500 border-gray-600";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "agendada": return "bg-amber-500";
      case "realizada": return "bg-green-500";
      case "cancelada": return "bg-red-500";
      case "remarcada": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const monthLabel = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-6 text-gray-100 bg-gray-900 min-h-screen -m-4 md:-m-6 p-4 md:p-6 rounded-tl-2xl">
      {/* Esquerda: Agenda (Week Grid) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-900">
        {/* Header da Agenda */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            
            <div className="relative">
              <div 
                className="relative group cursor-pointer flex items-center gap-1" 
                title="Selecionar mês/ano"
                onClick={handleOpenDatePicker}
              >
                <h1 className="text-xl font-bold capitalize text-white group-hover:text-amber-500 transition-colors">
                  {monthLabel}
                </h1>
                <svg className={`w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              {showDatePicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                  <div className="absolute top-full left-0 mt-3 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-4 z-50 w-64 animate-slide-in">
                     <div className="flex justify-between items-center mb-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() - 1, 1)); }} 
                          className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                        </button>
                        <span className="text-white font-semibold text-sm capitalize">
                          {pickerDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() + 1, 1)); }} 
                          className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        </button>
                     </div>
                     <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">
                       <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                     </div>
                     <div className="grid grid-cols-7 gap-1 text-sm">
                       {Array.from({length: pickerFirstDay}).map((_, i) => <span key={`empty-${i}`} />)}
                       {daysArray.map(d => {
                         const isSelected = currentDate.getDate() === d && currentDate.getMonth() === pickerDate.getMonth() && currentDate.getFullYear() === pickerDate.getFullYear();
                         return (
                           <button 
                             key={d}
                             onClick={(e) => { e.stopPropagation(); jumpToDate(d); }}
                             className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-colors 
                              ${isSelected ? 'bg-amber-500 text-gray-900 font-bold shadow-md shadow-amber-500/20' 
                                : 'text-gray-300 hover:bg-gray-700'}`}
                           >
                             {d}
                           </button>
                         )
                       })}
                     </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
              <button
                onClick={handlePrevWeek}
                className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
                aria-label="Semana Anterior"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={handleNextWeek}
                className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
                aria-label="Próxima Semana"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => openNewLessonModal()}
            className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nova Aula
          </button>
        </div>

        {/* Grade CSS (Week Grid) */}
        <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl flex flex-col overflow-hidden">
          {/* Cabeçalho dos Dias */}
          <div className="grid grid-cols-8 border-b border-gray-700 bg-gray-800/50">
            {/* Coluna de Horários (vazia no topo) */}
            <div className="col-span-1 border-r border-gray-700 p-2 lg:p-3 flex items-end justify-center">
              <span className="text-xs text-gray-500 font-medium tracking-wider">GMT-3</span>
            </div>
            
            {/* Dias da semana */}
            {weekDatesStr.map((dateStr, idx) => {
              const dateObj = new Date(dateStr + "T12:00:00"); 
              const isSelected = dateStr === selectedDateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`col-span-1 border-r border-gray-700 p-2 lg:p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isSelected ? "bg-gray-700/50" : "hover:bg-gray-700/30"
                  }`}
                >
                  <span className={`text-xs font-semibold uppercase ${
                    isSelected ? 'text-amber-500' : 'text-gray-400'
                  }`}>
                    {dayNames[idx]}
                  </span>
                  <span className={`mt-1 text-lg lg:text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center ${
                    isSelected ? 'bg-amber-500 text-gray-900' : 'text-gray-200'
                  }`}>
                    {dateObj.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Corpo da Grade scrollável */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {/* Linhas de Horas no background */}
            <div className="w-full absolute inset-0 grid grid-rows-[repeat(13,minmax(80px,1fr))]">
               {HOURS.map((h) => (
                 <div key={h} className="border-b border-gray-700/50 w-full flex">
                   <div className="w-[12.5%] min-w-[60px] border-r border-gray-700 p-2">
                     <span className="text-xs text-gray-500 block text-right pr-2">
                       {h.toString().padStart(2, '0')}:00
                     </span>
                   </div>
                   <div className="w-[87.5%] grid grid-cols-7">
                     {/* Colunas vazias para compor a grade perfeitamente */}
                     {Array.from({length: 7}).map((_, i) => (
                       <div key={i} className={`border-r border-gray-700/50 ${i === 6 ? 'border-transparent' : ''}`} />
                     ))}
                   </div>
                 </div>
               ))}
            </div>

            {/* Aulas renderizadas por cima */}
            <div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
              <div className="col-span-1" />
              {weekDatesStr.map((dateStr) => {
                const dayLessons = weeklyLessons.filter(l => l.date === dateStr);
                const localRealToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const isRealTodayString = dateStr === localRealToday;
                
                return (
                  <div 
                    key={dateStr} 
                    className="col-span-1 relative pointer-events-auto h-full border-r border-transparent cursor-pointer group"
                    onClick={(e) => {
                      // Impede que clique no card propague para criar aula
                      if ((e.target as HTMLElement).closest('.lesson-card')) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const yOffset = e.clientY - rect.top;
                      const clickedHour = 8 + Math.floor(yOffset / 80);
                      if (clickedHour >= 8 && clickedHour <= 20) {
                        openNewLessonModal(dateStr, `${String(clickedHour).padStart(2, '0')}:00`);
                      }
                    }}
                  >
                    {/* Efeito Hover nas colunas de horas */}
                    <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-white/[0.02]" />

                    {/* Linha vermelha de indicação de "agora" se for o dia de hoje real */}
                    {isRealTodayString && now.getHours() >= 8 && now.getHours() <= 20 && (
                      <div 
                        className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none" 
                        style={{ top: `${((now.getHours() + now.getMinutes() / 60) - 8) * 80}px` }}
                      >
                         <div className="absolute -left-[5px] -top-[5px] w-2.5 h-2.5 bg-red-500 rounded-full" />
                      </div>
                    )}

                    {dayLessons.map(lesson => {
                      const [startH, startM] = lesson.startTime.split(":").map(Number);
                      const [endH, endM] = lesson.endTime.split(":").map(Number);
                      
                      const startOffsetHours = (startH + startM/60) - 8;
                      const durationHours = (endH + endM/60) - (startH + startM/60);
                      
                      const top = startOffsetHours * 80;
                      const height = durationHours * 80;

                      if (top < 0 || top > 13*80 || height <= 0) return null;

                      return (
                         <div 
                           key={lesson.id}
                           onClick={() => openEditLessonModal(lesson)}
                           className={`lesson-card absolute left-1 right-1 rounded-md text-xs p-1.5 overflow-hidden shadow-sm transition-all hover:scale-[1.02] cursor-pointer ${getStatusColor(lesson.status)}`}
                           style={{ top: `${top}px`, height: `${height - 2}px` }}
                           title={`${lesson.studentName} - ${lesson.instrument} (${lesson.startTime} - ${lesson.endTime})`}
                         >
                           <div className="font-semibold truncate">{lesson.studentName}</div>
                           <div className="text-[10px] opacity-80 flex items-center justify-between">
                             <span>{lesson.startTime}</span>
                             <span className="capitalize">{lesson.instrument}</span>
                           </div>
                           {lesson.status === "remarcada" && (
                             <div className="text-[9px] mt-0.5 line-through opacity-75">
                               Remarcada
                             </div>
                           )}
                         </div>
                      );
                    })}
                  </div>
                )
              })}
            </div>
            
          </div>
        </div>
      </div>

      {/* Direita: Aulas do Dia Selecionado */}
      <div className="w-full lg:w-80 bg-gray-800 rounded-xl shadow-xl border border-gray-700 flex flex-col mt-14 lg:mt-0 lg:h-full lg:max-h-[calc(100vh-80px)]">
        <div className="p-5 border-b border-gray-700 bg-gray-800/80 rounded-t-xl shrink-0">
          <h2 className="text-lg font-bold text-white mb-1">Aulas do Dia</h2>
          <p className="text-sm text-amber-500 font-medium">
            {new Date(selectedDateStr + "T12:00:00").toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long"
            })}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-600">
          {selectedDayLessons.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
              <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="text-gray-400 text-sm">Nenhuma aula marcada<br/>para esta data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDayLessons.map(lesson => (
                <div 
                  key={lesson.id} 
                  onClick={() => openEditLessonModal(lesson)}
                  className="bg-gray-700/30 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-mono text-gray-400 font-medium">
                       {lesson.startTime} - {lesson.endTime}
                     </span>
                     <span className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider ${
                        lesson.status === "agendada" ? "text-amber-500" :
                        lesson.status === "realizada" ? "text-green-500" :
                        lesson.status === "cancelada" ? "text-red-500" :
                        "text-purple-400"
                     }`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(lesson.status)}`}></span>
                       {lesson.status}
                     </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-100 flex items-center gap-2">
                    {lesson.studentName}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                     <span className="bg-gray-800 px-2 py-1 rounded-md capitalize border border-gray-700">
                       {lesson.instrument}
                     </span>
                     <span className="truncate flex-1">
                       {lesson.teacherName}
                     </span>
                  </div>

                  {lesson.notes && (
                    <div className="mt-3 text-xs bg-gray-800 p-2 rounded text-gray-400 border border-gray-700/50">
                      <strong>Nota: </strong> {lesson.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova/Editar Aula */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">
                {editingLesson ? "Editar/Remarcar Aula" : "Nova Aula"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveLesson} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Aluno</label>
                <select 
                  required
                  value={formData.studentName || ""}
                  onChange={e => setFormData({...formData, studentName: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  <option value="" disabled>Selecione o aluno</option>
                  {mockStudents.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Professor</label>
                  <input 
                    type="text"
                    required
                    value={formData.teacherName || ""}
                    onChange={e => setFormData({...formData, teacherName: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Instrumento</label>
                  <select 
                    required
                    value={formData.instrument || "violao"}
                    onChange={e => setFormData({...formData, instrument: e.target.value as Instrument})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none capitalize"
                  >
                    {instruments.map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Data</label>
                <input 
                  type="date"
                  required
                  value={formData.date || ""}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Início</label>
                  <input 
                    type="time"
                    required
                    value={formData.startTime || ""}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Término</label>
                  <input 
                    type="time"
                    required
                    value={formData.endTime || ""}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select 
                  required
                  value={formData.status || "agendada"}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none capitalize"
                >
                  <option value="agendada">Agendada</option>
                  <option value="realizada">Realizada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="remarcada">Remarcada</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-700 flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-5 rounded-lg shadow-md focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}