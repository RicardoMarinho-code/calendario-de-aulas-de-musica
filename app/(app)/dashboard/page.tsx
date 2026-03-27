"use client";

import { useMemo } from "react";
import { useAppContext } from "../AppContext";
import Link from "next/link";

export default function DashboardPage() {
  const { lessons, payments, students } = useAppContext();

  // Simulação das métricas baseadas no contexto unificado (RF08)
  const todayClasses = lessons.filter(l => l.status === "agendada").length;
  const completedClasses = lessons.filter(l => l.status === "realizada").length;
  const canceledClasses = lessons.filter(l => l.status === "cancelada").length;

  // Calcula faturamento real baseado na aba Financeiro!
  const revenue = payments.filter(p => p.status === "pago").reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex flex-col h-full w-full text-gray-100 bg-gray-900 min-h-screen p-4 md:p-8 rounded-tl-2xl space-y-8 animate-fade-in">

      {/* HERO SECTION - Transformando o Dashboard */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-300 p-8 sm:p-10 shadow-2xl shadow-amber-500/10 text-gray-900 border border-amber-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Olá, Bruno!</h1>
            <p className="mt-2 text-amber-900 font-medium max-w-xl text-lg leading-relaxed">
              O mês está produtivo! Seu estúdio já garantiu <b className="font-extrabold text-gray-900">R$ {revenue},00</b> em faturamento e você tem {todayClasses} aulas marcadas para hoje.
            </p>
          </div>
          <Link href="/alunos" className="shrink-0 bg-gray-900 hover:bg-black text-amber-500 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center border border-gray-800 w-full md:w-auto text-center">
            Adicionar Novo Aluno
          </Link>
        </div>

        {/* Elementos visuais abstratos para dar cara de Dashboard Premium */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* RF08 - Métricas de Relatório */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Faturamento (Mês)"
          value={`R$ ${revenue},00`}
          subtitle="Geração de receita atual"
        />
        <MetricCard
          title="Aulas Hoje / Pendentes"
          value={todayClasses.toString()}
          subtitle="Na sua agenda de hoje"
        />
        <MetricCard
          title="Aulas Realizadas"
          value={completedClasses.toString()}
          subtitle="Neste mês"
        />
        <MetricCard
          title="Taxa de Cancelamento"
          value={canceledClasses.toString()}
          subtitle="Aulas desmarcadas"
        />
      </div>

      {/* Seção Inferior: Acesso Rápido à Agenda (RF05) e Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Card: Próximas Aulas */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-700 bg-gray-800/80 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Próximas Aulas
            </h2>
            <Link href="/agenda" className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
              Ver Agenda &rarr;
            </Link>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4">
            {lessons.filter(l => l.status === "agendada").slice(0, 3).map((lesson, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex flex-col items-center justify-center border border-amber-500/20">
                    <span className="text-[10px] uppercase font-bold leading-none">{lesson.date.split("-")[2]}</span>
                    <span className="text-[10px] uppercase font-medium leading-none">
                      {new Date(lesson.date + "T12:00:00").toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white truncate">{lesson.studentName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <span className="text-amber-500">{lesson.startTime}</span> &bull; <span className="capitalize">{lesson.instrument}</span>
                    </p>
                  </div>
                </div>
                <button className="text-xs font-semibold px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors border border-gray-600">
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Atividades do Financeiro / Gráfico Simulado */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-700 bg-gray-800/80 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Resumo de Receitas
            </h2>
            <button className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
              Detalhes &rarr;
            </button>
          </div>
          <div className="p-5 flex-1 flex items-center justify-center">
            {/* Gráfico Mockado Visual */}
            <div className="w-full h-full min-h-[200px] flex items-end justify-between px-4 pb-2 gap-2 opacity-80 mt-8">
              {[40, 60, 30, 80, 55, 90, 70].map((h, index) => (
                <div key={index} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t-sm transition-all group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] relative" style={{ height: `${h}%` }}>
                    {/* Tooltip Hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-lg border border-gray-700 whitespace-nowrap">
                      R$ {h * 40},00
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-500">Sem {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Componente visual reutilizável de métricas MINIMALISTA
function MetricCard({ title, value, subtitle }: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-gray-800/40 rounded-3xl border border-gray-700/50 p-6 shadow-sm hover:bg-gray-800/80 transition-all duration-300">
      <div className="flex flex-col justify-between items-start h-full">
        <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl sm:text-4xl font-black text-amber-500 mb-1">{value}</h3>
        <p className="text-xs text-gray-500 font-medium mt-auto pt-2">{subtitle}</p>
      </div>
    </div>
  );
}
