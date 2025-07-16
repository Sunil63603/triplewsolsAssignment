//react hooks import
import { useState, useEffect } from "react";

//shadcn imports
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UsersPage() {
  const [users, setUsers] = useState([]); //fetch and store users list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); //modal to add new user
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        //same API end-point is used for leaderboard as well for reusability.
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
      totalPoints: 0, //initially 0
      claimedPoints: 0,
    };
    setShowModal(false); //hide modal
    setNewUserName("");

    try {
      //store in database
      const res = await fetch(`${BACKEND_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      //update "users" state instead of fetching again from database.
      setUsers((prev) => [...prev, { ...newUser, _id: data._id }]);
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleClaim = async (_id, name) => {
    try {
      //claimPoints will add generated random number to user using findOneAndUpdate() and create new entry in "claimHistory" collection
      const res = await fetch(`${BACKEND_URL}/api/claimPoints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });

      const data = await res.json();

      //update points in local state for dynamically displaying on UI.
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === _id
              ? {
                  ...user,
                  claimedPoints: user.claimedPoints + data.claimedPoints,
                }
              : user
          )
        );

        //display name and generated random number
        toast.success(`${name} claimed ${data.claimedPoints} points!`);
      }
    } catch (error) {
      console.error("Failed to claim points:", error);
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
            🔥
            {user.claimedPoints} pts
          </div>
          <Button
            size="sm"
            className="hover:bg-blue-600"
            onClick={() => handleClaim(user._id, user.name)}
          >
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
