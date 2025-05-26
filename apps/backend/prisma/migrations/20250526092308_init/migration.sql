-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female', 'Other');

-- CreateTable
CREATE TABLE "User" (
    "uuid" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[],
    "status" "Status" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMPTZ,
    "email" TEXT,
    "sex" "Sex",
    "age" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
