import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {AlertCircle} from "lucide-react";
import {socketUrl} from "../constants/baseUrl";
import {useAuth} from "../hooks/useAuth";
import DataTable from "./DataTable";

function Dashboard() {
  const {token} = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {lastMessage} = useWebSocket(
    `${socketUrl}ws/random-numbers?token=${token}`
  );

  useEffect(() => {
    if (lastMessage) {
      try {
        const parsedData = JSON.parse(lastMessage.data);
        setData((prevData) => {
          const newData = [...prevData, parsedData];
          if (newData.length > 50) newData.shift();
          return newData;
        });
      } catch (err) {
        setError("Error parsing real-time data");
      }
    }
  }, [lastMessage]);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Real-time Data
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="timestamp"
                  stroke="#9CA3AF"
                  tick={{fill: "#9CA3AF"}}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString()
                  }
                />
                <YAxis stroke="#9CA3AF" tick={{fill: "#9CA3AF"}} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.375rem",
                    color: "#fff",
                  }}
                />
                <Line
                  type="linear"
                  dataKey="value"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Data Table</h2>
          <DataTable />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
