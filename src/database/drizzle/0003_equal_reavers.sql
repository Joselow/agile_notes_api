ALTER TABLE "notes" ADD COLUMN "category" varchar(50) DEFAULT 'Apunte' NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "is_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "origin" varchar(30) DEFAULT 'whatsapp' NOT NULL;