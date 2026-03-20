import { redirect } from "next/navigation";

export default function HomePage() {
  // Redireciona automaticamente para a rota da agenda
  redirect("/agenda");
}
