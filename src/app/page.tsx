// Componente principal de la aplicación.
// Representa la pantalla inicial (ruta "/").
// Importa y renderiza el componente Header junto a un título,
// demostrando el uso de componentes reutilizables en la interfaz.
import Header from "@/components/Header";

// Componente principal de la aplicación (ruta "/")
// Renderiza el Header y un título en pantalla,
// demostrando el uso de componentes reutilizables dentro de una página
export default function Home() {
  return (
    <>
      <Header />
      <h1>Green Acress</h1>
    </>
  );
}

