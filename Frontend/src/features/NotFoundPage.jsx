import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <img src={"/pepa.png"} alt="Img Not Found" />
      <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-800">
        Página no encontrada
      </h1>{" "}
      <p className="text-gray-500 mb-10 font-light">(Error 404)</p>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-8 py-3 rounded-full bg-blue-800 hover:bg-blue-900 text-white transition-colors duration-200 text-sm font-medium"
      >
        <Home className="w-4 h-4" /> <span>Ir al inicio</span>
      </button>
    </div>
  );
};
