import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// https://vite.dev/config/
/* const ReactCompilerConfig = {
  target: "18", // '17' | '18' | '19'
}; */
export default defineConfig({
    plugins: [
        react(),
        /*     {
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    } */
    ],
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    "react-vendor": ["react", "react-dom"],
                    "tanstack-vendor": ["@tanstack/react-query", "@tanstack/react-router"],
                    "antd-vendor": ["antd", "@ant-design/icons"],
                    "mui-vender": ["@mui/x-charts"],
                    "framer-motion-vender": ["motion"],
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        cors: {
            origin: (origin, _req) => {
                
                if (origin === "http://localhost:443") return true;
                if (origin && /^https:\/\/([a-zA-Z0-9-]+\.)*nas03\.xyz$/.test(origin)) return true;
                return false;
            },
            
        }
    }
});
