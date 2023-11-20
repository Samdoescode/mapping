import "./index.css";
import { createSignal } from "solid-js";
import Map from "~/components/Map";
import Control from "~/components/controls";
import { ControlStateProvider } from "~/components/context";

export default function Home() {
    const [centre, setCentre] = createSignal([151.20, -33.86])
    return (
        <main>
            <ControlStateProvider>
                <Control />
                <Map props={{ centre: centre() }} />
            </ControlStateProvider>
        </main>
    );
}


