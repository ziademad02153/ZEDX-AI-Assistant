import "@/app/globals.css";

export default function DesktopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-transparent">
            {children}
        </div>
    );
}
