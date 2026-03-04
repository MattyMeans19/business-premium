import Link from "next/link";


export default function Footer(){
    return(
        <footer className="flex flex-wrap items-center justify-center gap-5 bg-(--primary-color) p-4">
            <p>Business Name ©️ 2026</p>
            <p>|</p>
            <Link href="https://matthew-means.dev" target="_blank">Web Master</Link>
        </footer>
    )
}