import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1783490991014 implements MigrationInterface {
    name = 'InitialSchema1783490991014';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "profile_picture" character varying, "email_verified" boolean NOT NULL DEFAULT false, "status" "public"."users_status_enum" NOT NULL, "storage_used" bigint NOT NULL DEFAULT '0', "root_folder_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_ffc1e12ddff770c3b3be2e4391" UNIQUE ("root_folder_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "folders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "owner_id" uuid NOT NULL, "parent_folder_id" uuid, CONSTRAINT "UQ_42032bdbc6ea051625bf69082a5" UNIQUE ("parent_folder_id", "owner_id", "name"), CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_4ef163a27ebad84f1171e74dd0" ON "folders"  ("parent_folder_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_ecee72de3b100ef0bbebe47f3c" ON "folders"  ("owner_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "extension" character varying NOT NULL, "size" bigint NOT NULL, "mime_type" character varying NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "folder_id" uuid NOT NULL, "owner_id" uuid NOT NULL, CONSTRAINT "UQ_0cdd5290016d9bb1eb0a075074f" UNIQUE ("folder_id", "owner_id", "name"), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_27bc84e6954d2fa309a4f61326" ON "files"  ("folder_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_4bc1db1f4f34ec9415acd88afd" ON "files"  ("owner_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_ffc1e12ddff770c3b3be2e4391e" FOREIGN KEY ("root_folder_id") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "folders" ADD CONSTRAINT "FK_ecee72de3b100ef0bbebe47f3c4" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "folders" ADD CONSTRAINT "FK_4ef163a27ebad84f1171e74dd0c" FOREIGN KEY ("parent_folder_id") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "files" ADD CONSTRAINT "FK_27bc84e6954d2fa309a4f61326f" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "files" ADD CONSTRAINT "FK_4bc1db1f4f34ec9415acd88afdb" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "files" DROP CONSTRAINT "FK_4bc1db1f4f34ec9415acd88afdb"`,
        );
        await queryRunner.query(
            `ALTER TABLE "files" DROP CONSTRAINT "FK_27bc84e6954d2fa309a4f61326f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "folders" DROP CONSTRAINT "FK_4ef163a27ebad84f1171e74dd0c"`,
        );
        await queryRunner.query(
            `ALTER TABLE "folders" DROP CONSTRAINT "FK_ecee72de3b100ef0bbebe47f3c4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_ffc1e12ddff770c3b3be2e4391e"`,
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_4bc1db1f4f34ec9415acd88afd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_27bc84e6954d2fa309a4f61326"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ecee72de3b100ef0bbebe47f3c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4ef163a27ebad84f1171e74dd0"`);
        await queryRunner.query(`DROP TABLE "folders"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    }
}
