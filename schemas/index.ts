import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
});

export const ProjectSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().min(15, {
    message: "Description should be atleast 15 characters long",
  }),
  githubUrl: z.string().min(1, {
    message: "Github URl is required",
  }),
  websiteUrl: z.string().min(1, {
    message: "Website URl is required",
  }),
  category: z.string({
    message: "Please select a category",
  }),
  posterImage: z.string({
    message: "Please upload the Poster Image",
  }),
});
