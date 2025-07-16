//react imports
import { Outlet, Link } from "react-router-dom";

//icon imports
import { UsersIcon } from "lucide-react";

//shadcn imports
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-md">
      <header className="text-center p-4 text-2xl font-bold border-b">
        Task Planet
      </header>

      <main className="flex-1 p-4 pb-20">
        <Outlet></Outlet>
      </main>

      <div className="mx-auto max-w-md w-full fixed bottom-0">
        <footer className="h-16 bg-blue-500 flex items-center justify-around text-white">
          <NavigationMenu className="flex w-full justify-around">
            <NavigationMenuList className="flex w-full justify-around gap-x-42">
              <NavigationMenuItem>
                <Link to="/users">
                  <UsersIcon className="w-20 h-6"></UsersIcon>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/leaderboard">
                  <img
                    src="/images/leaderboardIcon.png"
                    alt="Leaderboard"
                    className="w-15 h-11"
                  ></img>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </footer>
      </div>
    </div>
  );
}
