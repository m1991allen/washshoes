import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="bg-grain relative grid min-h-[70vh] place-items-center px-6 pt-24">
      <div className="relative text-center">
        <p className="gold-text font-serif text-[7rem] leading-none md:text-[10rem]">404</p>
        <h1 className="mt-4 font-serif text-2xl text-ink md:text-3xl">
          找不到頁面 · Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          很抱歉，這個頁面可能已被移除或不存在。
          <br />
          Sorry, this page may have been moved or no longer exists.
        </p>
        <Link href="/" className="btn btn-primary mt-9">
          回首頁 / Home
          <ArrowRight width={18} height={18} />
        </Link>
      </div>
    </section>
  );
}
