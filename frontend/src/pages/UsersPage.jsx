import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState, useEffect } from "react";
import { StarIcon } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch users.Try refreshing the page");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUserName.trim()) return;

    const newUser = {
      name: newUserName,
      totalPoints: 0,
      claimedPoints: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    setShowModal(false);
    setNewUserName("");

    try {
      await fetch(`${BACKEND_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4 overflow-hidden">
      <Button
        size="sm"
        className="hover:bg-green-600"
        onClick={() => setShowModal(true)}
      >
        Add User
      </Button>
      {users.map((user, index) => (
        <Card
          key={user._id || index}
          className="flex flex-row items-center justify-between p-4 border shadow-sm"
        >
          <div className="font-medium">{user.name}</div>
          <div className="flex items-center text-yellow-400 font-semibold">
            <StarIcon className="w-4 h-4 mr-1 text-yellow-400"></StarIcon>
            {user.claimedPoints} pts
          </div>
          <Button size="sm" className="hover:bg-blue-600">
            Claim
          </Button>
        </Card>
      ))}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-100 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80 relative">
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <h3 className="mb-4 font-semibold text-lg">Add New User</h3>
            <Input
              placeholder="Enter name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="mb-4"
            ></Input>
            <Button
              onClick={handleAddUser}
              className="bg-green-500 hover:bg-green-600 w-full"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
