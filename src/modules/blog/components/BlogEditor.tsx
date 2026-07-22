"use client";

import React, { useCallback } from "react";
import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image as ImageExtension } from "@tiptap/extension-image";
import { Link as LinkExtension } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Placeholder } from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Sparkles,
  Minus,
  AlignLeft,
} from "lucide-react";
import { toast } from "sonner";

interface BlogEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  /**
   * Tiptap v3 Configuration
   */
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      ImageExtension.configure({
        inline: false,
        allowBase64: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "Write your article content here...",
      }),
      CharacterCount,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[400px] p-6 overflow-y-auto text-on-surface",
      },
    },
  });

  /**
   * useEditorState — Tiptap v3 reactive state subscription.
   */
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return null;
      return {
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isUnderline: ctx.editor.isActive("underline"),
        isStrike: ctx.editor.isActive("strike"),
        isH1: ctx.editor.isActive("heading", { level: 1 }),
        isH2: ctx.editor.isActive("heading", { level: 2 }),
        isH3: ctx.editor.isActive("heading", { level: 3 }),
        isH4: ctx.editor.isActive("heading", { level: 4 }),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        isBlockquote: ctx.editor.isActive("blockquote"),
        isCodeBlock: ctx.editor.isActive("codeBlock"),
        isCode: ctx.editor.isActive("code"),
        isLink: ctx.editor.isActive("link"),
        isTable: ctx.editor.isActive("table"),
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
        wordCount: ctx.editor.storage.characterCount?.words?.() ?? 0,
        charCount: ctx.editor.storage.characterCount?.characters?.() ?? 0,
      };
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor || !e.target.files?.length) return;
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "editor");

      const loadingToast = toast.loading("Uploading image...");

      try {
        const res = await fetch("/api/blog/media/upload", {
          method: "POST",
          body: formData,
        }).then((r) => r.json());

        if (res.success) {
          editor.chain().focus().setImage({ src: res.url, alt: file.name }).run();
          toast.success("Image uploaded and embedded", { id: loadingToast });
        } else {
          toast.error(res.error || "Upload failed", { id: loadingToast });
        }
      } catch {
        toast.error("Upload failed", { id: loadingToast });
      }

      e.target.value = "";
    },
    [editor]
  );

  const addTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const handleToolbarWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  if (!editor) return null;

  const MenuButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      className={`p-2 rounded hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0 ${
        isActive ? "bg-secondary/15 text-secondary hover:bg-secondary/20 font-bold" : "text-on-surface-variant/80"
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-outline-variant/30 mx-1 shrink-0" />;

  return (
    <div className="relative border border-outline-variant/30 rounded-xl bg-surface-container-lowest focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/15 transition-all w-full min-w-0 max-w-full">
      {/* ── Sticky Rich Text Editor Toolbar ──────────────────────────────── */}
      <div
        onMouseDown={(e) => e.preventDefault()}
        onWheel={handleToolbarWheel}
        className="sticky top-0 z-30 flex flex-nowrap items-center gap-1 p-2 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/20 shadow-xs rounded-t-xl overflow-x-auto w-full min-w-0 select-none touch-pan-x shrink-0 scrollbar-none"
      >
        {/* Text Formatting */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editorState?.isBold ?? false}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editorState?.isItalic ?? false}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editorState?.isUnderline ?? false}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editorState?.isStrike ?? false}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editorState?.isCode ?? false}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </MenuButton>

        <Divider />

        {/* Headings */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editorState?.isH1 ?? false}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editorState?.isH2 ?? false}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editorState?.isH3 ?? false}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          isActive={editorState?.isH4 ?? false}
          title="Heading 4"
        >
          <Heading4 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={false}
          title="Paragraph"
        >
          <AlignLeft className="w-4 h-4" />
        </MenuButton>

        <Divider />

        {/* Lists & Structure */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editorState?.isBulletList ?? false}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editorState?.isOrderedList ?? false}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editorState?.isBlockquote ?? false}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editorState?.isCodeBlock ?? false}
          title="Code Block"
        >
          <span className="font-mono text-[10px] font-bold px-0.5">{`</>`}</span>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </MenuButton>

        <Divider />

        {/* Media & Links */}
        <MenuButton
          onClick={setLink}
          isActive={editorState?.isLink ?? false}
          title="Insert / Edit Link"
        >
          <LinkIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={addImage}
          title="Insert Image by URL"
        >
          <ImageIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={addTable}
          isActive={editorState?.isTable ?? false}
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </MenuButton>

        {/* File upload for images */}
        <label
          className="p-2 rounded hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer text-on-surface-variant/80 flex items-center shrink-0"
          title="Upload Image"
          onMouseDown={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <span className="text-[10px] font-bold">IMG↑</span>
        </label>

        <Divider />

        {/* History */}
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!(editorState?.canUndo ?? false)}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!(editorState?.canRedo ?? false)}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* ── Editor Content Area ─────────────────────────────── */}
      <EditorContent editor={editor} />

      {/* ── Footer Status Bar ──────────────────────────────── */}
      <div className="flex justify-between items-center px-4 py-2 bg-surface-container-low/20 border-t border-outline-variant/10 text-[10px] text-on-surface-variant/50 font-mono rounded-b-xl">
        <span className="flex items-center gap-1 text-secondary/80">
          <Sparkles className="w-3 h-3" /> Rich Text Powered
        </span>
        <span>
          {(editorState?.wordCount ?? 0) > 0
            ? `${editorState?.wordCount} words · ${editorState?.charCount} chars`
            : "Start writing..."}
        </span>
      </div>
    </div>
  );
}
