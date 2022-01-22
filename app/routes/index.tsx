import { ChangeEvent, useState, useRef } from "react";
import type { LinksFunction } from "remix";
import * as marked from "marked";
import parseFrontMatter from "front-matter";

import DesktopIcon from "~/icons/DesktopIcon";
import styles from "~/styles/markdown.css";
import { IAttributes } from "~/types";

// const domPurify = DOMPurify(window as unknown as Window);

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Index() {
  const [content, setContent] = useState<string>("");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // used to extract all the custom style
  // inside ---
  const extractCustomStyle = (code: string) => {
    try {
      const { attributes }: { attributes: IAttributes } =
        parseFrontMatter(code);
      if (containerRef.current && containerRef.current) {
        if (attributes.color)
          contentRef!.current!.style.color = attributes.color;
        if (attributes?.backgroundColor)
          containerRef.current.style.background = attributes.backgroundColor;
        else if (attributes?.backgroundImage)
          containerRef.current.style.background = `no-repeat center/cover url(${attributes.backgroundImage})`;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const createNewPage = (code: string) => {
    const shoudCreateNewPage = code.match(/^(\[page[0-9]{1}\])$/gi);
    if (shoudCreateNewPage) {
      console.log("should add a new page to the slide");
    }
  };

  const renderMarkdownText = (code: string) => {
    extractCustomStyle(code);
    createNewPage(code);
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

  // Gonna need this later
  /*
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
  */

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
      document.exitFullscreen();
    }
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
            title={`${isFullScreen ? "Exit" : "Toggle"} full screen`}
            className="absolute bottom-2 right-2 bg-darkGrey rounded-full flex justify-center items-center w-8 h-8 opacity-50 hover:opacity-90 cursor-pointer duration-300"
            onClick={toggleFullScreen}
          >
            <DesktopIcon />
          </div>
          <div
            ref={contentRef}
            className={`min-h-screen w-full pl-3 text-bgColor flex flex-col justify-center`}
            dangerouslySetInnerHTML={renderMarkdownText(content)}
          />
        </section>
      </article>
    </main>
  );
}
