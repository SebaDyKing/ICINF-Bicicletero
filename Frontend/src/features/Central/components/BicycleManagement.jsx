import GestionarBicicletarios from "./GestionarBicicletario";
import VistaGeneralSistema from "./VistaGeneralSistema";
import { AccessControl } from "./AccessControl";

export const BicicletarioManagment = ({dataGlobal}) => {
    const data = dataGlobal;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 flex flex-col gap-8">
            <section className="w-full">
                <GestionarBicicletarios racks={data.racks} />
            </section>

            <section className="w-full">
                <VistaGeneralSistema kpi={data.kpi} />
            </section>

            <section className="w-full">
                <AccessControl actividad={data.actividad} />
            </section>
        </div>
    );
};

export default BicicletarioManagment;