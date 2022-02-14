import { Editor, Preview } from "~/components";

export default function Index() {
  return (
    <main className="w-full min-h-screen">
      <article className="w-full flex">
        <section className="w-2/4 min-h-screen bg-darkBlue">
          <Editor />
        </section>
        <Preview />
      </article>
    </main>
  );
}
