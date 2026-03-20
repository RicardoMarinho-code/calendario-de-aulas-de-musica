// Tipos globais do projeto

export interface Aluno {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
}

export interface Professor {
  id: string;
  nome: string;
  instrumento: string;
}

export interface Aula {
  id: string;
  alunoId: string;
  professorId: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  instrumento: string;
  status: "agendada" | "concluida" | "cancelada";
}
