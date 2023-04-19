import { useRouter } from "next/router";
import Head from "next/head";
import Button from "../components/tools/Button";
import Bg from "../components/tools/Bg";
import Ring from "../components/others/Ring";
import SocialMedia from "@/components/others/SocialMedia";

export default function Custom500({ darkMode, theme }) {
    const router = useRouter()
    return (
        <>
            <Head>
                <title>Server Error</title>
            </Head>
            <section className="max-h-screen relative overflow-hidden">
                <section className={`myContainer min-h-full ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    <div className="mt-44 max-w-md md:ml-20">
                        <h1 className="text-6xl font-ubuntu font-bold">500 Internal Server Error !</h1>
                        <h2 className="text-2xl mt-2">Sorry! something happen unexpected. Please wait or report to the developer.</h2>
                        <SocialMedia classList='flex mt-8 gap-6' />
                        <Button theme={theme} type='button' className='py-8' onClick={() => router.back()}>Go Back</Button>
                    </div>
                </section>
                <Ring darkMode={darkMode} />
                <div className="absolute w-full h-full top-0 right-0 -z-40">
                    <div className={`absolute w-full h-full inset-0 bg-gradient-to-b z-10 ${darkMode ? 'from-[#141e30]' : 'from-[#ffffff]'}`}></div>
                    <Bg
                        alt="landing pattern"
                        src={darkMode ? '/assets/svg/pattern-dark.svg' : '/assets/svg/pattern-lite.svg'}
                        className={darkMode ? "opacity-50" : "opacity-80"}
                    />
                </div>
            </section>
        </>
    )
}