import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/sanity.image";

interface AuthorCardProps {
  author: {
    name: string;
    avatar?: any;
  };
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const avatarUrl = author.avatar
    ? urlFor(author.avatar).width(120).height(120).url()
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuB5_VqrmGo0Yyz2eCzbJ2FcbcrPZN_jWkAN6euuVQzxrMkBQ2CfDpOjYWVe3aq_AIEswpv2MS4XO9VgfvgOFIYMSC9rIm3SjEQNwjrtmhhJmp1ft5nzoPat2z9QwmJwgn0zJZJsMIPoV_gQAD4p0NGbbo0TUaWEuuKEfg6nSP7dh7vq5hNBrqxnYyEYRa9qzr-Tg45hOyEIhgvax0BWxfDDB6uswBvAKj-sJbsOilWcd1wIOkM4PBdSVCjBDaXsnpVcMmsk_TKfO8Xk";

  return (
    <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 w-full">
      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-sm bg-slate-100">
        <Image
          src={avatarUrl}
          alt={author.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="text-left">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Written by
        </span>
        <h5 className="text-sm font-bold text-navy-dark leading-tight mt-0.5">
          {author.name}
        </h5>
      </div>
    </div>
  );
}
