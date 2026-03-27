"use client";

import { useState } from "react";
import { useAppContext, Payment, PaymentMethod } from "../AppContext";

export default function FinanceiroPage() {
  const { payments, setPayments } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Payment>>({});

  const totalRecebido = payments.filter(p => p.status === "pago").reduce((acc, curr) => acc + curr.amount, 0);
  const totalPendente = payments.filter(p => p.status === "pendente").reduce((acc, curr) => acc + curr.amount, 0);

  const openNewModal = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      method: "Pix",
      status: "pago"
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      setPayments(payments.map(p => p.id === formData.id ? { ...p, ...formData } as Payment : p));
    } else {
      setPayments([{ ...formData, id: Date.now().toString() } as Payment, ...payments]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 min-h-screen p-4 md:p-8 rounded-tl-2xl animate-fade-in space-y-8">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Caixa e Recebimentos</h1>
        </div>
        <button
          onClick={openNewModal}
          className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center"
        >
          Lançar Recebimento
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-emerald-500 font-semibold mb-1 text-sm uppercase tracking-wide">Total Recebido (Mês)</p>
            <h2 className="text-3xl font-black text-white">R$ {totalRecebido},00</h2>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-semibold mb-1 text-sm uppercase tracking-wide">A Receber / Pendente</p>
            <h2 className="text-3xl font-black text-white">R$ {totalPendente},00</h2>
          </div>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden flex-1">
        <div className="p-5 border-b border-gray-700 bg-gray-800/80 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Lançamentos Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900/50 text-xs text-gray-400 uppercase tracking-widest border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold">Data</th>
                <th className="px-6 py-4 font-bold">Origem / Aluno</th>
                <th className="px-6 py-4 font-bold">Valor</th>
                <th className="px-6 py-4 font-bold">Método</th>
                <th className="px-6 py-4 font-bold text-center">Situação</th>
                <th className="px-6 py-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhum lançamento financeiro registrado.
                  </td>
                </tr>
              )}
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {payment.date.split("-").reverse().join("/")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white block">{payment.studentName}</span>
                    {payment.notes && <span className="text-xs text-gray-500 block truncate max-w-[200px]">{payment.notes}</span>}
                  </td>
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                    R$ {payment.amount},00
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs bg-gray-700 text-gray-300 rounded font-medium border border-gray-600">
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {payment.status === "pago" ? (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">Recebido</span>
                    ) : (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full">Pendente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { setFormData(payment); setIsModalOpen(true); }}
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

      {/* MODAL Lançamento - RF07 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-gray-800/95 ring-1 ring-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col transform transition-all">
            <div className="px-8 py-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-800/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  {formData.id ? "Editar Lançamento" : "Novo Recebimento"}
                </h2>
                <p className="text-sm text-gray-400 mt-1 font-medium tracking-wide">Registre os pagamentos abaixo</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-8 scrollbar-thin scrollbar-thumb-gray-600">
              <div className="flex flex-col gap-6">

                {/* Aluno Mapeamento Opcional / Nome */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Nome do Aluno / Origem</label>
                  <input type="text" required value={formData.studentName || ""} onChange={e => setFormData({ ...formData, studentName: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder-gray-600 hover:bg-gray-800/80 shadow-inner" placeholder="Ex: Lucas Silva" />
                </div>

                {/* Valor e Data */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Valor Final (R$)</label>
                    <input type="number" required value={formData.amount || ""} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all hover:bg-gray-800/80 shadow-inner" />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Data</label>
                    <input type="date" required value={formData.date || ""} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all hover:bg-gray-800/80 shadow-inner appearance-none uppercase" />
                  </div>
                </div>

                {/* Método e Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Método de Pagamento</label>
                    <select required value={formData.method || "Pix"} onChange={e => setFormData({ ...formData, method: e.target.value as PaymentMethod })} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all hover:bg-gray-800/80 shadow-inner appearance-none cursor-pointer">
                      <option value="Pix">Pix</option>
                      <option value="Dinheiro">Dinheiro vivo</option>
                      <option value="Cartão">Cartão</option>
                      <option value="Transferência">Banco TED/DOC</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Status</label>
                    <select required value={formData.status || "pago"} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all hover:bg-gray-800/80 shadow-inner appearance-none cursor-pointer font-bold">
                      <option value="pago" className="text-green-500">Já Recebido</option>
                      <option value="pendente" className="text-amber-500">A Receber</option>
                    </select>
                  </div>
                </div>

                {/* Observações */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors">Observações / Detalhes</label>
                  <textarea rows={2} value={formData.notes || ""} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-3.5 text-white focus:bg-gray-900 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder-gray-600 hover:bg-gray-800/80 shadow-inner resize-none leading-relaxed" placeholder="Ex: Pagamento referente ao pacote de aulas..." />
                </div>
              </div>

              {/* Botões do form */}
              <div className="pt-6 mt-6 border-t border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl transition-all active:scale-95 text-center">
                  Cancelar
                </button>
                <button type="submit" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-gray-900 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transform hover:-translate-y-0.5 active:scale-95 transition-all text-center">
                  Salvar Transação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
