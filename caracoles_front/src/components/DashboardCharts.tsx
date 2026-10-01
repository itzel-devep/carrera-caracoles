import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const apuestasData = [
  { name: 'Ganadas', value: 15, fill: '#22c55e' },
  { name: 'Perdidas', value: 10, fill: '#ef4444' },
];

const carrerasData = [
  { name: 'Rayo', victorias: 2 },
  { name: 'Turbo', victorias: 1 },
  { name: 'Lento', victorias: 0 },
  { name: 'Flash', victorias: 2 },
  { name: 'Sonic', victorias: 1 },
  { name: 'Baba', victorias: 0 },
];

export const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Tus Apuestas</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={apuestasData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Victorias del Día (6 Carreras)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={carrerasData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="victorias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
