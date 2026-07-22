import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Section variant="muted" className="pt-32 pb-16">
        <Container className="text-center max-w-3xl">
          <div className="h-4 bg-slate-200 rounded-full w-24 mx-auto mb-6 animate-pulse" />
          <div className="h-10 bg-slate-200 rounded-xl w-3/4 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-slate-200 rounded-lg w-1/2 mx-auto animate-pulse" />
        </Container>
      </Section>

      <Section variant="white" spacing="large">
        <Container>
          <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-9 bg-slate-100 rounded-full w-24 animate-pulse shrink-0" />
            ))}
          </div>

          <div className="mb-16 bg-slate-50 rounded-3xl border border-slate-100 h-[400px] animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100/80 overflow-hidden h-[420px] flex flex-col justify-between p-6">
                <div className="h-48 bg-slate-100 rounded-xl mb-4 animate-pulse" />
                <div className="space-y-3 flex-1">
                  <div className="h-3 bg-slate-100 rounded-full w-1/3 animate-pulse" />
                  <div className="h-6 bg-slate-100 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded-lg w-5/6 animate-pulse" />
                </div>
                <div className="h-8 bg-slate-100 rounded-lg w-1/4 mt-6 animate-pulse" />
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
