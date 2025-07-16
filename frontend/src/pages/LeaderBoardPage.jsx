//react hook imports
import { useState, useEffect } from "react";

//icon imports
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { FaceSmileIcon } from "@heroicons/react/24/solid";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function LeaderBoardPage() {
  const [leaders, setLeaders] = useState([]); //same as users state variable in UsersPage.jsx
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        //reusing same API for fetching in both UsersPage and leader-boardPage.
        const res = await fetch(`${BACKEND_URL}/api/users`); //returns descending sorted order
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        setLeaders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className="bg-cover bg-center bg-repeat-y min-h-[800px] pt-42"
      style={{
        backgroundImage: "url(/images/LeaderBoardBgImage1.jpg)",
      }}
    >
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-4 relative">
        {/* Trophy Icon */}
        <div className="flex justify-center -mt-20 mb-6">
          <img src="/images/trophy.png" alt="Clock" className="w-16 h-16" />
        </div>

        {/* Rank 1 Card (Shifted up with -mt-10) */}
        {leaders[0] && (
          <div className="flex justify-center -mt-10 mb-4">
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow-sm relative">
              <div className="relative">
                <img
                  src="/images/gold-medal.png"
                  alt="Gold Medal"
                  className="w-6 absolute -top-3 left-1/2 -translate-x-1/2"
                />
                <div className="w-20 h-20 flex items-center justify-center mb-1">
                  <FaceSmileIcon className="w-20 h-20 text-blue-500"></FaceSmileIcon>
                  <img src="/images/Work.png" alt="work" className=""></img>
                </div>
              </div>
              <p className="text-sm font-bold">{leaders[0].name}</p>
              <p className="text-xs text-gray-500 truncate max-w-[60px]">
                ID: {leaders[0]._id}
              </p>
              <p className="text-sm font-bold text-orange-500">
                {leaders[0].totalPoints}🔥
              </p>
            </div>
          </div>
        )}

        {/* Rank 2 & 3 Cards */}
        <div className="flex justify-between -mt-29">
          {[leaders[1], leaders[2]].map((user, idx) => (
            <div
              key={user?._id || idx}
              className="flex flex-col items-center w-24 relative"
            >
              <div className="relative">
                <img
                  src={`/images/${
                    idx === 0 ? "silver-medal" : "bronze-medal"
                  }.png`}
                  alt="Medal"
                  className="w-5 absolute -top-2 left-1/2 -translate-x-1/2"
                />
                <div className="w-16 h-16 flex items-center justify-center mb-1">
                  <FaceSmileIcon className="w-12 h-12 text-blue-500"></FaceSmileIcon>
                </div>
              </div>
              <p className="text-xs font-semibold truncate max-w-[60px]">
                {user?.name}
              </p>
              <p className="text-[10px] text-gray-500 truncate max-w-[60px]">
                ID: {user?._id}
              </p>
              <p className="text-xs font-bold text-orange-500">
                {user?.totalPoints}🔥
              </p>
            </div>
          ))}
        </div>

        {/* Remaining Horizontal List */}
        <div>
          {leaders.slice(3).map((user, idx) => (
            <div
              key={user._id}
              className="flex items-center justify-between py-2 border-b"
            >
              <div className="flex items-center">
                <span className="w-6 text-center text-gray-500">{idx + 4}</span>
                <UserCircleIcon className="w-8 h-8 text-gray-400 mx-2" />
                <div>
                  <p className="text-sm font-semibold truncate w-40">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-500">ID: {user._id}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-orange-500">
                {user.totalPoints}🔥
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
