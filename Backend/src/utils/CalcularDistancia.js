export function calcularDistancia(lat1, lon1, lat2, lon2) {
    const radioTierraMetros = 6371000;
    const toRad = (grados) => (grados * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const prevResult = Math.sin(dLat/2) ** 2 +  
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) ** 2;

    const distanceMeters = 2 * radioTierraMetros * 
    Math.asin(Math.sqrt(prevResult));

    return distanceMeters
}

export const DentroBicicletero = (lat1, lon1,bicicletarios, radius) => {
    if(!lat1 || !lon1){
        throw new Error("Latitud y longitud son requeridos");
    }

    for (const b of bicicletarios){
        const dist = calcularDistancia(lat1,lon1,b.latitud,b.longitud);
        if (dist <= radius){
            return {dentro : true, bicicletario: b};
        }
    }
    return {dentro : false, bicicletario: null};
}