import { For, createSignal, createResource, createEffect, Match, Suspense, Switch, useContext } from "solid-js"
import { useState } from "./context"

const callSuggest = async (input: string) => {
    const apiCallLocation = `https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?country=au&limit=6&proximity=ip&types=address&language=en&autocomplete=true&access_token=pk.eyJ1Ijoic2FtZG9lc21hcHMiLCJhIjoiY2xwM2xjcHAwMG85djJwbWlweTVwbnA4YSJ9.h_Lj70-AiFiE8VgnCQrXxg`
    const response = await fetch(apiCallLocation,
        { method: "GET" })
    const json = await response.json()
    return json.features
}

export default function Control() {

    const [state] = useState()
    createEffect(() => {
        if (workActive()) { setLiveActive(false) }
    })
    createEffect(() => {
        if (liveActive()) { setWorkActive(false) }
    })
    createEffect(() => {
        setLiveInput(state.liveAdd.Add)
    })
    createEffect(() => {
        setWorkInput(state.workAdd.Add)
    })
    const [workActive, setWorkActive] = createSignal(false)
    const [liveActive, setLiveActive] = createSignal(false)
    const [liveInput, setLiveInput] = createSignal("Sydney")
    const [liveResults] = createResource(liveInput, callSuggest)
    const [workInput, setWorkInput] = createSignal("Sydney")
    const [workResults] = createResource(workInput, callSuggest)

    const svgs = [
        <svg width="32px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M10 18V15C10 13.8954 10.8954 13 12 13V13C13.1046 13 14 13.8954 14 15V18" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 8L11.7317 3.13416C11.9006 3.04971 12.0994 3.0497 12.2683 3.13416L22 8" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>,
        <svg width="32px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M7 9.01L7.01 8.99889" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 9.01L11.01 8.99889" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 13.01L7.01 12.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 13.01L11.01 12.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 17.01L7.01 16.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 17.01L11.01 16.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 21H3.6C3.26863 21 3 20.7314 3 20.4V5.6C3 5.26863 3.26863 5 3.6 5H9V3.6C9 3.26863 9.26863 3 9.6 3H14.4C14.7314 3 15 3.26863 15 3.6V9M15 21H20.4C20.7314 21 21 20.7314 21 20.4V9.6C21 9.26863 20.7314 9 20.4 9H15M15 21V17M15 9V13M15 13H17M15 13V17M15 17H17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>,
        <svg width="32px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M14.5714 15.0036L15.4286 16.8486C15.4286 16.8486 19.2857 17.6678 19.2857 19.6162C19.2857 21 17.5714 21 17.5714 21H13L10.75 19.75" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.42864 15.0036L8.5715 16.8486C8.5715 16.8486 4.71436 17.6678 4.71436 19.6162C4.71436 21 6.42864 21 6.42864 21H8.50007L10.7501 19.75L13.5001 18" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 15.9261C3 15.9261 5.14286 15.4649 6.42857 15.0036C7.71429 8.54595 11.5714 9.00721 12 9.00721C12.4286 9.00721 16.2857 8.54595 17.5714 15.0036C18.8571 15.4649 21 15.9261 21 15.9261" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 7C13.1046 7 14 6.10457 14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5C10 6.10457 10.8954 7 12 7Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>,
        <svg width="32px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M3 15C5.48276 15 7.34483 12 7.34483 12C7.34483 12 9.2069 15 11.6897 15C14.1724 15 16.6552 12 16.6552 12C16.6552 12 19.1379 15 21 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 20C5.48276 20 7.34483 17 7.34483 17C7.34483 17 9.2069 20 11.6897 20C14.1724 20 16.6552 17 16.6552 17C16.6552 17 19.1379 20 21 20" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>,
        <svg width="32px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M7.4 7H4.6C4.26863 7 4 7.26863 4 7.6V16.4C4 16.7314 4.26863 17 4.6 17H7.4C7.73137 17 8 16.7314 8 16.4V7.6C8 7.26863 7.73137 7 7.4 7Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.4 7H16.6C16.2686 7 16 7.26863 16 7.6V16.4C16 16.7314 16.2686 17 16.6 17H19.4C19.7314 17 20 16.7314 20 16.4V7.6C20 7.26863 19.7314 7 19.4 7Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 14.4V9.6C1 9.26863 1.26863 9 1.6 9H3.4C3.73137 9 4 9.26863 4 9.6V14.4C4 14.7314 3.73137 15 3.4 15H1.6C1.26863 15 1 14.7314 1 14.4Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M23 14.4V9.6C23 9.26863 22.7314 9 22.4 9H20.6C20.2686 9 20 9.26863 20 9.6V14.4C20 14.7314 20.2686 15 20.6 15H22.4C22.7314 15 23 14.7314 23 14.4Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 12H16" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    ]

    return (
        <>
            <div class="absolute h-screen flex items-end  w-auto  left-0 bottom-0">
                <div class="absolute bg-blue-50 aspect-square h-1/6"></div>
                <div class="relative h-1/3 aspect-square rounded-full flex justify-center items-center left-0 bottom-0 bg-blue-50">
                    <div class="w-[50vw]  absolute bottom-0 left-1/2 bg-blue-50 h-1/2"></div>
                    <div class="w-[50vw]  flex absolute bottom-1/2  left-full pointer-events-none">
                        <Suspense fallback={<p class="hidden">on no </p>}>
                            <Switch fallback={<p class="hidden">on no </p>}>
                                <Match when={!workActive() && liveActive()}>
                                    <SearchResults results={liveResults} type="live" />
                                </Match>
                                <Match when={!liveActive() && workActive()}>
                                    <SearchResults results={workResults} type="work" />
                                </Match>
                            </Switch>
                        </Suspense>
                    </div>
                    <div class="w-[50vw] bg-blue-50 rounded-tr-full flex absolute bottom-0 left-full h-1/2">
                        <button type="button" class="absolute right-0 self-end  top-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="updateProductModal">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="relative p-4 mr-40 grow  rounded-lg  sm:p-5">
                            <div class="flex flex-col gap-4 mb-4">
                                <div>
                                    <label for="LiveInput" class="block mb-2 text-sm font-medium text-gray-900">Where do you live</label>
                                    <input value={liveInput()} type="text" name="LiveInput" id="LiveInput" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        onFocus={() => setLiveActive(true)}
                                        oninput={e => setLiveInput(e.target.value)}
                                        placeholder="Your Address...">
                                    </input>
                                </div>
                                <div>
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Where do you work</label>
                                    <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        onFocus={() => setWorkActive(true)}
                                        oninput={e => setWorkInput(e.target.value)}
                                        placeholder="Work Address...">
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <For each={svgs}>{(menuItem, index) =>
                        <RoundMenuItem props={{ svg: menuItem, i: index() }} />
                    }
                    </For>
                    <div class="bg-blue-50 h-3/6 absolute aspect-square rounded-full"></div>
                </div>
            </div >
        </>
    )
}
const SearchResults = (props: any) => {
    return (
        <Suspense fallback={<p>loading...</p>}>
            <div class="w-1/2 h-full bg-red-500 self-start  bottom-full">
                {props.results.error && (<p>there was an error</p>)}
                <ul>
                    <For each={props.results()} fallback={<div>No items</div>}>
                        {(item) => <SuggetionLine item={item} type={props.type} />}
                    </For>
                </ul>
            </div>
        </Suspense>
    )
}

const SuggetionLine = (props: any) => {
    const [state, { updateLiveAddress, updateWorkAddress }] = useState()
    const place = props.item.place_name
    const centre = props.item.center
    const handleResultClick = (e: Event) => {
        e.preventDefault()
        if (props.type == "live") {
            updateLiveAddress(place, centre)
        }
        if (props.type == "work") {
            updateWorkAddress(place, centre)
        }
    }
    return (
        <li>
            <button
                class="flex items-center gap-2 border-s-[3px] border-blue-500 bg-blue-50 px-4 pointer-events-auto py-3 text-blue-700"
                onclick={handleResultClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 opacity-75"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                <span class="text-sm font-medium"> {props.item.place_name_en} </span>
            </button>
        </li>
    )
}
const RoundMenuItem = (props: any) => {

    return (
        <button
            style={{
                "transform": `rotate(${(props.props.i * 60).toString()}deg)`,
                "clip-path": "polygon(50% 50%, 21% 0%, 79% 0%)",
                "background-color": '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
            }}
            class="hover:h-full group transition-all aspect-square rounded-full flex  justify-center absolute  h-5/6">
            <div class="h-6 absolute 0 top-6 transition-all" style={{ "transform": `rotate(${-(props.props.i * 60).toString()}deg)` }}>
                {props.props.svg}
            </div>
            <div class="absolute -translate-y-5 z-10">label</div>
        </button>
    )
}
