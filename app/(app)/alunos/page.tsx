"use client";

import { useState } from "react";
import { useAppContext, Student, PaymentMethod } from "../AppContext";

export default function AlunosPage() {
  const { students, setStudents } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({});

  const openNewModal = () => {
    setFormData({ status: "ativo", paymentMethod: "Pix", instrument: "Violão", lessonPrice: 450 });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.id) {
      setStudents(students.map(s => s.id === formData.id ? { ...s, ...formData } as Student : s));
    } else {
      setStudents([...students, { ...formData, id: Date.now().toString() } as Student]);
    }
    
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 min-h-screen p-4 md:p-8 rounded-tl-2xl animate-fade-in space-y-8">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Meus Alunos</h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">Gerencie sua lista de estudantes, mensalidades e observações.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center"
        >
          Adicionar Aluno
        </button>
      </div>

      {/* Lista / Tabela */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800/80 border-b border-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Aluno</th>
                <th scope="col" className="px-6 py-4 font-bold">Instrumento</th>
                <th scope="col" className="px-6 py-4 font-bold">Contato</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Valor / Pgto</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Status</th>
                <th scope="col" className="px-6 py-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-amber-500/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Nenhum aluno cadastrado ainda</p>
                        <p className="text-gray-500 text-xs mt-1">Comece adicionando seu primeiro aluno pelo botão acima.</p>
                      </div>
                      <button
                        onClick={openNewModal}
                        className="mt-1 text-sm font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-5 py-2.5 rounded-xl transition-all animate-pulse-ring"
                      >
                        Adicionar Primeiro Aluno
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-black border border-amber-500/30">
                        {student.name.charAt(0)}
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize font-medium">{student.instrument}</td>
                  <td className="px-6 py-4">
                    <span className="block">{student.phone}</span>
                    <span className="text-xs text-gray-500 block">{student.email}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-emerald-400 block">R$ {student.lessonPrice},00</span>
                    <span className="text-xs px-2 py-0.5 mt-1 bg-gray-700 rounded text-gray-300 inline-block">{student.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.status === "ativo" ? (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 border border-green-400/20 rounded-full">Ativo</span>
                    ) : (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 border border-red-400/20 rounded-full">Inativo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setFormData(student); setIsModalOpen(true); }}
                      className="text-amber-500 hover:text-amber-400 font-semibold px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL Cadastro/Edição de Aluno - RF03 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-gray-800/95 ring-1 ring-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transform transition-all">
            <div className="px-8 py-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-800/50 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  {formData.id ? "Editar Aluno" : "Novo Aluno"}
                </h2>
                <p className="text-sm text-gray-400 mt-1 font-medium tracking-wide">Preencha as informações do estudante abaixo</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-gray-700/50 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="md:col-span-2 group">
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Nome Completo</label>
                  <input type="text" required value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder-gray-600 hover:bg-gray-800/80 shadow-inner" placeholder="Ex: João da Silva"/>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">E-mail</label>
                  <input type="email" required value={formData.email || ""} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder-gray-600 hover:bg-gray-800/80 shadow-inner" placeholder="joao@email.com"/>
                </div>

                {/* Telefone */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Telefone / WhatsApp</label>
                  <input type="tel" required value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder-gray-600 hover:bg-gray-800/80 shadow-inner" placeholder="(11) 99999-9999"/>
                </div>

                {/* Instrumento */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Instrumento</label>
                  <select required value={formData.instrument || ""} onChange={e => setFormData({...formData, instrument: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all hover:bg-gray-800/80 shadow-inner appearance-none cursor-pointer">
                    <option value="Violão">Violão</option>
                    <option value="Guitarra">Guitarra</option>
                    <option value="Piano">Piano</option>
                    <option value="Canto">Canto</option>
                    <option value="Bateria">Bateria</option>
                    <option value="Baixo">Baixo</option>
                    <option value="Cavaquinho">Cavaquinho</option>
                  </select>
                </div>

                {/* Valor e Pagamento */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Valor (R$)</label>
                    <input type="number" required value={formData.lessonPrice || ""} onChange={e => setFormData({...formData, lessonPrice: Number(e.target.value)})} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all hover:bg-gray-800/80 shadow-inner"/>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Método</label>
                    <select required value={formData.paymentMethod || ""} onChange={e => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all hover:bg-gray-800/80 shadow-inner appearance-none cursor-pointer">
                      <option value="Pix">Pix</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Cartão">Cartão</option>
                      <option value="Transferência">Banco</option>
                    </select>
                  </div>
                </div>

                {/* Observações */}
                <div className="md:col-span-2 group">
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Observações (Metas, Nível...)</label>
                  <textarea rows={3} value={formData.notes || ""} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder-gray-600 hover:bg-gray-800/80 shadow-inner resize-none leading-relaxed" placeholder="Ex: O aluno é iniciante, objetivo tocar classic rock..."/>
                </div>
              </div>

              {/* Botões do form */}
              <div className="pt-6 mt-4 border-t border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl transition-all active:scale-95 text-center">
                  Cancelar
                </button>
                <button type="submit" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-gray-900 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transform hover:-translate-y-0.5 active:scale-95 transition-all text-center">
                  Salvar Aluno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
