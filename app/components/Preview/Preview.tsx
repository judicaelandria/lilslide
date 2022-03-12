import React from "react";
import { marked } from "marked";
import parseFrontMatter from "front-matter";

import { IAttributes } from "~/types";
import { ChevronLeftIcon, ChevronRightIcon } from "~/icons";
import hljs from "highlight.js";
interface IPreviewProps {
  presentation: boolean;
  width: number;
  content: string;
}

let count = 0;

const Preview = ({ presentation, width, content }: IPreviewProps) => {
  const containerRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [pages, setPages] = React.useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  const hasNext = Boolean(currentIndex < pages.length - 1);
  const hasPrev = Boolean(count > 0);

  const handleClickNext = () => {
    count = (count + 1) % pages.length;
    setCurrentIndex(count);
  };

  const handleClickPrev = () => {
    const pagesLength = pages.length;
    count = (currentIndex + pagesLength - 1) % pagesLength;
    setCurrentIndex(count);
  };

  // used to extract all the custom style
  // inside ---
  const extractCustomStyle = (code: string) => {
    try {
      const { attributes }: { attributes: IAttributes } =
        parseFrontMatter(code);
      if (containerRef.current) {
        [
          "backgroundColor",
          "backgroundImage",
          "color",
          "alignItems",
          "justifyContent",
        ].forEach((key: string) => {
          if (attributes[key]) {
            if (Object.keys(attributes).includes("backgroundImage")) {
              containerRef.current!.style.background = `no-repeat center/cover url(${attributes.backgroundImage})`;
            }
            // @ts-expect-error
            contentRef.current!.style[key] = attributes[key];
            // @ts-expect-error
            containerRef.current!.style[key] = attributes[key];
          }
        });
      }
    } catch (error) {}
  };

  const createNewPage = (content: string) => {
    if (content.includes("#nextslide")) {
      const customPages = content.split("#nextslide");
      if (customPages.length > 1) {
        setPages(customPages);
      }
    }
  };

  React.useEffect(() => {
    createNewPage(content);
    extractCustomStyle(content);
    extractHTML(content);
  }, [content]);

  const renderMarkdownText = (code: string) => {
    marked.setOptions({
      langPrefix: "hljs language-",
      highlight: function (code) {
        return hljs.highlightAuto(code, [
          "javascript",
          "css",
          "html",
          "rust",
          "typescript",
          "jsx",
        ]).value;
      },
    });
    const html = extractHTML(code);
    const __html = marked(html, {
      sanitize: true,
    });
    return { __html };
  };

  const extractHTML = (code: string) => {
    return code.replace(
      code.slice(code.indexOf("---"), code.lastIndexOf("---")),
      ""
    );
  };

  React.useEffect(() => {
    if (containerRef.current) {
      if (presentation) containerRef.current?.requestFullscreen();
    }
  }, [presentation]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen relative bg-white"
      style={{ width }}
    >
      {pages.length > 1 ? (
        <div className="w-full relative m-auto">
          <div
            ref={contentRef}
            className="min-h-screen w-full px-3 text-bgColor flex flex-col justify-center"
            id="preview"
            dangerouslySetInnerHTML={renderMarkdownText(pages[currentIndex])}
          />
          <div className="absolute w-full bottom-2 transform -translate-y-1/2 flex justify-end items-start px-3 gap-6">
            <button
              className={`bg-darkBlue/80 rounded-full flex justify-center items-center w-8 h-8 opacity-50 ${
                hasPrev ? "hover:opacity-90 cursor-pointer" : ""
              } duration-300`}
              onClick={handleClickPrev}
              disabled={!hasPrev}
            >
              <ChevronLeftIcon />
            </button>
            <button
              className={`bg-darkBlue/80 rounded-full flex justify-center items-center w-8 h-8 opacity-50 ${
                hasNext ? "hover:opacity-90 cursor-pointer" : ""
              } duration-300`}
              onClick={handleClickNext}
              disabled={!hasNext}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={contentRef}
            className="min-h-screen w-full px-3 text-bgColor flex flex-col justify-center"
            dangerouslySetInnerHTML={renderMarkdownText(content)}
            id="preview"
          />
        </>
      )}
    </section>
  );
};

export default Preview;
