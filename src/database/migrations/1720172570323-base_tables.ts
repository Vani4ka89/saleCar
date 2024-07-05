import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseTables1720172570323 implements MigrationInterface {
    name = 'BaseTables1720172570323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."advertisement_currency_enum" AS ENUM('UAH', 'USD', 'EUR')`);
        await queryRunner.query(`CREATE TABLE "advertisement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" text NOT NULL, "description" text, "brand" text NOT NULL, "model" text NOT NULL, "price" integer NOT NULL, "year" integer NOT NULL, "currency" "public"."advertisement_currency_enum" NOT NULL, "priceUSD" numeric, "priceEUR" numeric, "priceUAH" numeric, "exchangeRate" text NOT NULL, "region" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "image" text, "editCount" integer NOT NULL DEFAULT '0', "user_id" uuid NOT NULL, CONSTRAINT "PK_c8486834e5ef704ec05b7564d89" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh-token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_62793706ec70c44e0bb5f448923" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'buyer', 'dealer', 'manager', 'mechanic', 'seller')`);
        await queryRunner.query(`CREATE TYPE "public"."user_accounttype_enum" AS ENUM('basic', 'premium')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" text, "email" text NOT NULL, "password" text NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'seller', "accountType" "public"."user_accounttype_enum" NOT NULL DEFAULT 'basic', "image" text, "banned" boolean NOT NULL DEFAULT false, "banReason" text, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "viewDate" TIMESTAMP NOT NULL, "user_id" uuid NOT NULL, "carAd_id" uuid NOT NULL, CONSTRAINT "PK_86cfb9e426c77d60b900fe2b543" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_1c55264f46f9b1accd4eff08ed6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh-token" ADD CONSTRAINT "FK_0f25c0e45e3acbd833ca32ea671" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_8defef1e2b3d61de4d5a8d7a1a2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_e49a952a378b29e8995743720cf" FOREIGN KEY ("carAd_id") REFERENCES "advertisement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_e49a952a378b29e8995743720cf"`);
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_8defef1e2b3d61de4d5a8d7a1a2"`);
        await queryRunner.query(`ALTER TABLE "refresh-token" DROP CONSTRAINT "FK_0f25c0e45e3acbd833ca32ea671"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_1c55264f46f9b1accd4eff08ed6"`);
        await queryRunner.query(`DROP TABLE "view"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_accounttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "refresh-token"`);
        await queryRunner.query(`DROP TABLE "advertisement"`);
        await queryRunner.query(`DROP TYPE "public"."advertisement_currency_enum"`);
    }

}
