import { ChangeEvent, useState, useRef } from "react";
import * as marked from "marked";
import DesktopIcon from "~/icons/DesktopIcon";
import type { LinksFunction } from "remix";
import styles from "~/styles/markdown.css";

// const domPurify = DOMPurify(window as unknown as Window);

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Index() {
  const [content, setContent] = useState<string>("# content");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const toggleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const extractCustomStyle = (code: string) => {
    if (code.includes("---")) {
      const extractedValue = code
        .slice(code.indexOf("---") + 1, code.lastIndexOf("---"))
        .replace(/\n/g, " ");
      const extractedBackgroundImage = extractedValue
        .slice(extractedValue.indexOf(":") + 2)
        .trim();
      if (containerRef.current) {
        if (extractedBackgroundImage) {
          containerRef.current.style.backgroundImage = `url(${extractedBackgroundImage})`;
          containerRef.current.style.backgroundRepeat = "no-repeat";
          containerRef.current.style.backgroundSize = "cover";
          containerRef.current.style.backgroundPosition = "center";
        }
      }
    }
  };

  const renderMarkdownText = (code: string) => {
    extractCustomStyle(code);
    const content = removeCustomStyle(code);
    const __html = marked.marked(content, {
      sanitize: true,
    });
    // const __html = domPurify.sanitize(dirtyContent);
    return { __html };
  };

  const removeCustomStyle = (code: string): string => {
    return code.replace(
      code.slice(code.indexOf("-"), code.lastIndexOf("-")),
      ""
    );
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const syntaxHiglighter = (code: string) => {
    marked.marked.setOptions({
      highlight: function (code, lang, callback) {
        require("pygmentize-bundled")(
          { lang: lang, format: "html" },
          code,
          function (err: any, result: any) {
            callback?.(err, result.toString());
          }
        );
      },
    });

    return marked.marked.parse(code);
  };

  const toggleFullScreen = () => {
    containerRef.current?.requestFullscreen();
    setIsFullScreen(true);
  };

  return (
    <main className="w-full min-h-screen">
      <article className="w-full flex">
        <section className="w-2/5 max-h-screen min-h-screen relative border-r-4 border-darkGrey bg-bgColor">
          <div className="min-w-min h-10 p-2 rounded-br-lg absolute top-0 left-0 bg-darkGrey">
            <h4 className="text-white font-medium text-base">
              Presentation.md
            </h4>
          </div>
          {/* the code editor */}
          <textarea
            value={content}
            onChange={handleContentChange}
            className="pt-16 pl-2 text-lg w-full h-full border-none bg-bgColor text-white overflow-y-auto focus:outline-none"
            style={{ resize: "none" }}
          />
        </section>
        <section ref={containerRef} className="w-3/5 min-h-screen relative">
          <div
            title="Toggle fullscreen"
            className="absolute bottom-2 right-2 bg-darkGrey rounded-full flex justify-center items-center w-8 h-8 opacity-50 hover:opacity-90 cursor-pointer duration-300"
            onClick={toggleFullScreen}
          >
            <DesktopIcon />
          </div>
          <div
            ref={toggleRef}
            className={`min-h-screen w-full pl-3 text-bgColor flex flex-col justify-center`}
            dangerouslySetInnerHTML={renderMarkdownText(content)}
          />
        </section>
      </article>
    </main>
  );
}
