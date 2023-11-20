import MapGL, { Viewport, Source, Layer, Marker } from "solid-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css'
import { For, Show, Suspense, createEffect, createResource, createSignal } from "solid-js";
import { useState } from "./context";

const getIsoWalking = async (input: number[]) => {
    const r = await fetch(`https://api.mapbox.com/isochrone/v1/mapbox/walking/${input[0]}%2C${input[1]}?contours_minutes=30&polygons=true&denoise=1&access_token=pk.eyJ1Ijoic2FtZG9lc21hcHMiLCJhIjoiY2xwM2xjcHAwMG85djJwbWlweTVwbnA4YSJ9.h_Lj70-AiFiE8VgnCQrXxg`)

    const iso = await r.json()
    return iso
}

const distanceToWork = async (input: number[][]) => {
    const apiBase = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic'
    const r = await fetch(`${apiBase}/${input[0]}%3B${input[1]}?alternatives=false&annotations=distance%2Cduration%2Ccongestion&continue_straight=false&geometries=geojson&overview=full&steps=false&access_token=pk.eyJ1Ijoic2FtZG9lc21hcHMiLCJhIjoiY2xwM2xjcHAwMG85djJwbWlweTVwbnA4YSJ9.h_Lj70-AiFiE8VgnCQrXxg`
    )
    const dtw = await r.json()
    return dtw
}
const closestBeach = async (input: number[]) => {
    const apiCallPoi = `https://api.mapbox.com/search/searchbox/v1/category/beach?&access_token=pk.eyJ1Ijoic2FtZG9lc21hcHMiLCJhIjoiY2xwM2xjcHAwMG85djJwbWlweTVwbnA4YSJ9.h_Lj70-AiFiE8VgnCQrXxg&language=en&limit=25&proximity=${input[0]},${input[1]}`

    const response = await fetch(apiCallPoi, { method: "GET" })
    const json = await response.json()
    console.log(json.features)
    return json.features
}
const FeaturesInWalking = async (input: number[]) => {
    const apiCallPoi = `https://api.mapbox.com/search/searchbox/v1/category/doctors_office,hospital?&access_token=pk.eyJ1Ijoic2FtZG9lc21hcHMiLCJhIjoiY2xwM2xjcHAwMG85djJwbWlweTVwbnA4YSJ9.h_Lj70-AiFiE8VgnCQrXxg&language=en&limit=25&proximity=${input[0]},${input[1]}`

    const response = await fetch(apiCallPoi, { method: "GET" })
    const json = await response.json()
    console.log(json.features)
    return json.features
}
const addressFromPoint = async (input: number[]) => {
    const apiCallPoi = `https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?country=au&types=address&language=en&access_token=pk.eyJ1Ijoic2FtZG9lc21hcHMiLCJhIjoiY2xwM2xjcHAwMG85djJwbWlweTVwbnA4YSJ9.h_Lj70-AiFiE8VgnCQrXxg
`
    const response = await fetch(apiCallPoi, { method: "GET" })
    const json = await response.json()
    return json.features[0].place_name_en
}

export default function Map(props: any) {
    const [viewport, setViewport] = createSignal({
        center: props.props.centre,
        zoom: 11,
    } as Viewport);
    const [selectionMarker, setSelectionMarker] = createSignal([151.20, -33.88])
    const [mapLocationData] = createResource(selectionMarker, getIsoWalking)
    const [routeData, setRouteData] = createSignal<number[][]>()
    const [distanceToWoork] = createResource(routeData, distanceToWork)
    const [distanceToBeach] = createResource(selectionMarker, closestBeach)
    const [poi] = createResource(selectionMarker, FeaturesInWalking)
    const [intimlocation, setIntrimLocation] = createSignal<number[]>()

    const [state, { updateLiveAddress, updateBeach }] = useState()
    createEffect(() => {
        if (state.liveAdd.latlng.length > 0 && state.workAdd.latlng.length > 0) {
            setRouteData([state.liveAdd.latlng, state.workAdd.latlng])
        }
    })
    createEffect(() => {
        if (state.liveAdd.latlng.length > 0) {
            setSelectionMarker(state.liveAdd.latlng)
        }
    })
    createEffect(() => {
        if (state.liveAdd.latlng.length > 0) {
        }
    })
    createEffect(() => {
        console.log(distanceToWork([state.liveAdd.latlng, state.workAdd.latlng]))
    })
    const handleDragEvent = async () => {
        const addy = await addressFromPoint(intimlocation())
        setSelectionMarker(intimlocation())
        updateLiveAddress(addy, intimlocation())
    }
    const WorkMarker = () => {
        return (
            <div class="p-4  transition-all bg-zinc-50 hover:bg-red-200 rounded-full">
                <svg width="40px" height="40px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M2 15V9C2 5.68629 4.68629 3 8 3H16C19.3137 3 22 5.68629 22 9V15C22 18.3137 19.3137 21 16 21H8C4.68629 21 2 18.3137 2 15Z" stroke="#000000" stroke-width="2"></path><path d="M11.6667 8L10 12H14L12.3333 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
        )
    }
    const BeachMarker = () => {
        return (
            <div class="p-4 transition-all bg-zinc-50 hover:bg-red-200 rounded-full">
                <svg width="40px" height="40px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M3 15C5.48276 15 7.34483 12 7.34483 12C7.34483 12 9.2069 15 11.6897 15C14.1724 15 16.6552 12 16.6552 12C16.6552 12 19.1379 15 21 15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 20C5.48276 20 7.34483 17 7.34483 17C7.34483 17 9.2069 20 11.6897 20C14.1724 20 16.6552 17 16.6552 17C16.6552 17 19.1379 20 21 20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>            </div>
        )
    }
    const HomeMarker = () => {
        return (
            <div class="p-4 transition-all bg-zinc-50 hover:bg-red-200 rounded-full">
                <svg width="40px" height="40px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M2 8L11.7317 3.13416C11.9006 3.04971 12.0994 3.0497 12.2683 3.13416L22 8" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
        )
    }
    return (
        <MapGL
            options={{
                accessToken: "pk.eyJ1Ijoic2FtZG9lc21hcHMiLCJhIjoiY2xwM2xpMG8zMTBlOTJrbzhtem10bzVudCJ9.7hKdTMdytdqgCjFtAb2Q-w",
                style: "mb:outdoor",
            }}
            viewport={viewport()}
            onViewportChange={(evt: Viewport) => setViewport(evt)}
        >
            <Show when={state.liveAdd.latlng.length > 0}>
                <Marker
                    lngLat={state.liveAdd.latlng}
                    draggable={true}
                    onDrag={e => setIntrimLocation(e)}
                    onDragEnd={handleDragEvent}
                    options={{
                        color: '#DDDD',
                        element: HomeMarker()
                    }}>
                </Marker>
            </Show>
            <Show when={state.workAdd.latlng.length > 0}>
                <Marker
                    lngLat={state.workAdd.latlng}
                    draggable={true}
                    onDrag={e => setIntrimLocation(e)}
                    onDragEnd={handleDragEvent}
                    options={{
                        color: '#DDDD',
                        element: WorkMarker()
                    }}>
                </Marker>
            </Show>
            <Show when={state.beach.latlng.length > 0}>
                <Marker
                    lngLat={state.beach.latlng}
                    draggable={false}
                    options={{
                        color: '#DDDD',
                        element: BeachMarker()
                    }}>
                </Marker>
            </Show>
            <Suspense fallback={<div>No items</div>}>
                <For each={poi()} fallback={<div>No items</div>}>
                    {(point) =>
                        <Marker lngLat={point.geometry.coordinates} draggable={false} options={{ color: '#f00' }}>
                            {point.properties.name}
                        </Marker>}
                </For>
            </Suspense>
            <Source
                source={{
                    type: 'geojson',
                    data: mapLocationData()
                }}
            >
                <Layer
                    style={{
                        type: 'fill',
                        layout: {},
                        paint: {
                            'fill-color': '#5a3fc0',
                            'fill-opacity': 0.3
                        },
                    }}
                />
            </Source>
            <Show when={distanceToWoork()}>
                <Source
                    source={{
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: distanceToWoork().routes[0].geometry.coordinates
                            }
                        }
                    }}
                >
                    <Layer
                        style={{
                            type: 'line',
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            paint: {
                                'line-color': '#3887be',
                                'line-width': 5,
                                'line-opacity': 0.75
                            },
                        }}
                    />
                </Source>
            </Show>
        </MapGL >
    )
}
