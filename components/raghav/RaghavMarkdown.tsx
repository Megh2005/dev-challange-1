"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface RaghavMarkdownProps {
  content: string;
}

export const RaghavMarkdown: React.FC<RaghavMarkdownProps> = ({ content }) => {
  return (
    <div className="raghav-prose text-xs sm:text-sm text-[#181A1E] leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Strict table prohibition: Convert tables to clean bullet lists so mobile readability is never broken
          table: ({ children }) => (
            <div className="my-2 p-2.5 rounded-[14px] bg-[#FFF5EE] border border-[#F06529]/15">
              <ul className="list-disc pl-4 space-y-1">{children}</ul>
            </div>
          ),
          thead: ({ children }) => <>{children}</>,
          tbody: ({ children }) => <>{children}</>,
          tr: ({ children }) => <li className="text-xs">{children}</li>,
          th: ({ children }) => <strong className="mr-1.5">{children}:</strong>,
          td: ({ children }) => <span>{children} </span>,

          // Headings
          h1: ({ children }) => (
            <h3 className="text-base font-black text-[#181A1E] mt-3 mb-1.5 ">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className="text-sm font-black text-[#181A1E] mt-2.5 mb-1 ">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="text-xs sm:text-sm font-extrabold text-[#F06529] mt-2 mb-1">
              {children}
            </h5>
          ),

          // Paragraphs
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-0.5">{children}</li>,

          // Blockquotes for engineering notes
          blockquote: ({ children }) => (
            <blockquote className="my-2 pl-3 py-1 border-l-2 border-[#F06529] bg-[#FFF5EE]/60 text-xs italic text-[#555A64]">
              {children}
            </blockquote>
          ),

          // Code blocks & inline code
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code
                className="px-1.5 py-0.5 rounded-[6px] bg-[#FFF5EE] text-[#F06529] font-mono text-[11px] border border-[#F06529]/15"
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="my-2 p-3 rounded-[14px] bg-[#181A1E] text-[#FFF5EE] font-mono text-xs overflow-x-auto">
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
