import GestionarBicicletarios from "./GestionarBicicletario";
import VistaGeneralSistema from "./VistaGeneralSistema";

export const BicicletarioManagment = () => {
return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col gap-8"> 

      <section>
        <GestionarBicicletarios/>
      </section>

      <section className="max-w-5xl mx-auto w-full">
        <VistaGeneralSistema/>
      </section>

    </div>
)
}