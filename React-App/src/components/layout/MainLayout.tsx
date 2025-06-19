import { AppSidebar } from "../../components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "../../components/ui/sidebar";
import { Outlet } from "react-router-dom";
import Footer from "../../components/layout/Footer"

/**
 * Main layout content for the application, including header, sidebar trigger, main content, and footer.
 *
 * @returns {JSX.Element} The rendered layout content.
 */
function LayoutContent() {
    const { state, isMobile } = useSidebar();
    const paddingLeft = !isMobile
        ? state === "expanded"
            ? "16rem" : "0"
        : undefined;

    return (
        <div
            className="flex flex-col min-h-screen w-full transition-all duration-200"
            style={{
                paddingLeft,
            }}
        >
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
                <SidebarTrigger className="-ml-1" />
            </header>
            <div className="flex-1 flex flex-col">
                <div className="container mx-auto px-4 py-4 flex-1 flex flex-col">
                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
                <Footer aria-label="Pied de page" />
            </div>
        </div>
    );
}

/**
 * Main layout wrapper with sidebar provider and sidebar.
 *
 * @returns {JSX.Element} The rendered main layout.
 */
export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <LayoutContent />
        </SidebarProvider>
    );
}