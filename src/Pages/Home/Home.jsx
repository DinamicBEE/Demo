import { useState } from 'react';

function Home() {
    const [data] = useState([
        {
          empleado: 'Juan Pérez',
          codigo: 'E001',
          estado: 'Cerrado',
          montoPos: 1000,
          montoFisico: 950,
          diferencia: -50,
          fecha: '2024-12-01',
        },
        {
          empleado: 'María López',
          codigo: 'E002',
          estado: 'Abierto',
          montoPos: 2000,
          montoFisico: 2000,
          diferencia: 0,
          fecha: '2024-12-02',
        },
    ]);

    return (
        <div className="flex">
            <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-6">Inicio</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Empleado</th>
                    <th className="border border-gray-300 px-4 py-2">Código</th>
                    <th className="border border-gray-300 px-4 py-2">Estado</th>
                    <th className="border border-gray-300 px-4 py-2">Monto POS</th>
                    <th className="border border-gray-300 px-4 py-2">Monto Físico</th>
                    <th className="border border-gray-300 px-4 py-2">Diferencia</th>
                    <th className="border border-gray-300 px-4 py-2">Fecha</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{row.empleado}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.codigo}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.estado}</td>
                    <td className="border border-gray-300 px-4 py-2">${row.montoPos}</td>
                    <td className="border border-gray-300 px-4 py-2">${row.montoFisico}</td>
                    <td className="border border-gray-300 px-4 py-2">${row.diferencia}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.fecha}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default Home;