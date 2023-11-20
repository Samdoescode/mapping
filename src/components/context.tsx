import { ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export type ControlState = {
    liveAdd: {
        Add: string,
        latlng: number[]
    },
    workAdd: {
        Add: string,
        latlng: number[]
    },
    beach: {
        Add: string,
        latlng: number[]
    }
};
export type ControlStateContextValue = [
    state: ControlState,
    actions: {
        updateWorkAddress: (add: string, latLng: number[]) => void,
        updateLiveAddress: (add: string, latLng: number[]) => void,
        updateBeach: (string: string) => void
    }
];
const defaultState = {
    liveAdd: {
        Add: "",
        latlng: []
    },
    workAdd: {
        Add: "",
        latlng: []
    },
    beach: {
        Add: "",
        latlng: []
    }
};

const ControlStateContext = createContext<ControlStateContextValue>([
    defaultState,
    {
        updateWorkAddress: () => undefined,
        updateLiveAddress: () => undefined,
        updateBeach: () => undefined
    },
]);

export const ControlStateProvider: ParentComponent = (props: any) => {
    const [state, setState] = createStore({
        liveAdd: {
            Add: "",
            latlng: []
        },
        workAdd: {
            Add: "",
            latlng: []
        },
        beach: {
            Add: "",
            latlng: []
        }
    });

    const updateWorkAddress = (address: string, latLng: number[]) => setState("workAdd", { Add: address, latlng: latLng });
    const updateLiveAddress = (address: string, latLng: number[]) => setState("liveAdd", { Add: address, latlng: latLng });
    const updateBeach = (address: string, latLng: number[]) => setState("liveAdd", { Add: address, latlng: latLng });

    return (
        <ControlStateContext.Provider value={[state, { updateWorkAddress, updateLiveAddress, updateBeach }]}>
            {props.children}
        </ControlStateContext.Provider>
    );
};
export function useState() { return useContext(ControlStateContext); }
