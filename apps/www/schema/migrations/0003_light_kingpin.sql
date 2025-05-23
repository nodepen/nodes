ALTER TABLE "documents" ADD COLUMN "document" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "revision" integer DEFAULT 1 NOT NULL;