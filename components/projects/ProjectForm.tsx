"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProjectSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ProjectFormWrapper } from "@/components/projects/ProjectFormWrapper";
import { categoryFilters } from "@/lib/constants";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import defaultImagePreview from "@/public/default_image.png";
import { createNewProject, updateProject } from "@/actions/project";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { ProjectDetails } from "@/types";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { toast } from "sonner";

interface ProjectFormProps {
  type: string;
  project?: ProjectDetails;
}

export const ProjectForm = ({ type, project }: ProjectFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.posterImage || null
  );
  const { pending } = useFormStatus();
  const router = useRouter();

  // Determine the action based on form type (create or edit)
  const projectId = project?.id;
  const projectAction =
    type === "create" ? createNewProject : updateProject.bind(null, projectId);
  const [state, formAction] = useFormState(projectAction, {
    message: "",
    success: false,
  });

  // Handle form submission
  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
        router.push(DEFAULT_LOGIN_REDIRECT);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  // Initialize form with Zod schema validation
  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      posterImage: "",
      title: project?.title || "",
      description: project?.description || "",
      websiteUrl: project?.websiteUrl || "",
      githubUrl: project?.githubUrl || "",
      category: project?.category || "",
    },
  });

  // Handle image file selection and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("image")) {
      return toast.error("Please upload an Image file");
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <ProjectFormWrapper
      headerLabel={type === "edit" ? "Edit Project" : "Share a Project"}
    >
      <Form {...form}>
        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            {/* Poster Image upload field */}
            <FormField
              control={form.control}
              name="posterImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poster Image</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Add the poster image of your project"
                      disabled={pending}
                      type="file"
                      onChange={(event) => {
                        handleImageChange(event);
                        field.onChange(event);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image preview */}
            <FormItem>
              <FormLabel>Poster Image Preview</FormLabel>
              <FormControl>
                <Image
                  src={imagePreview || defaultImagePreview}
                  alt="Image Preview"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Project Title field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="My Project"
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add a description of your project"
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Github URL field */}
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Add the Github URL of your project"
                      disabled={pending}
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website URL field */}
            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Add the Website URL of your project"
                      disabled={pending}
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category selection field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    name="category"
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder="Select a category for your project" />
                        ) : (
                          "Select a category for your project"
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryFilters.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full py-4 md:py-0 bg-[#6F38C5]"
            disabled={pending}
          >
            {type === "create" ? "Add Project" : "Update Project"}
          </Button>
        </form>
      </Form>
    </ProjectFormWrapper>
  );
};