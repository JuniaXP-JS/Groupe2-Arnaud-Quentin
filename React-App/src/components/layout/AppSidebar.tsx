import React from "react";
import { ChevronUp, Home, User2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "../../components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { useSession } from "../../contexts/session";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { MenuItem } from "@/types";

const items: MenuItem[] = [
  { title: "Accueil", url: "/", icon: Home },
];

/**
 * Application sidebar component.
 *
 * - Displays navigation links and user menu.
 * - Handles user sign out and navigation.
 * - Uses session context to show user info and logout.
 * - Uses Radix UI sidebar primitives for accessibility and keyboard navigation.
 *
 * @component
 * @example
 * <AppSidebar />
 *
 * @returns {JSX.Element} The rendered sidebar with navigation and user menu.
 */
export function AppSidebar() {
  const { session, setSession } = useSession();
  const navigate = useNavigate();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  /**
   * Handles user sign out by calling the API and resetting session.
   * Navigates to the login page after logout.
   * @returns {Promise<void>}
   */
  const handleSignOut = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (e) {
      alert("Erreur lors de la déconnexion. Veuillez réessayer.");
    }
    setSession({ user: null });
    navigate('/auth/login');
  };

  /**
   * Custom focus trap for DropdownMenuContent to ensure accessibility.
   * Closes the menu and returns focus to the trigger on Tab navigation.
   * @param {React.KeyboardEvent<HTMLDivElement>} e - The keyboard event.
   */
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const menu = e.currentTarget;
    const focusables = Array.from(
      menu.querySelectorAll<HTMLElement>(
        'button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      setOpen(false);
      setTimeout(() => triggerRef.current?.focus(), 0);
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      setOpen(false);
      setTimeout(() => triggerRef.current?.focus(), 0);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Shinkansen.dev</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {session && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    className="text-white border border-white focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
                    data-sidebar
                    ref={triggerRef}
                  >
                    <User2 />
                    <span className="truncate" title={session.user?.email ?? "Account"}>
                      {session.user?.email ?? "Account"}
                    </span>
                    <ChevronUp className="ml-2 flex-shrink-0" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                  data-sidebar
                  onKeyDown={handleMenuKeyDown}
                >
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="w-full cursor-pointer"
                    data-sidebar
                    onSelect={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }}
                  >
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
