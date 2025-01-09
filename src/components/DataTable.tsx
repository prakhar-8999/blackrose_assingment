import {AlertCircle, Edit2, Save, Trash2, X} from "lucide-react";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {baseurl} from "../constants/baseUrl";
import {useAuth} from "../hooks/useAuth";

interface Record {
  user: string;
  broker: string;
  API_key: string;
  API_secret: string;
  pnl: number;
  margin: number;
  max_risk: number;
}

function DataTable() {
  const {token} = useAuth();
  const [records, setRecords] = useState<Record[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<Record | null>(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch(baseurl + "csv", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch records");
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError("Error fetching records");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [token]);

  const handleEdit = (record: Record) => {
    setEditingId(record.user);
    setEditRecord({...record});
  };

  const handleSave = async () => {
    if (!editRecord) return;
    try {
      const payload = {
        broker: editRecord.broker,
        API_key: editRecord.API_key,
        API_secret: editRecord.API_secret,
        pnl: Number(editRecord.pnl),
        margin: Number(editRecord.margin),
        max_risk: Number(editRecord.max_risk),
        user: editRecord.user,
      };

      const response = await fetch(`${baseurl}csv/${editRecord.user}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update record");
      }

      fetchRecords();
      setEditingId(null);
      setEditRecord(null);
    } catch (err) {
      setError("Error updating record");
    }
  };

  const handleDelete = async (user: string) => {
    try {
      const response = await fetch(`${baseurl}csv/${user}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete record");
      fetchRecords();
    } catch (err) {
      setError("Error deleting record");
    }
  };

  const handleRestore = async () => {
    const response = await fetch(baseurl + "restore", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();

    if (!response.ok) {
      toast.error(res.detail);
    }
    fetchRecords();
  };

  const handleInputChange = (field: keyof Record, value: string) => {
    if (!editRecord) return;

    let parsedValue: string | number = value;
    if (field === "pnl" || field === "margin" || field === "max_risk") {
      parsedValue = parseFloat(value) || 0;
    }

    setEditRecord({
      ...editRecord,
      [field]: parsedValue,
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleRestore}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Restore Backup
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Broker
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                API Key
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                API Secret
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                PNL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Max Risk
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {records.map((record) => (
              <tr key={record.user}>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {record.user}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {editingId === record.user ? (
                    <input
                      type="text"
                      value={editRecord?.broker || ""}
                      onChange={(e) =>
                        handleInputChange("broker", e.target.value)
                      }
                      className="bg-gray-700 text-white px-2 py-1 rounded-md w-full"
                    />
                  ) : (
                    record.broker
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {editingId === record.user ? (
                    <input
                      type="text"
                      value={editRecord?.API_key || ""}
                      onChange={(e) =>
                        handleInputChange("API_key", e.target.value)
                      }
                      className="bg-gray-700 text-white px-2 py-1 rounded-md w-full"
                    />
                  ) : (
                    record.API_key
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {editingId === record.user ? (
                    <input
                      type="text"
                      value={editRecord?.API_secret || ""}
                      onChange={(e) =>
                        handleInputChange("API_secret", e.target.value)
                      }
                      className="bg-gray-700 text-white px-2 py-1 rounded-md w-full"
                    />
                  ) : (
                    record.API_secret
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {editingId === record.user ? (
                    <input
                      type="number"
                      value={editRecord?.pnl || 0}
                      onChange={(e) => handleInputChange("pnl", e.target.value)}
                      className="bg-gray-700 text-white px-2 py-1 rounded-md w-full"
                    />
                  ) : (
                    record.pnl.toFixed(2)
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {editingId === record.user ? (
                    <input
                      type="number"
                      value={editRecord?.margin || 0}
                      onChange={(e) =>
                        handleInputChange("margin", e.target.value)
                      }
                      className="bg-gray-700 text-white px-2 py-1 rounded-md w-full"
                    />
                  ) : (
                    record.margin.toFixed(2)
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {editingId === record.user ? (
                    <input
                      type="number"
                      value={editRecord?.max_risk || 0}
                      onChange={(e) =>
                        handleInputChange("max_risk", e.target.value)
                      }
                      className="bg-gray-700 text-white px-2 py-1 rounded-md w-full"
                    />
                  ) : (
                    record.max_risk.toFixed(2)
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {editingId === record.user ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="text-green-500 hover:text-green-400"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditRecord(null);
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-blue-500 hover:text-blue-400"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.user)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
