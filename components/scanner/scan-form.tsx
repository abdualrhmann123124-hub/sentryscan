"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestScan, type ScanApiResponse } from "@/lib/scanner/client";

export function ScanForm({ onResult }: { onResult: (report: ScanApiResponse) => void }) {
  const [target, setTarget] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: requestScan,
    onSuccess: (data) => onResult(data),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (target.trim().length < 3) {
      setValidationError("Enter a domain, e.g. example.com");
      return;
    }

    mutation.mutate(target.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="example.com"
            aria-label="Domain to scan"
            disabled={mutation.isPending}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <Button type="submit" size="lg" disabled={mutation.isPending} className="sm:w-40">
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Scanning
            </>
          ) : (
            <>
              <Search className="h-4 w-4" /> Scan
            </>
          )}
        </Button>
      </div>
      {(validationError || mutation.isError) && (
        <p className="mt-3 font-mono text-sm text-alert">
          {validationError ?? (mutation.error as Error)?.message}
        </p>
      )}
      <p className="mt-3 font-mono text-xs text-ink-faint">
        only scan domains you own or are authorized to test.
      </p>
    </form>
  );
}
