// React and React-related imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Internal Components
import AuthenticationProvider from "@/components/AuthenticationProvider";

// Routes
import router from "@/route";

// Styles
import "./index.css";

// Type augmentation
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthenticationProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </AuthenticationProvider>
    </StrictMode>,
);
