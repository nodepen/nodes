CREATE SCHEMA "speckle";
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"model_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "speckle"."models" (
	"model_id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "speckle"."projects" (
	"project_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_model_id_models_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "speckle"."models"("model_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speckle"."models" ADD CONSTRAINT "models_project_id_projects_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "speckle"."projects"("project_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speckle"."models" ADD CONSTRAINT "models_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speckle"."projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;