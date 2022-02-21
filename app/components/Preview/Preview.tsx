import React from "react";
import * as marked from "marked";
import parseFrontMatter from "front-matter";
import { useActor } from "@xstate/react";

import { IAttributes } from "~/types";
import { ChevronLeftIcon, ChevronRightIcon } from "~/icons";
import { ContentContext } from "~/contexts";
interface IPreviewProps {
  presentation: boolean;
  width: number;
}

let count = 0;

const Preview = ({ presentation, width }: IPreviewProps) => {
  const containerRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [pages, setPages] = React.useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const globalServices = React.useContext(ContentContext);
  const [current] = useActor(globalServices.contentService);

  const { content } = current.context;

  const hasPrev = count > 0;
  const hasNext = currentIndex < pages.length - 1;

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
  }, [content]);

  const renderMarkdownText = (code: string) => {
    const content = removeCustomStyle(code);
    const __html = marked.marked(content, {
      sanitize: true,
    });
    return { __html };
  };

  const removeCustomStyle = (code: string): string => {
    return code.replace(
      code.slice(code.indexOf("-"), code.lastIndexOf("-")),
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
            className="min-h-screen w-full px-3 text-bgColor flex flex-col"
            dangerouslySetInnerHTML={renderMarkdownText(pages[currentIndex])}
          />
          <div className="absolute w-full bottom-2 transform -translate-y-1/2 flex justify-end items-start px-3 gap-6">
            <button
              className={`bg-darkGrey rounded-full flex justify-center items-center w-8 h-8 opacity-50 ${
                hasPrev ? "hover:opacity-90 cursor-pointer" : ""
              } duration-300`}
              onClick={handleClickPrev}
              disabled={!hasPrev}
            >
              <ChevronLeftIcon />
            </button>
            <button
              className={`bg-darkGrey rounded-full flex justify-center items-center w-8 h-8 opacity-50 ${
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
            className={`min-h-screen w-full px-3 text-bgColor flex flex-col justify-center`}
            dangerouslySetInnerHTML={renderMarkdownText(content)}
          />
        </>
      )}
    </section>
  );
};

export default Preview;
