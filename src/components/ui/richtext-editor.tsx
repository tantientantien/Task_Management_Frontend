"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSubmit: () => void;
  onExitEditMode?: () => void;
}

export default function RichTextEditor({
  content,
  onChange,
  onSubmit,
  onExitEditMode,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3 outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey && (event.key === "m" || event.key === "M")) {
      onSubmit();
      if (onExitEditMode) {
        onExitEditMode();
      }
    }
  };

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} onKeyDown={handleKeyDown} />
      <span className="flex items-center text-xs mt-5 text-gray-600">
        <svg
          className="w-4 h-4 mr-1 text-violet-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <p className="font-semibold text-violet-500">Pro tips:</p>
        <p className="font-light ml-2">
          Press{" "}
          <span className="inline-flex items-center border border-gray-300 bg-gray-100 text-gray-800 font-semibold px-1.5 py-0.5 rounded-md shadow-sm transition-all duration-200 hover:bg-gray-200">
            Ctrl
          </span>{" "}
          +{" "}
          <span className="inline-flex items-center border border-gray-300 bg-gray-100 text-gray-800 font-semibold px-1.5 py-0.5 rounded-md shadow-sm transition-all duration-200 hover:bg-gray-200">
            M
          </span>{" "}
          to save
        </p>
      </span>
    </div>
  );
}
